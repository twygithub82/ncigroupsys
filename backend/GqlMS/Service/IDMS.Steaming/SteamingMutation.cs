using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate.Types;
using Microsoft.EntityFrameworkCore;
using IDMS.Steaming.GqlTypes.LocalModel;
using IDMS.Models.Inventory;
using System.ComponentModel.Design;

namespace IDMS.Steaming.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class SteamingMutation
    {
        public async Task<int> AddSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, steaming steaming)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newSteaming = steaming;
                newSteaming.guid = Util.GenerateGUID();
                newSteaming.create_by = user;
                newSteaming.create_dt = currentDateTime;
                newSteaming.status_cv = CurrentServiceStatus.PENDING;
                newSteaming.estimate_by = user;
                newSteaming.estimate_dt = currentDateTime;

                foreach (var item in steaming.steaming_part)
                {
                    item.guid = Util.GenerateGUID();
                    item.create_by = user;
                    item.create_dt = currentDateTime;
                    item.steaming_guid = newSteaming.guid;
                }

                await context.AddAsync(newSteaming);

                //Handing of SOT movement status
                if (string.IsNullOrEmpty(steaming.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));
                var sot = new storing_order_tank() { guid = steaming.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.tank_status_cv = TankMovementStatus.STEAM;
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

        public async Task<int> ApproveSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, steaming steaming)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (steaming == null || string.IsNullOrEmpty(steaming.guid))
                    throw new GraphQLException(new Error($"Steaming object or guid cannot be null", "ERROR"));

                var approveSteam = new steaming() { guid = steaming.guid };
                context.steaming.Attach(approveSteam);
                approveSteam.update_by = user;
                approveSteam.update_dt = currentDateTime;

                approveSteam.total_cost = steaming.total_cost;

                if (CurrentServiceStatus.PENDING.EqualsIgnore(steaming.status_cv))
                {
                    approveSteam.status_cv = CurrentServiceStatus.APPROVED;
                    approveSteam.approve_by = user;
                    approveSteam.approve_dt = currentDateTime;
                }

                if (steaming.steaming_part != null)
                {
                    foreach (var item in steaming.steaming_part)
                    {
                        if (item?.action == null || string.IsNullOrEmpty(item.action))
                            continue;

                        if (item.action.EqualsIgnore(ObjectAction.EDIT))
                        {
                            var part = new steaming_part() { guid = item.guid };
                            context.steaming_part.Attach(part);

                            part.description = item.description;
                            part.approve_part = item.approve_part;
                            part.approve_qty = item.approve_qty;
                            part.approve_labour = item.approve_labour;
                            part.approve_cost = item.approve_cost;
                            part.update_by = user;
                            part.update_dt = currentDateTime;
                        }
                        else if (item.action.EqualsIgnore(ObjectAction.NEW))
                        {
                            var newPart = new steaming_part();
                            newPart.guid = Util.GenerateGUID();
                            newPart.create_by = user;
                            newPart.create_dt = currentDateTime;
                            newPart.steaming_guid = item.steaming_guid ?? steaming.guid;
                            newPart.steaming_exclusive_guid = item.steaming_exclusive_guid;
                            newPart.tariff_steaming_guid = item.tariff_steaming_guid;
                            newPart.job_order_guid = "";
                            newPart.description = item.description;
                            newPart.quantity = item.quantity;
                            newPart.cost = item.cost;
                            newPart.labour = item.labour;
                            newPart.approve_cost = item.approve_cost;
                            newPart.approve_qty = item.approve_qty;
                            newPart.approve_labour = item.approve_labour;
                            newPart.approve_part = true;
                            await context.steaming_part.AddAsync(newPart);
                        }
                    }
                }

                await GqlUtils.JobOrderHandling(context, "steaming", user, currentDateTime, ObjectAction.APPROVE, processGuid: steaming.guid);

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, steaming steaming)
        {
            try
            {
                if (steaming == null || string.IsNullOrEmpty(steaming.guid))
                    throw new GraphQLException(new Error($"Steaming object cannot be null for update", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var updateSteaming = new steaming() { guid = steaming.guid };
                context.steaming.Attach(updateSteaming);

                updateSteaming.update_by = user;
                updateSteaming.update_dt = currentDateTime;
                updateSteaming.job_no = steaming.job_no;
                updateSteaming.invoice_by = steaming.invoice_by;
                updateSteaming.invoice_dt = steaming.invoice_dt;
                updateSteaming.remarks = steaming.remarks;
                updateSteaming.bill_to_guid = steaming.bill_to_guid;


                //Handling For steaming_part
                foreach (var item in steaming.steaming_part)
                {
                    if (ObjectAction.NEW.EqualsIgnore(item.action))
                    {
                        item.guid = Util.GenerateGUID();
                        item.create_by = user;
                        item.create_dt = currentDateTime;
                        item.steaming_guid = steaming.guid;
                        await context.steaming_part.AddAsync(item);
                    }
                    else if (ObjectAction.EDIT.EqualsIgnore(item.action))
                    {
                        if (string.IsNullOrEmpty(item.guid))
                            throw new GraphQLException(new Error($"Steaming part guid cannot be null or empty for update", "ERROR"));

                        var part = new steaming_part() { guid = item.guid };
                        context.steaming_part.Attach(part);

                        part.update_by = user;
                        part.update_dt = currentDateTime;
                        part.quantity = item.quantity;
                        part.cost = item.cost;
                        part.labour = item.labour;
                        part.description = item.description;
                        part.tariff_steaming_guid = item.tariff_steaming_guid;
                    }
                    else if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                    {
                        var part = new steaming_part() { guid = item.guid };
                        context.steaming_part.Attach(part);
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
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> RollbackSteaming(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<SteamingRequest> steaming)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in steaming)
                {
                    if (item != null && !string.IsNullOrEmpty(item.guid))
                    {
                        var rollbackSteaming = new steaming() { guid = item.guid };
                        context.steaming.Attach(rollbackSteaming);

                        rollbackSteaming.update_by = user;
                        rollbackSteaming.update_dt = currentDateTime;
                        rollbackSteaming.status_cv = CurrentServiceStatus.PENDING;
                        rollbackSteaming.remarks = item.remarks;

                        if (string.IsNullOrEmpty(item.customer_guid))
                            throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                        var customerGuid = item.customer_guid;
                        var steamingPart = await context.steaming_part.Where(r => r.steaming_guid == item.guid &&
                                                                            (!string.IsNullOrEmpty(r.tariff_steaming_guid)) &&
                                                                            (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                        if (item.is_approved)
                        {
                            foreach (var part in steamingPart)
                            {
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.approve_part = null;
                                part.approve_cost = part.cost;
                                part.approve_labour = part.labour;
                                part.approve_qty = part.quantity;
                            }
                        }
                        else
                        {
                            var partsTariffSteamingGuids = steamingPart.Select(x => x.tariff_steaming_guid).ToArray();
                            var packageSteaming = await context.package_steaming.Where(r => partsTariffSteamingGuids.Contains(r.tariff_steaming_guid) &&
                                                r.customer_company_guid == customerGuid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

                            foreach (var part in steamingPart)
                            {
                                //var estPart = new repair_est_part() { guid = part.guid }; 
                                //context.repair_est_part.Attach(estPart);
                                part.update_by = user;
                                part.update_dt = currentDateTime;
                                part.cost = packageSteaming.Where(r => r.tariff_steaming_guid == part.tariff_steaming_guid).Select(r => r.cost).First();
                                part.labour = packageSteaming.Where(r => r.tariff_steaming_guid == part.tariff_steaming_guid).Select(r => r.labour).First();
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

        public async Task<int> RecordSteamingTemp(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, steaming_temp steamingTemp, string action, double requiredTemp)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (ObjectAction.NEW.EqualsIgnore(action))
                {
                    if (string.IsNullOrEmpty(steamingTemp.job_order_guid))
                        throw new GraphQLException(new Error($"Job Order guid cannot be null or empty", "ERROR"));

                    //handling of steaming_temp table
                    steamingTemp.guid = Util.GenerateGUID();
                    steamingTemp.create_by = user;
                    steamingTemp.create_dt = currentDateTime;
                    await context.AddAsync(steamingTemp);

                    var steam = await context.steaming.Where(s => s.steaming_part
                                                      .Any(p => p.job_order_guid == steamingTemp.job_order_guid && p.steaming_guid == s.guid))
                                                      .FirstOrDefaultAsync();

                    //handling of steaming table
                    if (steam != null & steam?.begin_dt == null)
                    {
                        steam.begin_dt = currentDateTime;
                        steam.begin_by = user;
                        steam.update_by = user;
                        steam.update_dt = currentDateTime;
                    }
                }
                else if (ObjectAction.EDIT.EqualsIgnore(action))
                {
                    if (string.IsNullOrEmpty(steamingTemp.guid))
                        throw new GraphQLException(new Error($"Steaming_temp guid cannot be null for update", "ERROR"));

                    var updateSteamTemp = new steaming_temp() { guid = steamingTemp.guid };
                    context.Attach(updateSteamTemp);
                    updateSteamTemp.update_by = user;
                    updateSteamTemp.update_dt = currentDateTime;
                    updateSteamTemp.bottom_temp = steamingTemp.bottom_temp;
                    updateSteamTemp.top_temp = steamingTemp.top_temp;
                    updateSteamTemp.meter_temp = steamingTemp.meter_temp;
                    updateSteamTemp.remarks = steamingTemp.remarks;
                    updateSteamTemp.report_dt = steamingTemp.report_dt;
                }
                else if (ObjectAction.CANCEL.EqualsIgnore(action))
                {
                    if (string.IsNullOrEmpty(steamingTemp.guid))
                        throw new GraphQLException(new Error($"Steaming_temp guid cannot be null for cancel", "ERROR"));

                    var updateSteamTemp = new steaming_temp() { guid = steamingTemp.guid };
                    context.Attach(updateSteamTemp);
                    updateSteamTemp.update_by = user;
                    updateSteamTemp.update_dt = currentDateTime;
                    updateSteamTemp.delete_dt = currentDateTime;
                    updateSteamTemp.remarks = steamingTemp.remarks;
                }

                //handling of job_order table
                var jobOrder = await context.job_order.FindAsync(steamingTemp.job_order_guid);
                if (!CurrentServiceStatus.JOB_IN_PROGRESS.EqualsIgnore(jobOrder.status_cv))
                {
                    jobOrder.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                    jobOrder.start_dt = currentDateTime;
                    jobOrder.update_by = user;
                    jobOrder.update_dt = currentDateTime;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateSteamingStatus(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, SteamingStatusRequest steaming)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();
                bool tankMovementCheck = false;

                if (steaming == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                var updateSteaming = new steaming() { guid = steaming.guid };
                context.steaming.Attach(updateSteaming);
                updateSteaming.update_by = user;
                updateSteaming.update_dt = currentDateTime;
                updateSteaming.remarks = steaming.remarks;


                switch (steaming.action.ToUpper())
                {
                    case ObjectAction.IN_PROGRESS:
                        if (await GqlUtils.StatusChangeConditionCheck(context, "steaming", steaming.guid, CurrentServiceStatus.JOB_IN_PROGRESS))
                            updateSteaming.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                        break;
                    case ObjectAction.CANCEL:
                        updateSteaming.status_cv = CurrentServiceStatus.CANCELED;
                        break;
                    case ObjectAction.PARTIAL:
                        updateSteaming.status_cv = CurrentServiceStatus.PARTIAL;
                        break;
                    case ObjectAction.ASSIGN:
                        updateSteaming.status_cv = CurrentServiceStatus.ASSIGNED;
                        break;
                    case ObjectAction.COMPLETE:
                        if (await GqlUtils.StatusChangeConditionCheck(context, "steaming", steaming.guid, CurrentServiceStatus.COMPLETED))
                        {
                            updateSteaming.status_cv = CurrentServiceStatus.COMPLETED;
                            updateSteaming.complete_by = user;
                            updateSteaming.complete_dt = currentDateTime;
                        }

                        if (string.IsNullOrEmpty(steaming.sot_guid))
                            throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                        tankMovementCheck = true;
                        break;
                    case ObjectAction.NA:
                        updateSteaming.status_cv = CurrentServiceStatus.NO_ACTION;
                        updateSteaming.na_dt = currentDateTime;

                        foreach (var item in steaming.steamingPartRequests)
                        {
                            var steamPart = new steaming_part() { guid = item.guid };
                            context.steaming_part.Attach(steamPart);
                            steamPart.approve_part = false;
                            steamPart.update_dt = currentDateTime;
                            steamPart.update_by = user;
                        }

                        if (string.IsNullOrEmpty(steaming.sot_guid))
                            throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                        tankMovementCheck = true;
                        break;
                }

                var res = await context.SaveChangesAsync();

                if (tankMovementCheck)
                    await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, steaming.sot_guid);

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> AbortSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, SteamJobOrderRequest steamingJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (steamingJobOrder == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                var abortSteaming = new steaming() { guid = steamingJobOrder.guid };
                context.steaming.Attach(abortSteaming);

                abortSteaming.update_by = user;
                abortSteaming.update_dt = currentDateTime;
                abortSteaming.status_cv = CurrentServiceStatus.NO_ACTION;
                abortSteaming.remarks = steamingJobOrder.remarks;

                //job order handling
                await GqlUtils.JobOrderHandling(context, "steaming", user, currentDateTime, ObjectAction.CANCEL, jobOrders: steamingJobOrder.job_order);
                //Save the changes ... make sure it take effect
                _ = await context.SaveChangesAsync();

                //Status condition chehck handling
                if (await GqlUtils.StatusChangeConditionCheck(context, "steaming", steamingJobOrder.guid, CurrentServiceStatus.COMPLETED))
                {
                    abortSteaming.status_cv = CurrentServiceStatus.COMPLETED;
                    abortSteaming.complete_dt = currentDateTime;
                }
                else
                    abortSteaming.status_cv = CurrentServiceStatus.NO_ACTION;

                var res = await context.SaveChangesAsync();
                await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, steamingJobOrder.sot_guid);

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> CompleteQCSteaming(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<SteamJobOrderRequest> steamingJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (steamingJobOrder == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                foreach (var item in steamingJobOrder)
                {
                    //Repair handling
                    var completedSteaming = new steaming() { guid = item.guid };
                    context.steaming.Attach(completedSteaming);
                    completedSteaming.update_by = user;
                    completedSteaming.update_dt = currentDateTime;
                    completedSteaming.complete_dt = currentDateTime;
                    completedSteaming.status_cv = CurrentServiceStatus.QC;
                    completedSteaming.remarks = item.remarks;

                    //job_orders handling
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
                    string sql = $"UPDATE job_order SET qc_dt = {currentDateTime}, qc_by = '{user}', update_dt = {currentDateTime}, " +
                                 $"update_by = '{user}' WHERE guid IN ({guids})";
                    context.Database.ExecuteSqlRaw(sql);
                }

                //Tank handling
                var sotGuid = steamingJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                //var processGuid = string.Join(",", steamingJobOrder.Select(j => j.guid).ToList().Select(g => $"'{g}'")); //repJobOrder.Select(r => r.guid).FirstOrDefault();
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

        public async Task<int> RollbackJobInProgressSteaming(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<SteamJobOrderRequest> steamingJobOrder)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (steamingJobOrder == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                foreach (var item in steamingJobOrder)
                {
                    steaming? rollbackSteaming = await context.steaming.FindAsync(item.guid);
                    if (rollbackSteaming == null)
                        throw new GraphQLException(new Error($"Steaming object not found", "ERROR"));

                    //Steaming handling
                    //var rollbabkSteaming = new steaming() { guid = item.guid };
                    //context.steaming.Attach(rollbabkSteaming);
                    rollbackSteaming.update_by = user;
                    rollbackSteaming.update_dt = currentDateTime;

                    if (rollbackSteaming.create_by.EqualsIgnore("system"))
                        rollbackSteaming.status_cv = CurrentServiceStatus.APPROVED;
                    else
                    {
                        if (rollbackSteaming.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS))
                            rollbackSteaming.status_cv = CurrentServiceStatus.ASSIGNED;
                    }


                    if (!string.IsNullOrEmpty(item.remarks))
                        rollbackSteaming.remarks = item.remarks;

                    //job_orders handling
                    var jobRemark = item.job_order.Select(j => j.remarks).FirstOrDefault();
                    var jobGuidString = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));

                    string sql = "";
                    if (!string.IsNullOrEmpty(jobRemark))
                    {
                        if (rollbackSteaming.create_by.EqualsIgnore("system"))
                        {
                            sql = $"UPDATE job_order SET team_guid = NULL, status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                                    $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({jobGuidString})";
                        }
                        else
                        {
                            sql = $"UPDATE job_order SET status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                                    $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({jobGuidString})";
                        }
                    }
                    else
                    {
                        if (rollbackSteaming.create_by.EqualsIgnore("system"))
                        {
                            sql = $"UPDATE job_order SET team_guid = NULL, status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                                    $"update_by = '{user}' WHERE guid IN ({jobGuidString})";
                        }
                        else
                        {
                            sql = $"UPDATE job_order SET status_cv = '{JobStatus.PENDING}', update_dt = {currentDateTime}, " +
                                    $"update_by = '{user}' WHERE guid IN ({jobGuidString})";
                        }
                    }
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

        public async Task<int> RollbackCompletedSteaming(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<SteamJobOrderRequest> steamingJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (steamingJobOrder == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                foreach (var item in steamingJobOrder)
                {
                    //Steaming handling
                    var rollbabkSteaming = new steaming() { guid = item.guid };
                    context.steaming.Attach(rollbabkSteaming);
                    rollbabkSteaming.update_by = user;
                    rollbabkSteaming.update_dt = currentDateTime;
                    rollbabkSteaming.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                    if (!string.IsNullOrEmpty(item.remarks))
                        rollbabkSteaming.remarks = item.remarks;

                    //job_orders handling
                    var jobRemark = item.job_order.Select(j => j.remarks).FirstOrDefault();
                    var guids = string.Join(",", item.job_order.Select(j => j.guid).ToList().Select(g => $"'{g}'"));

                    string sql = "";
                    if (!string.IsNullOrEmpty(jobRemark))
                    {
                        sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                                $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({guids})";
                    }
                    else
                    {
                        sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                                $"update_by = '{user}' WHERE guid IN ({guids})";
                    }
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

                var sotGuid = steamingJobOrder.Select(r => r.sot_guid).FirstOrDefault();
                var tankStatus = steamingJobOrder.Select(r => r.sot_status).FirstOrDefault();

                var sot = new storing_order_tank() { guid = sotGuid };
                context.storing_order_tank.Attach(sot);
                sot.update_by = user;
                sot.update_dt = currentDateTime;
                //sot.tank_status_cv = TankMovementStatus.REPAIR;
                if (tankStatus.EqualsIgnore(TankMovementStatus.STORAGE))
                    sot.tank_status_cv = TankMovementStatus.STEAM;
                else
                {
                    var jobOrders = await context.job_order.Where(j => j.sot_guid == sotGuid & j.job_type_cv == JobType.STEAM).ToListAsync();
                    if (!jobOrders.Any(j => j.status_cv.Contains(JobStatus.IN_PROGRESS)))
                        sot.tank_status_cv = TankMovementStatus.STEAM;
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
            string tableName = processType;
            var processGuid = string.Join(",", processGuidList.Select(g => $"'{g}'"));

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
            var sot = await context.storing_order_tank
                                    .Include(s => s.residue)
                                    .Where(s => s.guid == sotGuid).FirstOrDefaultAsync();
            if (sot != null)
            {
                if (sot.residue.Any(r => CurrentServiceStatus.APPROVED.EqualsIgnore(r?.status_cv) || CurrentServiceStatus.PENDING.EqualsIgnore(r?.status_cv)))
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                else if (sot?.purpose_cleaning ?? false)
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                else if (!string.IsNullOrEmpty(sot?.purpose_repair_cv))
                    sot.tank_status_cv = TankMovementStatus.REPAIR;
                else
                    sot.tank_status_cv = TankMovementStatus.STORAGE;
                sot.update_by = user;
                sot.update_dt = currentDateTime;
            }
        }
    }
}
