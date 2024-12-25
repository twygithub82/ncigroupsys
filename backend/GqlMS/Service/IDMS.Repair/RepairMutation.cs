using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Master;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using IDMS.Models.Service;
using Microsoft.EntityFrameworkCore;
using IDMS.Repair.GqlTypes.LocalModel;
using HotChocolate.Types;
using IDMS.Service.GqlTypes;
using IDMS.Models.Inventory;
using HotChocolate.Data.Projections;

namespace IDMS.Repair.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class RepairMutation
    {
        public async Task<int> AddRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newRepair = new repair();
                newRepair.guid = Util.GenerateGUID();
                newRepair.create_by = user;
                newRepair.create_dt = currentDateTime;

                newRepair.sot_guid = repair.sot_guid;
                newRepair.aspnetusers_guid = repair.aspnetusers_guid;
                newRepair.estimate_no = repair.estimate_no;
                newRepair.labour_cost_discount = repair.labour_cost_discount;
                newRepair.material_cost_discount = repair.material_cost_discount;
                newRepair.total_cost = repair.total_cost;
                newRepair.labour_cost = repair.labour_cost;
                newRepair.owner_enable = repair.owner_enable;
                newRepair.remarks = repair.remarks;
                newRepair.total_hour = repair.total_hour;
                newRepair.job_no = repair.job_no;
                newRepair.status_cv = CurrentServiceStatus.PENDING;
                await context.repair.AddAsync(newRepair);

                //Handling For Template_est_part
                IList<repair_part> partList = new List<repair_part>();
                foreach (var newPart in repair.repair_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.repair_guid = newRepair.guid;
                    partList.Add(newPart);

                    await UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }
                await context.repair_part.AddRangeAsync(partList);


                //Handlind For Customer Default Template
                if (customerCompany != null && customerCompany.guid != "")
                {
                    var cust = new customer_company() { guid = customerCompany.guid };
                    context.Attach(cust);

                    cust.def_template_guid = customerCompany.def_template_guid;
                    cust.update_by = user;
                    cust.update_dt = currentDateTime;
                }


                //Handing of SOT movement status
                if (string.IsNullOrEmpty(repair.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));
                var sot = new storing_order_tank() { guid = repair.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.tank_status_cv = TankMovementStatus.REPAIR;
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

        public async Task<int> ApproveRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //Handlind update approval for estimate
                if (repair != null && !string.IsNullOrEmpty(repair.guid) && !string.IsNullOrEmpty(repair.bill_to_guid))
                {
                    var appvRepair = new repair() { guid = repair.guid };
                    context.repair.Attach(appvRepair);

                    appvRepair.update_by = user;
                    appvRepair.update_dt = currentDateTime;

                    appvRepair.total_cost = repair.total_cost;
                    appvRepair.bill_to_guid = repair.bill_to_guid;
                    appvRepair.remarks = repair.remarks;

                    if (CurrentServiceStatus.PENDING.EqualsIgnore(repair.status_cv))
                    {
                        appvRepair.status_cv = CurrentServiceStatus.APPROVED;
                        appvRepair.approve_by = user;
                        appvRepair.approve_dt = currentDateTime;
                    }

                    if (repair.repair_part != null)
                    {
                        foreach (var item in repair.repair_part)
                        {
                            var part = new repair_part() { guid = item.guid };
                            context.repair_part.Attach(part);

                            part.approve_qty = item.approve_qty;
                            part.approve_hour = item.approve_hour;
                            part.approve_part = item.approve_part;
                            part.approve_cost = item.approve_cost;
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                        }
                    }

                    //JobOrder Handling
                    //await JobOrderHandling(context, user, currentDateTime, ObjectAction.APPROVE, processGuid: repair.guid);
                    await GqlUtils.JobOrderHandling(context, "repair", user, currentDateTime, ObjectAction.APPROVE, processGuid: repair.guid);
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, repair repair, customer_company? customerCompany)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(repair.guid))
                    throw new GraphQLException(new Error($"Repair guid used for update cannot be null or empty", "ERROR"));

                var updateRepair = await context.repair.Where(t => t.guid == repair.guid && (t.delete_dt == null || t.delete_dt == 0))
                                                          .Include(t => t.repair_part)
                                                            .ThenInclude(tp => tp.rp_damage_repair)
                                                          .FirstOrDefaultAsync();

                if (updateRepair == null)
                    throw new GraphQLException(new Error($"Repair not found", "ERROR"));

                updateRepair.update_by = user;
                updateRepair.update_dt = currentDateTime;
                updateRepair.sot_guid = repair.sot_guid;
                updateRepair.aspnetusers_guid = repair.aspnetusers_guid;
                updateRepair.labour_cost_discount = repair.labour_cost_discount;
                updateRepair.material_cost_discount = repair.material_cost_discount;
                updateRepair.total_cost = repair.total_cost;
                updateRepair.labour_cost = repair.labour_cost;
                updateRepair.estimate_no = repair.estimate_no;
                updateRepair.remarks = repair.remarks;
                updateRepair.total_hour = repair.total_hour;
                updateRepair.job_no = repair.job_no;

                if (repair.repair_part != null)
                {
                    foreach (var part in repair.repair_part)
                    {
                        if (ObjectAction.NEW.EqualsIgnore(part.action))
                        {
                            var newRepairPart = part;
                            newRepairPart.guid = Util.GenerateGUID();
                            newRepairPart.create_by = user;
                            newRepairPart.create_dt = currentDateTime;
                            newRepairPart.repair_guid = updateRepair.guid;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part);
                            await context.repair_part.AddAsync(newRepairPart);
                            continue;
                        }


                        var existingPart = updateRepair.repair_part?.Where(p => p.guid == part.guid && (p.delete_dt == null || p.delete_dt == 0)).FirstOrDefault();
                        if (existingPart == null)
                            throw new GraphQLException(new Error($"Repair_part guid used for update cannot be null or empty", "ERROR"));

                        if (ObjectAction.EDIT.EqualsIgnore(part.action))
                        {
                            //var existingPart = new repair_est_part() { guid = part.guid };
                            //context.Attach(existingPart);
                            existingPart.update_by = user;
                            existingPart.update_dt = currentDateTime;
                            existingPart.description = part.description;
                            existingPart.comment = part.comment;
                            existingPart.owner = part.owner;
                            existingPart.quantity = part.quantity;
                            existingPart.location_cv = part.location_cv;
                            existingPart.hour = part.hour;
                            existingPart.material_cost = part.material_cost;
                            existingPart.remarks = part.remarks;
                            //await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.rp_damage_repair);
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(part.action))
                        {
                            //var existingPart = new repair_est_part() { guid = part.guid };
                            //context.Attach(existingPart);

                            existingPart.delete_dt = currentDateTime;
                            existingPart.update_dt = currentDateTime;
                            existingPart.update_by = user;
                            //await UpdateRepairDamageCode(context, user, currentDateTime, part, part.rep_damage_repair);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.rp_damage_repair);
                            continue;
                        }
                    }
                }

                //Handlind For Customer Default Template
                if (customerCompany != null && customerCompany.guid != "")
                {
                    var cust = new customer_company() { guid = customerCompany.guid };
                    context.Attach(cust);

                    cust.def_template_guid = customerCompany.def_template_guid;
                    cust.update_by = user;
                    cust.update_dt = currentDateTime;
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

        public async Task<int> RollbackRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepairRequest> repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in repair)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var rollbackRepair = new repair() { guid = item.guid };
                        context.repair.Attach(rollbackRepair);

                        rollbackRepair.update_by = user;
                        rollbackRepair.update_dt = currentDateTime;
                        rollbackRepair.status_cv = CurrentServiceStatus.PENDING;
                        rollbackRepair.remarks = item.remarks;

                        if (string.IsNullOrEmpty(item.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = item.customer_guid;
                        var repairPart = await context.repair_part.Where(r => r.repair_guid == item.guid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                        if (item.is_approved)//if the repair already approved, rollback the approval
                        {
                            foreach (var part in repairPart)
                            {
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.approve_part = null;
                                part.approve_cost = part.material_cost;
                                part.approve_hour = part.hour;
                                part.approve_qty = part.quantity;
                            }
                        }
                        else//if the repair still oending, rollback the repair
                        {
                            var partsTarifRepairGuids = repairPart.Select(x => x.tariff_repair_guid).ToArray();
                            var packageRepair = await context.package_repair.Where(r => partsTarifRepairGuids.Contains(r.tariff_repair_guid) &&
                                                r.customer_company_guid == customerGuid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
                            foreach (var part in repairPart)
                            {
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.material_cost = packageRepair.Where(r => r.tariff_repair_guid == part.tariff_repair_guid).Select(r => r.material_cost).First();
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

        public async Task<int> AbortRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, RepJobOrderRequest repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                //repair handling
                var abortRepair = new repair() { guid = repJobOrder.guid };
                context.repair.Attach(abortRepair);
                abortRepair.update_by = user;
                abortRepair.update_dt = currentDateTime;
                abortRepair.na_dt = currentDateTime;
                abortRepair.remarks = repJobOrder.remarks;

                //job order handling
                await GqlUtils.JobOrderHandling(context, "repair", user, currentDateTime, ObjectAction.CANCEL, jobOrders: repJobOrder.job_order);

                if (await GqlUtils.StatusChangeConditionCheck(context, "repair", repJobOrder.guid, CurrentServiceStatus.COMPLETED))
                {
                    abortRepair.status_cv = CurrentServiceStatus.COMPLETED;
                    abortRepair.complete_dt = currentDateTime;
                }   
                else
                    abortRepair.status_cv = CurrentServiceStatus.NO_ACTION;

                ////tank movement status handling
                //var sot = new storing_order_tank() { guid = repJobOrder.sot_guid };
                //context.storing_order_tank.Attach(sot);
                //sot.tank_status_cv = await TankMovementCheck(context, "repair", repJobOrder.sot_guid, repJobOrder.guid) ? TankMovementStatus.REPAIR : TankMovementStatus.STORAGE;
                //sot.update_by = user;
                //sot.update_dt = currentDateTime;

                var res = await context.SaveChangesAsync();
                await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, repJobOrder.sot_guid);

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateRepairStatus(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, RepairStatusRequest repair)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();
                bool tankMovementCheck = false;

                if (repair == null)
                    throw new GraphQLException(new Error($"Residue object cannot be null or empty", "ERROR"));

                var updateRepair = new repair() { guid = repair.guid };
                context.repair.Attach(updateRepair);
                updateRepair.update_dt = currentDateTime;
                updateRepair.update_by = user;
                updateRepair.remarks = repair.remarks;

                switch (repair.action.ToUpper())
                {
                    case ObjectAction.IN_PROGRESS:
                        if (await GqlUtils.StatusChangeConditionCheck(context, "repair", repair.guid, CurrentServiceStatus.JOB_IN_PROGRESS))
                            updateRepair.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                        break;
                    //case ObjectAction.JOB_COMPLETE:
                    //    if (await GqlUtils.StatusChangeConditionCheck(context, "repair", repair.guid, CurrentServiceStatus.JOB_COMPLETED))
                    //        updateRepair.status_cv = CurrentServiceStatus.JOB_COMPLETED;
                    //    break;
                    case ObjectAction.PARTIAL:
                        updateRepair.status_cv = CurrentServiceStatus.PARTIAL;
                        break;
                    case ObjectAction.ASSIGN:
                        updateRepair.status_cv = CurrentServiceStatus.ASSIGNED;
                        break;
                    case ObjectAction.CANCEL:
                        updateRepair.status_cv = CurrentServiceStatus.CANCELED;
                        break;
                    case ObjectAction.COMPLETE:
                        if (await GqlUtils.StatusChangeConditionCheck(context, "repair", repair.guid, CurrentServiceStatus.COMPLETED))
                        {
                            updateRepair.status_cv = CurrentServiceStatus.COMPLETED;
                            updateRepair.complete_dt = currentDateTime;
                        }
                        break;
                    case ObjectAction.NA:
                        updateRepair.status_cv = CurrentServiceStatus.NO_ACTION;
                        updateRepair.na_dt = currentDateTime;

                        foreach (var item in repair.repairPartRequests)
                        {
                            var repPart = new repair_part() { guid = item.guid };
                            context.repair_part.Attach(repPart);
                            repPart.approve_part = false;
                            repPart.update_dt = currentDateTime;
                            repPart.update_by = user;
                        }

                        //Tank handling
                        if (string.IsNullOrEmpty(repair.sot_guid))
                            throw new GraphQLException(new Error($"Tank guid cannot be null or empty", "ERROR"));

                        tankMovementCheck = true;
                        break;
                }

                var res = await context.SaveChangesAsync();

                if (tankMovementCheck)
                    await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, repair.sot_guid);

                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> CompleteQCRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepJobOrderRequest> repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                foreach (var item in repJobOrder)
                {
                    //Repair handling
                    var completedRepair = new repair() { guid = item.guid };
                    context.repair.Attach(completedRepair);
                    completedRepair.update_by = user;
                    completedRepair.update_dt = currentDateTime;
                    completedRepair.complete_dt = currentDateTime;
                    completedRepair.status_cv = CurrentServiceStatus.QC;
                    completedRepair.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    string sql = $"UPDATE job_order SET qc_dt = {currentDateTime}, qc_by = '{user}', update_dt = {currentDateTime}, " +
                            $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);
                }

                //Tank handling
                var sotGuid = repJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                var processGuid = string.Join(",", repJobOrder.Select(j => j.guid).ToList().Select(g => $"'{g}'")); //repJobOrder.Select(r => r.guid).FirstOrDefault();
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

        public async Task<int> RollbackQCRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepJobOrderRequest> repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                foreach (var item in repJobOrder)
                {
                    //Repair handling
                    var rollbackQCRepair = new repair() { guid = item.guid };
                    context.repair.Attach(rollbackQCRepair);
                    rollbackQCRepair.update_by = user;
                    rollbackQCRepair.update_dt = currentDateTime;
                    rollbackQCRepair.status_cv = CurrentServiceStatus.COMPLETED; //From QC --> Completed
                    rollbackQCRepair.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    //var jobRemark = item.job_order.Select(j => j.remarks).First();
                    string sql = $"UPDATE job_order SET qc_dt = NULL, update_dt = {currentDateTime}, " +
                                 $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);
                }

                //Tank handling
                var sotGuid = repJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                var tankStatus = repJobOrder.Select(r => r.sot_status).FirstOrDefault();

                if (tankStatus.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    var sot = new storing_order_tank() { guid = sotGuid };
                    context.storing_order_tank.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.tank_status_cv = TankMovementStatus.REPAIR;
                }

                var res = await context.SaveChangesAsync();
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> OverwriteQCRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepJobOrderRequest> repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                foreach (var item in repJobOrder)
                {
                    //Repair handling
                    var rollbackQCRepair = new repair() { guid = item.guid };
                    context.repair.Attach(rollbackQCRepair);
                    rollbackQCRepair.update_by = user;
                    rollbackQCRepair.update_dt = currentDateTime;
                    if (!string.IsNullOrEmpty(item.remarks))
                        rollbackQCRepair.remarks = item.remarks;

                    //Job order handling
                    foreach (var job in item.job_order)
                    {
                        var updatejob = new job_order() { guid = job.guid };
                        context.Attach(updatejob);
                        updatejob.update_dt = currentDateTime;
                        updatejob.update_by = user;
                        updatejob.qc_dt = job.qc_dt;
                        if (!string.IsNullOrEmpty(job.remarks))
                            updatejob.remarks = job.remarks;
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

        public async Task<int> RollbackCompletedRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepJobOrderRequest> repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                foreach (var item in repJobOrder)
                {
                    //Repair handling
                    var rollbackQCRepair = new repair() { guid = item.guid };
                    context.repair.Attach(rollbackQCRepair);
                    rollbackQCRepair.update_by = user;
                    rollbackQCRepair.update_dt = currentDateTime;
                    rollbackQCRepair.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS; //From Completed --> JIP
                    if (!string.IsNullOrEmpty(item.remarks))
                        rollbackQCRepair.remarks = item.remarks;

                    //job_orders handling
                    var jobIdList = item.job_order.Select(j => j.guid).ToList();
                    var jobGuidString = string.Join(",", jobIdList.Select(g => $"'{g}'"));
                    var jobRemark = item.job_order.Select(j => j.remarks).FirstOrDefault();

                    string sql = "";
                    if (!string.IsNullOrEmpty(jobRemark))
                    {
                        sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                                     $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({jobGuidString})";
                    }
                    else
                    {
                        sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                                     $"update_by = '{user}' WHERE guid IN ({jobGuidString})";
                    }

                    context.Database.ExecuteSqlRaw(sql);


                    var timeTables = await context.time_table.Where(t => jobIdList.Contains(t.job_order_guid)).ToListAsync();
                    foreach (var tt in timeTables)
                    {
                        tt.stop_time = null;
                        tt.update_by = user;
                        tt.update_dt = currentDateTime;
                    }
                }

                //Tank handling
                var sotGuid = repJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                var tankStatus = repJobOrder.Select(r => r.sot_status).FirstOrDefault();
                //var sot = await context.storing_order_tank.FindAsync(sotGuid);
                //context.storing_order_tank.Attach(sot);
                //sot.tank_status_cv = await TankMovementCheck(context, "repair", sotGuid, processGuid) ? TankMovementStatus.REPAIR : TankMovementStatus.STORAGE;   //TankMovementStatus.STORAGE;
                var sot = new storing_order_tank() { guid = sotGuid };
                context.storing_order_tank.Attach(sot);
                sot.update_by = user;
                sot.update_dt = currentDateTime;
                //sot.tank_status_cv = TankMovementStatus.REPAIR;
                if (tankStatus.EqualsIgnore(TankMovementStatus.STORAGE))
                    sot.tank_status_cv = TankMovementStatus.REPAIR;
                else
                {
                    var jobOrders = await context.job_order.Where(j => j.sot_guid == sotGuid & j.job_type_cv == JobType.REPAIR).ToListAsync();
                    if (!jobOrders.Any(j => j.status_cv.Contains(JobStatus.IN_PROGRESS)))
                        sot.tank_status_cv = TankMovementStatus.REPAIR;
                }

                var res = await context.SaveChangesAsync();
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> RollbackJobInProgressRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<RepJobOrderRequest> repJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (repJobOrder == null)
                    throw new GraphQLException(new Error($"Repair object cannot be null or empty", "ERROR"));

                foreach (var item in repJobOrder)
                {
                    //Repair handling
                    var rollbackRepair = await context.repair.FindAsync(item.guid);
                    if (rollbackRepair == null)
                        throw new GraphQLException(new Error($"Repair estimate not found", "ERROR"));

                    rollbackRepair.update_by = user;
                    rollbackRepair.update_dt = currentDateTime;
                    if (!string.IsNullOrEmpty(item.remarks))
                        rollbackRepair.remarks = item.remarks;
                    if (rollbackRepair.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS))
                        rollbackRepair.status_cv = CurrentServiceStatus.ASSIGNED;

                    //job_orders handling
                    var jobIdList = item.job_order.Select(j => j.guid).ToList();
                    var jobGuidString = string.Join(",", jobIdList.Select(g => $"'{g}'"));
                    var jobRemark = item.job_order.Select(j => j.remarks).FirstOrDefault();

                    string sql = "";
                    if (!string.IsNullOrEmpty(jobRemark))
                    {
                        sql = $"UPDATE job_order SET status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                              $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({jobGuidString})";
                    }
                    else
                    {
                        sql = $"UPDATE job_order SET status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                              $"update_by = '{user}' WHERE guid IN ({jobGuidString})";
                    }

                    context.Database.ExecuteSqlRaw(sql);

                    //Timetable handling
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

        private async Task UpdateRepairDamageCode(ApplicationServiceDBContext context, string user, long currentDateTime,
                                          repair_part repairPart, IEnumerable<rp_damage_repair>? rpDamageRepair = null)
        {
            try
            {
                if (repairPart.rp_damage_repair != null)
                {
                    foreach (var item in repairPart.rp_damage_repair)
                    {

                        //if (string.IsNullOrEmpty(item.action) && !string.IsNullOrEmpty(item.guid))
                        //   throw new GraphQLException(new Error($"Tep_damage_repair action cannot be null for update", "ERROR"));

                        if (string.IsNullOrEmpty(item.action))
                            continue;

                        if (string.IsNullOrEmpty(item.guid) && (ObjectAction.NEW.EqualsIgnore(item.action) || string.IsNullOrEmpty(item.action)))
                        {
                            var partDamage = item;//new tep_damage_repair();
                            partDamage.guid = Util.GenerateGUID();
                            partDamage.create_by = user;
                            partDamage.create_dt = currentDateTime;

                            partDamage.rp_guid = repairPart.guid;
                            partDamage.code_type = item.code_type;
                            partDamage.code_cv = item.code_cv;
                            await context.rp_damage_repair.AddAsync(partDamage);
                            continue;
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for update", "ERROR"));

                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            if (partDamage != null)
                            {
                                partDamage.update_dt = currentDateTime;
                                partDamage.update_by = user;
                                partDamage.code_cv = item.code_cv;
                                partDamage.code_type = item.code_type;
                                //await context.AddAsync(tepDamage)
                            }
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for cancel", "ERROR"));

                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (partDamage != null)
                            {
                                partDamage.delete_dt = currentDateTime;
                                partDamage.update_by = user;
                                partDamage.update_dt = currentDateTime;
                            }
                            continue;
                        }

                        if (ObjectAction.ROLLBACK.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Rep_damage_repair guid cannot null or empty for rollback", "ERROR"));

                            //var repDamage = new rep_damage_repair() { guid = item.guid };
                            //context.Attach(repDamage);
                            var partDamage = rpDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (partDamage != null)
                            {
                                partDamage.delete_dt = null;
                                partDamage.update_by = user;
                                partDamage.update_dt = currentDateTime;
                            }
                            continue;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }


        //public async Task<int> CancelRepair(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<repair> repair)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        foreach (var item in repair)
        //        {
        //            if (item != null && !string.IsNullOrEmpty(item.guid))
        //            {
        //                var cancelRepair = new repair() { guid = item.guid };
        //                context.Attach(cancelRepair);

        //                cancelRepair.update_by = user;
        //                cancelRepair.update_dt = currentDateTime;
        //                cancelRepair.status_cv = CurrentServiceStatus.CANCELED;
        //                cancelRepair.remarks = item.remarks;
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

        //private async Task<bool> StatusChangeConditionCheck(ApplicationServiceDBContext context, string processGuid, string newStatus)
        //{
        //    try
        //    {
        //        var repair = await context.repair.Include(r => r.repair_part).ThenInclude(p => p.job_order)
        //                                    .Where(r => r.guid == processGuid).FirstOrDefaultAsync();

        //        if (repair != null)
        //        {
        //            var jobOrderList = repair?.repair_part?.Where(p => p.approve_part == true && (p.delete_dt == null || p.delete_dt == 0))
        //                                                    .Select(p => p.job_order).ToList();
        //            if (jobOrderList != null && !jobOrderList.Any(j => j == null))
        //            {
        //                bool allValid = false;
        //                if (newStatus.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS))
        //                {
        //                    allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
        //                                                    jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));
        //                }
        //                else if (newStatus.EqualsIgnore(CurrentServiceStatus.JOB_COMPLETED))
        //                {
        //                    allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
        //                        jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED));
        //                }

        //                return allValid;
        //            }
        //        }
        //        return false;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

        private async Task<bool> TankMovementCheck(ApplicationServiceDBContext context, string processType, string sotGuid, string processGuid)
        {
            string tableName = processType;

            //var sqlQuery = $@"SELECT guid FROM {tableName} 
            //                WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}',
            //                '{CurrentServiceStatus.PENDING}', '{CurrentServiceStatus.PARTIAL}', '{CurrentServiceStatus.ASSIGNED}')
            //                AND sot_guid = '{sotGuid}' AND guid != '{processGuid}' AND delete_dt IS NULL";


            var sqlQuery = $@"SELECT guid FROM {tableName} 
                            WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}',
                            '{CurrentServiceStatus.PENDING}', '{CurrentServiceStatus.PARTIAL}', '{CurrentServiceStatus.ASSIGNED}')
                            AND sot_guid = '{sotGuid}' AND guid NOT IN ({processGuid}) AND delete_dt IS NULL";
            var result = await context.Database.SqlQueryRaw<string>(sqlQuery).ToListAsync();

            if (result.Count > 0)
                return true;
            else
                return false;
            //}
        }

        //private async Task JobOrderHandling(ApplicationServiceDBContext context, string user, long currentDateTime, string action, string? processGuid = "", List<job_order>? jobOrders = null)
        //{
        //    try
        //    {
        //        if (ObjectAction.APPROVE.EqualsIgnore(action))
        //        {
        //            var repair = await context.repair.Include(r => r.repair_part).ThenInclude(p => p.job_order)
        //                    .Where(r => r.guid == processGuid).FirstOrDefaultAsync();
        //            if (repair != null)
        //            {
        //                var jobOrderList = repair?.repair_part?.Select(p => p.job_order).ToList();
        //                foreach (var item in jobOrderList)
        //                {
        //                    if (item != null && JobStatus.CANCELED.EqualsIgnore(item.status_cv))
        //                    {
        //                        item.status_cv = JobStatus.PENDING;
        //                        item.update_by = user;
        //                        item.update_dt = currentDateTime;
        //                    }
        //                }
        //            }
        //        }

        //        if (ObjectAction.CANCEL.EqualsIgnore(action))
        //        {
        //            foreach (var item in jobOrders)
        //            {
        //                var job_order = new job_order() { guid = item.guid };
        //                context.job_order.Attach(job_order);
        //                if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
        //                {
        //                    job_order.status_cv = JobStatus.CANCELED;
        //                    job_order.update_by = user;
        //                    job_order.update_dt = currentDateTime;
        //                }
        //            }
        //        }
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}
    }
}
