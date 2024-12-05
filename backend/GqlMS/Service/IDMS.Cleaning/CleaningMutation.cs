using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using IDMS.Cleaning.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class CleaningMutation
    {
        //[Authorize]
        public async Task<int> AddCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, cleaning cleaning)
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

                //Handing of SOT movement status
                if (string.IsNullOrEmpty(cleaning.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));
                var sot = new storing_order_tank() { guid = cleaning.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.tank_status_cv = TankMovementStatus.CLEANING;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, cleaning cleaning)
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

                switch (cleaning.action.ToUpper())
                {
                    case ObjectAction.APPROVE:
                        updateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                        updateCleaning.approve_dt = currentDateTime;
                        updateCleaning.approve_by = user;

                        await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.APPROVE, processGuid: cleaning.guid);
                        break;
                    case ObjectAction.KIV:
                        updateCleaning.status_cv = CurrentServiceStatus.KIV;
                        break;
                    case ObjectAction.IN_PROGRESS:
                        //Cleaning no to check JobInProgress as it only have 1 job to 1 cleaning all time
                        updateCleaning.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                        break;
                    case ObjectAction.ASSIGN:
                        updateCleaning.status_cv = CurrentServiceStatus.ASSIGNED;
                        break;
                    case ObjectAction.PARTIAL:
                        updateCleaning.status_cv = CurrentServiceStatus.PARTIAL;
                        break;
                    case ObjectAction.COMPLETE:
                        updateCleaning.status_cv = CurrentServiceStatus.COMPLETED;
                        updateCleaning.complete_by = user;
                        updateCleaning.complete_dt = currentDateTime;

                        if (string.IsNullOrEmpty(cleaning.sot_guid))
                            throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                        if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
                            //if no other cleaning estimate or all completed. then we check cross process tank movement
                            await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
                        break;
                    case ObjectAction.NA:
                        updateCleaning.na_dt = currentDateTime;
                        updateCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                        if (string.IsNullOrEmpty(cleaning.sot_guid))
                            throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                        if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
                            //if no other cleaning estimate or all completed. then we check cross process tank movement
                            await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
                        break;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }


        //public async Task<int> UpdateCleaningStatus(ApplicationServiceDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, CleaningStatusRequest cleaning)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        if (cleaning == null)
        //            throw new GraphQLException(new Error("Cleaning object cannot be null or empty.", "ERROR"));

        //        var updateCleaning = new cleaning() { guid = cleaning.guid };
        //        context.cleaning.Attach(updateCleaning);

        //        updateCleaning.remarks = cleaning.remarks;
        //        updateCleaning.update_by = user;
        //        updateCleaning.update_dt = currentDateTime;

        //        switch (cleaning.action.ToUpper())
        //        {
        //            //case ObjectAction.APPROVE:
        //            //    updateCleaning.status_cv = CurrentServiceStatus.APPROVED;
        //            //    updateCleaning.approve_dt = currentDateTime;
        //            //    updateCleaning.approve_by = user;

        //            //    await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.APPROVE, processGuid: cleaning.guid);
        //            //    break;
        //            case ObjectAction.KIV:
        //                updateCleaning.status_cv = CurrentServiceStatus.KIV;
        //                break;
        //            case ObjectAction.IN_PROGRESS:
        //                //Cleaning no to check JobInProgress as it only have 1 job to 1 cleaning all time
        //                updateCleaning.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
        //                break;
        //            case ObjectAction.ASSIGN:
        //                updateCleaning.status_cv = CurrentServiceStatus.ASSIGNED;
        //                break;
        //            case ObjectAction.PARTIAL:
        //                updateCleaning.status_cv = CurrentServiceStatus.PARTIAL;
        //                break;
        //            case ObjectAction.COMPLETE:
        //                updateCleaning.status_cv = CurrentServiceStatus.COMPLETED;
        //                updateCleaning.complete_by = user;
        //                updateCleaning.complete_dt = currentDateTime;

        //                if (string.IsNullOrEmpty(cleaning.sot_guid))
        //                    throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

        //                if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
        //                    //if no other cleaning estimate or all completed. then we check cross process tank movement
        //                    await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
        //                break;
        //            case ObjectAction.NA:
        //                updateCleaning.na_dt = currentDateTime;
        //                updateCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

        //                if (string.IsNullOrEmpty(cleaning.sot_guid))
        //                    throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

        //                if (!await TankMovementCheckInternal(context, "cleaning", cleaning.sot_guid, cleaning.guid))
        //                    //if no other cleaning estimate or all completed. then we check cross process tank movement
        //                    await TankMovementCheckCrossProcess(context, cleaning.sot_guid, user, currentDateTime);
        //                break;
        //        }

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }

        //}

        //public async Task<int> ApproveCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, cleaning cleaning)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        if (cleaning == null)
        //            throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));

        //        var approveCleaning = new cleaning() { guid = cleaning.guid };
        //        context.cleaning.Attach(approveCleaning);

        //        approveCleaning.update_by = user;
        //        approveCleaning.update_dt = currentDateTime;
        //        approveCleaning.status_cv = CurrentServiceStatus.APPROVED;
        //        approveCleaning.remarks = cleaning.remarks;

        //        //job order handling
        //        await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.APPROVE, processGuid: cleaning.guid);

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

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

                //job order handling
                await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.CANCEL, jobOrders: cleaningJobOrder.job_order);

                //Status condition chehck handling
                if (await GqlUtils.StatusChangeConditionCheck(context, "cleaning", cleaningJobOrder.guid, CurrentServiceStatus.COMPLETED))
                {
                    abortCleaning.status_cv = CurrentServiceStatus.COMPLETED;
                    abortCleaning.complete_dt = currentDateTime;
                }
                else
                    abortCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                if (string.IsNullOrEmpty(cleaningJobOrder.sot_guid))
                    throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                if (!await TankMovementCheckInternal(context, "cleaning", cleaningJobOrder.sot_guid, cleaningJobOrder.guid))
                    //if no other cleaning estimate or all completed. then we check cross process tank movement
                    await TankMovementCheckCrossProcess(context, cleaningJobOrder.sot_guid, user, currentDateTime);

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
                            WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}', 
                            '{CurrentServiceStatus.PENDING}', '{CurrentServiceStatus.PARTIAL}', '{CurrentServiceStatus.ASSIGNED}')
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
