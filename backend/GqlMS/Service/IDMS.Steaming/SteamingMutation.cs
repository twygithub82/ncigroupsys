using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate.Types;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Steaming.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace IDMS.Steaming.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class SteamingMutation
    {
        public async Task<int> AddSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, steaming steaming)
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
                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }

        public async Task<int> ApproveSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, steaming steaming)
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
                    approveSteam.approve_by = steaming?.storing_order_tank?.storing_order?.customer_company_guid;
                    approveSteam.approve_dt = currentDateTime;
                }

                if (steaming.steaming_part != null)
                {
                    foreach (var item in steaming.steaming_part)
                    {
                        var part = new steaming_part() { guid = item.guid };
                        context.steaming_part.Attach(part);

                        part.approve_qty = item.approve_qty;
                        part.approve_labour = item.approve_labour;
                        part.approve_part = item.approve_part;
                        part.approve_cost = item.approve_cost;
                        part.update_by = user;
                        part.update_dt = currentDateTime;
                    }
                }
                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, steaming steaming)
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
                updateSteaming.job_no = updateSteaming.job_no;
                updateSteaming.invoice_by = steaming.invoice_by;
                updateSteaming.invoice_dt = steaming.invoice_dt;
                updateSteaming.remarks = steaming.remarks;


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

        //public async Task<int> RollbackSteamingApproval(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<SteamingRequest> steaming)
        //{
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        foreach (var item in steaming)
        //        {
        //            if (item != null && !string.IsNullOrEmpty(item.guid))
        //            {
        //                var rollbackSteaming = new steaming() { guid = item.guid };
        //                context.steaming.Attach(rollbackSteaming);

        //                rollbackSteaming.update_by = user;
        //                rollbackSteaming.update_dt = currentDateTime;
        //                rollbackSteaming.status_cv = CurrentServiceStatus.PENDING;
        //                rollbackSteaming.remarks = item.remarks;

        //                if (string.IsNullOrEmpty(item.customer_guid))
        //                    throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

        //                var customerGuid = item.customer_guid;
        //                var steamingPart = await context.steaming_part.Where(r => r.steaming_guid == item.guid &&
        //                                                                    (!string.IsNullOrEmpty(r.tariff_steaming_guid)) &&
        //                                                                    (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
        //                foreach (var part in steamingPart)
        //                {
        //                    part.update_by = user;
        //                    part.update_dt = currentDateTime;
        //                    part.approve_part = null;
        //                    part.approve_cost = part.cost;
        //                    part.approve_labour = part.labour;
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

        public async Task<int> RecordSteamingTemp(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, steaming_temp steamingTemp, double requiredTemp)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(steamingTemp.guid))
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
                else
                {
                    if (string.IsNullOrEmpty(steamingTemp.guid))
                        throw new GraphQLException(new Error($"Steaming object cannot be null for update", "ERROR"));

                    var updateSteamTemp = new steaming_temp() { guid = steamingTemp.guid };
                    context.Attach(updateSteamTemp);
                    updateSteamTemp.update_by = user;
                    updateSteamTemp.update_dt = currentDateTime;
                    updateSteamTemp.bottom_temp = steamingTemp.bottom_temp;
                    updateSteamTemp.top_temp = steamingTemp.top_temp;
                    updateSteamTemp.meter_temp = steamingTemp.meter_temp;
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

                if (steaming == null)
                    throw new GraphQLException(new Error($"Steaming object cannot be null or empty", "ERROR"));

                var updateSteaming = new steaming() { guid = steaming.guid };
                context.steaming.Attach(updateSteaming);
                updateSteaming.update_by = user;
                updateSteaming.update_dt = currentDateTime;
                updateSteaming.remarks = steaming.remarks;

                if (ObjectAction.IN_PROGRESS.EqualsIgnore(steaming.action))
                    updateSteaming.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                else if (ObjectAction.CANCEL.EqualsIgnore(steaming.action))
                    updateSteaming.status_cv = CurrentServiceStatus.CANCELED;
                else if (ObjectAction.COMPLETE.EqualsIgnore(steaming.action))
                {
                    updateSteaming.status_cv = CurrentServiceStatus.COMPLETED;
                    updateSteaming.complete_by = user;
                    updateSteaming.complete_dt = currentDateTime;

                    if (!await TankMovementCheckInternal(context, "steaming", steaming.sot_guid, steaming.guid))
                        //if no other steaming estimate or all completed. then we check cross process tank movement
                        await TankMovementCheckCrossProcess(context, steaming.sot_guid, user, currentDateTime);
                }
                else if (ObjectAction.NA.EqualsIgnore(steaming.action))
                {
                    updateSteaming.status_cv = CurrentServiceStatus.NO_ACTION;
                    updateSteaming.na_dt = currentDateTime;

                    if (!await TankMovementCheckInternal(context, "steaming", steaming.sot_guid, steaming.guid))
                        //if no other steaming estimate or all completed. then we check cross process tank movement
                        await TankMovementCheckCrossProcess(context, steaming.sot_guid, user, currentDateTime);
                    //var sot = await context.storing_order_tank
                    //    .Include(s => s.residue)
                    //    .Where(s => s.guid == steaming.sot_guid).FirstOrDretefaultAsync();
                    //if (sot != null)
                    //{
                    //    if (sot.residue.Any(r => CurrentServiceStatus.APPROVED.EqualsIgnore(r?.status_cv)))
                    //        sot.tank_status_cv = TankMovementStatus.CLEANING;
                    //    else if (sot?.purpose_cleaning ?? false)
                    //        sot.tank_status_cv = TankMovementStatus.CLEANING;
                    //    else if (!string.IsNullOrEmpty(sot?.purpose_repair_cv))
                    //        sot.tank_status_cv = TankMovementStatus.REPAIR;
                    //    else
                    //        sot.tank_status_cv = TankMovementStatus.STORAGE;
                    //    sot.update_by = user;
                    //    sot.update_dt = currentDateTime;
                    //}
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
