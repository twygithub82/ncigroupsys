using AutoMapper;
using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Models.Inventory;
using IDMS.Service.GqlTypes;
using IDMS.Cleaning.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class CleaningMutation
    {
        //[Authorize]
        public async Task<int> AddCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, cleaning cleaning)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                cleaning newCleaning = cleaning;
                newCleaning.guid = Util.GenerateGUID();
                newCleaning.create_by = user;
                newCleaning.create_dt = currentDateTime;

                newCleaning.status_cv = string.IsNullOrEmpty(cleaning.status_cv) ? CurrentServiceStatus.APPROVED : cleaning.status_cv;

                if (!string.IsNullOrEmpty(cleaning.job_no))
                    newCleaning.job_no = cleaning.job_no;
                else
                    newCleaning.job_no = cleaning.storing_order_tank.job_no;

                await context.cleaning.AddAsync(newCleaning);
                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, cleaning cleaning)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaning == null)
                    throw new GraphQLException(new Error("Cleaning object cannot be null or empty.", "ERROR"));

                var updateCleaning = new cleaning() { guid = cleaning.guid };
                context.cleaning.Attach(updateCleaning);

                updateCleaning.job_no = cleaning.job_no;
                updateCleaning.remarks = cleaning.remarks;
                updateCleaning.update_by = user;
                updateCleaning.update_dt = currentDateTime;

                if (ObjectAction.APPROVE.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                    updateCleaning.approve_dt = cleaning.approve_dt;
                    updateCleaning.approve_by = user;
                }
                else if (ObjectAction.KIV.EqualsIgnore(cleaning.action))
                    updateCleaning.status_cv = CurrentServiceStatus.KIV;
                else if (ObjectAction.IN_PROGRESS.EqualsIgnore(cleaning.action))
                    updateCleaning.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                else if (ObjectAction.COMPLETE.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.status_cv = CurrentServiceStatus.COMPLETED;
                    updateCleaning.complete_by = user;
                    updateCleaning.complete_dt = currentDateTime;

                    if (string.IsNullOrEmpty(cleaning.sot_guid))
                        throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                    if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
                        //if no other cleaning estimate or all completed. then we check cross process tank movement
                        await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
                }
                else if (ObjectAction.NA.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.na_dt = cleaning.na_dt;
                    updateCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                    if (string.IsNullOrEmpty(cleaning.sot_guid))
                        throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                    if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
                        //if no other cleaning estimate or all completed. then we check cross process tank movement
                        await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }

        public async Task<int> AbortCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, CleaningJobOrder cleaningJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaningJobOrder == null)
                    throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));

                var abortCleaning = new cleaning() { guid = cleaningJobOrder.guid };
                context.cleaning.Attach(abortCleaning);

                abortCleaning.update_by = user;
                abortCleaning.update_dt = currentDateTime;
                abortCleaning.status_cv = CurrentServiceStatus.NO_ACTION;
                abortCleaning.remarks = cleaningJobOrder.remarks;

                foreach (var item in cleaningJobOrder.job_order)
                {
                    var job_order = new job_order() { guid = item.guid };
                    context.job_order.Attach(job_order);
                    if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                    {
                        job_order.status_cv = CurrentServiceStatus.CANCELED;
                        job_order.update_by = user;
                        job_order.update_dt = currentDateTime;
                    }
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }


        private async Task<bool> TankMovementCheckInternal(ApplicationServiceDBContext context, string processType, string sotGuid, string processGuid)
        {
            //First check if still have other steaming estimate havnt completed
            string tableName = processType;

            var sqlQuery = $@"SELECT guid FROM {tableName} 
                            WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}', '{CurrentServiceStatus.PENDING}')
                            AND sot_guid = '{sotGuid}' AND guid != '{processGuid}' AND delete_dt IS NULL";
            var result = await context.Database.SqlQueryRaw<string>(sqlQuery).ToListAsync();

            if (result.Count > 0)
                return true;
            else
                return false;
        }

        private async Task TankMovementCheckCrossProcess(ApplicationServiceDBContext context, string sotGuid, string user, long currentDateTime)
        {
            //if no other steaming estimate or all completed. then we check cross process tank movement
            var sot = await context.storing_order_tank.FindAsync(sotGuid);
            if (!string.IsNullOrEmpty(sot?.purpose_repair_cv))
                sot.tank_status_cv = TankMovementStatus.REPAIR;
            else
                sot.tank_status_cv = TankMovementStatus.STORAGE;
            sot.update_by = user;
            sot.update_dt = currentDateTime;
        }

        //public async Task<int> CompleteQCCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, CleaningJobOrder cleaningJobOrder)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        if (cleaningJobOrder == null)
        //            throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));

        //        using var transaction = context.Database.BeginTransaction();
        //        try
        //        {
        //            var completeCleaning = new cleaning() { guid = cleaningJobOrder.guid };
        //            context.cleaning.Attach(completeCleaning);

        //            completeCleaning.update_by = user;
        //            completeCleaning.update_dt = currentDateTime;
        //            completeCleaning.status_cv = CurrentServiceStatus.QC;
        //            completeCleaning.remarks = cleaningJobOrder.remarks;

        //            //Tank handling
        //            if (string.IsNullOrEmpty(cleaningJobOrder.sot_guid))
        //                throw new GraphQLException(new Error($"Tank guid cannot be null or empty", "ERROR"));

        //            //var sot = new storing_order_tank() { guid = cleaningJobOrder.sot_guid };
        //            //context.storing_order_tank.Attach(sot);
        //            var sot = await context.storing_order_tank.Where(t => t.guid == cleaningJobOrder.sot_guid).FirstOrDefaultAsync();
        //            sot.tank_status_cv = string.IsNullOrEmpty(sot?.purpose_repair_cv) ? TankMovementStatus.STORAGE : TankMovementStatus.REPAIR;
        //            //sot.tank_status_cv = TankMovementStatus.STORAGE;
        //            sot.update_by = user;
        //            sot.update_dt = currentDateTime;

        //            //job_orders handling
        //            var guids = string.Join(",", cleaningJobOrder.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
        //            string sql = $"UPDATE job_order SET qc_dt = {currentDateTime}, qc_by = '{user}', update_dt = {currentDateTime}, " +
        //                    $"update_by = '{user}' WHERE guid IN ({guids})";
        //            context.Database.ExecuteSqlRaw(sql);

        //            var res = await context.SaveChangesAsync();

        //            await transaction.CommitAsync();
        //            return res;
        //        }
        //        catch (Exception ex)
        //        {
        //            // Rollback in case of an error
        //            transaction.Rollback();
        //            throw;
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}
    }
}
