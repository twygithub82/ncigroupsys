using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Service.GqlTypes;
using IDMS.Residue.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory;
using System.Globalization;
using IDMS.Repair.GqlTypes.LocalModel;


namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class ResidueMutation
    {
        public async Task<int> AddResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, residue residue)
        {
            try
            {
                if (residue == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                residue newResidue = new residue();
                newResidue.guid = Util.GenerateGUID();
                newResidue.sot_guid = residue.sot_guid;
                newResidue.bill_to_guid = residue.bill_to_guid;
                newResidue.estimate_no = residue.estimate_no;
                newResidue.remarks = residue.remarks;
                newResidue.job_no = residue.job_no;
                newResidue.status_cv = CurrentServiceStatus.PENDING;
                newResidue.allocate_by = residue.allocate_by;
                newResidue.allocate_dt = residue.allocate_dt;
                newResidue.create_by = user;
                newResidue.create_dt = currentDateTime;

                await context.residue.AddAsync(newResidue);

                //Handling For Template_est_part
                IList<residue_part> partList = new List<residue_part>();
                foreach (var newPart in residue.residue_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.residue_guid = newResidue.guid;
                    partList.Add(newPart);
                }
                await context.residue_part.AddRangeAsync(partList);

                //Handing of SOT movement status
                if (string.IsNullOrEmpty(residue.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));
                var sot = new storing_order_tank() { guid = residue.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.tank_status_cv = TankMovementStatus.CLEANING;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                var res = await context.SaveChangesAsync();
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, residue residue)
        {
            try
            {
                if (residue == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null for update", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var updatedResidue = new residue() { guid = residue.guid };
                context.residue.Attach(updatedResidue);

                updatedResidue.update_by = user;
                updatedResidue.update_dt = currentDateTime;
                updatedResidue.job_no = residue.job_no;
                updatedResidue.bill_to_guid = residue.bill_to_guid;
                updatedResidue.remarks = residue.remarks;

                //Handling For Template_est_part
                foreach (var item in residue.residue_part)
                {
                    if (ObjectAction.NEW.EqualsIgnore(item.action))
                    {
                        item.guid = Util.GenerateGUID();
                        item.create_by = user;
                        item.create_dt = currentDateTime;
                        item.residue_guid = residue.guid;
                        await context.residue_part.AddAsync(item);
                    }
                    else if (ObjectAction.EDIT.EqualsIgnore(item.action))
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Residue part guid cannot be null or empty for update", "ERROR"));

                        var part = new residue_part() { guid = item.guid };
                        context.residue_part.Attach(part);

                        part.update_by = user;
                        part.update_dt = currentDateTime;
                        part.quantity = item.quantity;
                        part.cost = item.cost;
                        part.description = item.description;
                        part.tariff_residue_guid = item.tariff_residue_guid;
                    }
                    else if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                    {
                        var part = new residue_part() { guid = item.guid };
                        context.residue_part.Attach(part);
                        part.update_by = user;
                        part.update_dt = currentDateTime;
                        part.delete_dt = currentDateTime;
                    }
                }

                var res = await context.SaveChangesAsync();
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> ApproveResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, residue residue)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (residue != null && !string.IsNullOrEmpty(residue.guid) && !string.IsNullOrEmpty(residue.bill_to_guid))
                {
                    var approveResidue = new residue() { guid = residue.guid };
                    context.residue.Attach(approveResidue);

                    approveResidue.update_by = user;
                    approveResidue.update_dt = currentDateTime;
                    approveResidue.bill_to_guid = residue.bill_to_guid;
                    approveResidue.job_no = residue.job_no;
                    approveResidue.remarks = residue.remarks;

                    //Only change when first time approve
                    if (CurrentServiceStatus.PENDING.EqualsIgnore(residue.status_cv))
                    {
                        approveResidue.status_cv = CurrentServiceStatus.APPROVED;
                        approveResidue.approve_by = user;
                        approveResidue.approve_dt = currentDateTime;
                    }

                    if (residue.residue_part != null)
                    {
                        foreach (var item in residue.residue_part)
                        {
                            var part = new residue_part() { guid = item.guid };
                            context.residue_part.Attach(part);

                            part.approve_part = item.approve_part;
                            part.approve_cost = item.approve_cost;
                            part.approve_qty = item.approve_qty;
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                        }
                    }

                    await GqlUtils.JobOrderHandling(context, "residue", user, currentDateTime, ObjectAction.APPROVE, processGuid: residue.guid);
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> RollbackResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<ResidueRequest> residue)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in residue)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var rollbackResidue = new residue() { guid = item.guid };
                        context.residue.Attach(rollbackResidue);

                        rollbackResidue.update_by = user;
                        rollbackResidue.update_dt = currentDateTime;
                        rollbackResidue.status_cv = CurrentServiceStatus.PENDING;
                        rollbackResidue.remarks = item.remarks;

                        if (string.IsNullOrEmpty(item.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = item.customer_guid;
                        var residuePart = await context.residue_part.Where(r => r.residue_guid == item.guid &&
                                                                            (!string.IsNullOrEmpty(r.tariff_residue_guid)) &&
                                                                            (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                        if (item.is_approved)
                        {
                            foreach (var part in residuePart)
                            {
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.approve_part = null;
                                part.approve_cost = part.cost;
                                part.approve_qty = part.quantity;
                            }
                        }
                        else
                        {
                            var partsTarifResidueGuids = residuePart.Select(x => x.tariff_residue_guid).ToArray();
                            var packageResidue = await context.package_residue.Where(r => partsTarifResidueGuids.Contains(r.tariff_residue_guid) &&
                                                r.customer_company_guid == customerGuid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                            foreach (var part in residuePart)
                            {
                                //var estPart = new repair_est_part() { guid = part.guid }; 
                                //context.repair_est_part.Attach(estPart);
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.cost = packageResidue.Where(r => r.tariff_residue_guid == part.tariff_residue_guid).Select(r => r.cost).First();
                            }
                        }
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

        public async Task<int> UpdateResidueStatus(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, ResidueStatusRequest residue)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();
                bool tankMovementCheck = false;

                if (residue == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                var updateResidue = new residue() { guid = residue.guid };
                context.residue.Attach(updateResidue);
                updateResidue.update_by = user;
                updateResidue.update_dt = currentDateTime;
                updateResidue.remarks = residue.remarks;

                switch (residue.action.ToUpper())
                {
                    case ObjectAction.IN_PROGRESS:
                        if (await GqlUtils.StatusChangeConditionCheck(context, "residue", residue.guid, CurrentServiceStatus.JOB_IN_PROGRESS))
                            updateResidue.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                        break;
                    case ObjectAction.CANCEL:
                        updateResidue.status_cv = CurrentServiceStatus.CANCELED;
                        break;
                    case ObjectAction.PARTIAL:
                        updateResidue.status_cv = CurrentServiceStatus.PARTIAL;
                        break;
                    case ObjectAction.ASSIGN:
                        updateResidue.status_cv = CurrentServiceStatus.ASSIGNED;
                        break;
                    case ObjectAction.COMPLETE:
                        if (string.IsNullOrEmpty(residue.sot_guid))
                            throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));

                        if (await GqlUtils.StatusChangeConditionCheck(context, "residue", residue.guid, CurrentServiceStatus.COMPLETED))
                        {
                            updateResidue.status_cv = CurrentServiceStatus.COMPLETED;
                            updateResidue.complete_by = user;
                            updateResidue.complete_dt = currentDateTime;
                        }
                        tankMovementCheck = true;
                        break;
                    case ObjectAction.NA:
                        if (string.IsNullOrEmpty(residue.sot_guid))
                            throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));

                        updateResidue.status_cv = CurrentServiceStatus.NO_ACTION;
                        updateResidue.na_dt = currentDateTime;

                        foreach (var item in residue.residuePartRequests)
                        {
                            var resPart = new residue_part() { guid = item.guid };
                            context.residue_part.Attach(resPart);
                            resPart.approve_part = false;
                            resPart.update_dt = currentDateTime;
                            resPart.update_by = user;
                        }

                        tankMovementCheck = true;
                        break;
                }
                var res = await context.SaveChangesAsync();

                if (tankMovementCheck)
                    await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, residue.sot_guid);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> AbortResidue(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, ResJobOrderRequest residueJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (residueJobOrder == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                var abortResidue = new residue() { guid = residueJobOrder.guid };
                context.residue.Attach(abortResidue);

                abortResidue.update_by = user;
                abortResidue.update_dt = currentDateTime;
                abortResidue.status_cv = CurrentServiceStatus.NO_ACTION;
                abortResidue.remarks = residueJobOrder.remarks;

                //Job order handling
                await GqlUtils.JobOrderHandling(context, "residue", user, currentDateTime, ObjectAction.CANCEL, jobOrders: residueJobOrder.job_order);

                //Status condition chehck handling
                if (await GqlUtils.StatusChangeConditionCheck(context, "residue", residueJobOrder.guid, CurrentServiceStatus.COMPLETED))
                {
                    abortResidue.status_cv = CurrentServiceStatus.COMPLETED;
                    abortResidue.complete_dt = currentDateTime;
                }
                else
                    abortResidue.status_cv = CurrentServiceStatus.NO_ACTION;

                //if (!await TankMovementCheckInternal(context, "residue", residueJobOrder.sot_guid, new List<string> { residueJobOrder.guid }))
                //    //if no other residue estimate or all completed. then we check cross process tank movement
                //    await TankMovementCheckCrossProcess(context, residueJobOrder.sot_guid, user, currentDateTime);

                var res = await context.SaveChangesAsync();
                await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, residueJobOrder.sot_guid);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> CompleteQCResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<ResJobOrderRequest> residueJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (residueJobOrder == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                foreach (var item in residueJobOrder)
                {
                    //Repair handling
                    var completedResidue = new residue() { guid = item.guid };
                    context.residue.Attach(completedResidue);
                    completedResidue.update_by = user;
                    completedResidue.update_dt = currentDateTime;
                    completedResidue.complete_dt = currentDateTime;
                    completedResidue.status_cv = CurrentServiceStatus.QC;
                    completedResidue.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    string sql = $"UPDATE job_order SET qc_dt = {currentDateTime}, qc_by = '{user}', update_dt = {currentDateTime}, " +
                            $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);
                }

                //Tank handling
                var sotGuid = residueJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                //var processGuid = string.Join(",", residueJobOrder.Select(j => j.guid).ToList().Select(g => $"'{g}'")); //repJobOrder.Select(r => r.guid).FirstOrDefault();
                if (string.IsNullOrEmpty(sotGuid))
                    throw new GraphQLException(new Error($"Tank guid cannot be null or empty", "ERROR"));

                var res = await context.SaveChangesAsync();
                await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, sotGuid);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> RollbackCompletedResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<ResJobOrderRequest> residueJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (residueJobOrder == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                foreach (var item in residueJobOrder)
                {
                    //Repair handling
                    var completedResidue = new residue() { guid = item.guid };
                    context.residue.Attach(completedResidue);
                    completedResidue.update_by = user;
                    completedResidue.update_dt = currentDateTime;
                    completedResidue.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                    completedResidue.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    string sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                                 $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);

                    //Timetable handling
                    var jobIdList = item.job_order.Select(j => j.guid).ToList();
                    var timeTables = await context.time_table.Where(t => jobIdList.Contains(t.job_order_guid)).ToListAsync();
                    foreach (var tt in timeTables)
                    {
                        tt.stop_time = null;
                        tt.update_by = user;
                        tt.update_dt = currentDateTime;
                    }
                }

                //Tank handling
                var sotGuid = residueJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                var tankStatus = residueJobOrder.Select(r => r.sot_status).FirstOrDefault();

                var sot = new storing_order_tank() { guid = sotGuid };
                context.storing_order_tank.Attach(sot);
                sot.update_by = user;
                sot.update_dt = currentDateTime;
                //sot.tank_status_cv = TankMovementStatus.REPAIR;
                if (tankStatus.EqualsIgnore(TankMovementStatus.STORAGE))
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                else
                {
                    var jobOrders = await context.job_order.Where(j => j.sot_guid == sotGuid & j.job_type_cv == JobType.RESIDUE).ToListAsync();
                    if (!jobOrders.Any(j => j.status_cv.Contains(JobStatus.IN_PROGRESS)))
                        sot.tank_status_cv = TankMovementStatus.CLEANING;
                }

                var res = await context.SaveChangesAsync();
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> RollbackJobInProgressResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<ResJobOrderRequest> residueJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (residueJobOrder == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                foreach (var item in residueJobOrder)
                {
                    //Repair handling
                    var completedResidue = new residue() { guid = item.guid };
                    context.residue.Attach(completedResidue);
                    completedResidue.update_by = user;
                    completedResidue.update_dt = currentDateTime;
                    completedResidue.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                    completedResidue.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    string sql = $"UPDATE job_order SET team_guid = NULL, status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                                 $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);

                    //Timetable handling
                    var jobIdList = item.job_order.Select(j => j.guid).ToList();
                    var timeTables = await context.time_table.Where(t => jobIdList.Contains(t.job_order_guid)).ToListAsync();
                    foreach (var tt in timeTables)
                    {
                        tt.delete_dt = currentDateTime;
                        tt.update_by = user;
                        tt.update_dt = currentDateTime;
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

        private async Task<bool> TankMovementCheckInternal(ApplicationServiceDBContext context, string processType, string sotGuid, List<string> processGuidList)
        {
            //First check if still have other steaming estimate havnt completed
            var processGuid = string.Join(",", processGuidList.Select(g => $"'{g}'"));
            string tableName = processType;

            var sqlQuery = $@"SELECT guid FROM {tableName} 
                            WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}', 
                            '{CurrentServiceStatus.PENDING}', '{CurrentServiceStatus.PARTIAL}', '{CurrentServiceStatus.ASSIGNED}')
                            AND sot_guid = '{sotGuid}' AND guid NOT IN ({processGuid}) AND delete_dt IS NULL";
            var result = await context.Database.SqlQueryRaw<string>(sqlQuery).ToListAsync();

            if (result.Count > 0)
                return true;
            else
                return false;
        }

        private async Task TankMovementCheckCrossProcess(ApplicationServiceDBContext context, string sotGuid, string user, long currentDateTime)
        {
            var sot = await context.storing_order_tank.FindAsync(sotGuid);


            if (sot?.purpose_cleaning ?? false)
                sot.tank_status_cv = TankMovementStatus.CLEANING;
            else if (!string.IsNullOrEmpty(sot?.purpose_repair_cv))
                sot.tank_status_cv = TankMovementStatus.REPAIR;
            else
                sot.tank_status_cv = TankMovementStatus.STORAGE;
            sot.update_by = user;
            sot.update_dt = currentDateTime;
        }

        //private async Task<bool> JobInProgessCheck(ApplicationServiceDBContext context, string processGuid)
        //{
        //    try
        //    {
        //        var residue = await context.residue.Include(r => r.residue_part).ThenInclude(p => p.job_order)
        //                                    .Where(r => r.guid == processGuid).FirstOrDefaultAsync();

        //        if (residue != null)
        //        {
        //            var jobOrderList = residue?.residue_part?.Where(p => p.approve_part == true && (p.delete_dt == null || p.delete_dt == 0))
        //                                                    .Select(p => p.job_order).ToList();
        //            if (jobOrderList != null && !jobOrderList.Any(j => j == null))
        //            {
        //                bool allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
        //                                                    jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));
        //                if (allValid)
        //                {
        //                    return true;
        //                }
        //            }
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}


        //public async Task<int> RollbackResidueApproval(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<ResidueRequest> residue)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        foreach (var item in residue)
        //        {
        //            if (item != null && !string.IsNullOrEmpty(item.guid))
        //            {
        //                var rollbackResidue = new residue() { guid = item.guid };
        //                context.residue.Attach(rollbackResidue);

        //                rollbackResidue.update_by = user;
        //                rollbackResidue.update_dt = currentDateTime;
        //                rollbackResidue.status_cv = CurrentServiceStatus.PENDING;
        //                rollbackResidue.remarks = item.remarks;

        //                if (string.IsNullOrEmpty(item.customer_guid))
        //                    throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

        //                var customerGuid = item.customer_guid;
        //                var residuePart = await context.residue_part.Where(r => r.residue_guid == item.guid &&
        //                                                                    (!string.IsNullOrEmpty(r.tariff_residue_guid)) &&
        //                                                                    (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
        //                foreach (var part in residuePart)
        //                {
        //                    part.update_by = user;
        //                    part.update_dt = currentDateTime;
        //                    part.approve_part = null;
        //                    part.approve_cost = part.cost;
        //                    part.approve_qty = part.quantity;
        //                }
        //            }
        //        }

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

        //public async Task<int> RollbackResidueStatus(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //     [Service] IConfiguration config, ResidueRequest residue)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        if (residue == null)
        //            throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

        //        var rollbackResidue = new residue() { guid = residue.guid };
        //        context.residue.Attach(rollbackResidue);

        //        rollbackResidue.update_by = user;
        //        rollbackResidue.update_dt = currentDateTime;
        //        rollbackResidue.status_cv = CurrentServiceStatus.PENDING;
        //        rollbackResidue.remarks = residue.remarks;

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}


        //public async Task<int> CancelResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<residue> residue)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        foreach (var delResidue in residue)
        //        {
        //            if (delResidue != null && !string.IsNullOrEmpty(delResidue.guid))
        //            {
        //                var resd = new residue() { guid = delResidue.guid };
        //                context.Attach(resd);

        //                resd.update_by = user;
        //                resd.update_dt = currentDateTime;
        //                resd.status_cv = CurrentServiceStatus.CANCELED;
        //                resd.remarks = delResidue.remarks;
        //            }
        //        }

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}
    }
}
