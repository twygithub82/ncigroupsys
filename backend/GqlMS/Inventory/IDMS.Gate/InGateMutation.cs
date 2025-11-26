using CommonUtil.Core.Service;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Billing;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Package;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;


namespace IDMS.Gate.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class InGateMutation
    {
        private readonly ILogger<InGateMutation> _logger;

        public InGateMutation(ILogger<InGateMutation> logger)
        {
            _logger = logger;
        }

        //[Authorize]
        public async Task<int> AddInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, in_gate InGate)
        {
            int retval = 0;
            try
            {
                string so_guid = "";
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDate = GqlUtils.GetNowEpochInSec();
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                InGate.create_by = uid;
                InGate.create_dt = currentDate;
                InGate.update_by = uid;
                InGate.update_dt = currentDate;
                in_gate newInGate = new()
                {
                    create_by = InGate.create_by,
                    create_dt = InGate.create_dt,
                    driver_name = InGate.driver_name,
                    eir_dt = currentDate,
                    eir_no = InGate.eir_no,
                    guid = InGate.guid,
                    remarks = InGate.remarks,
                    so_tank_guid = InGate.so_tank_guid,
                    vehicle_no = InGate.vehicle_no,
                    yard_cv = InGate.yard_cv,
                };

                if (string.IsNullOrEmpty(InGate.so_tank_guid))
                {
                    _logger.LogWarning("AddInGate failed: Tank guid is null or empty");
                    throw new GraphQLException(new Error("Tank guid cannot be null or empty", "NOT FOUND"));
                }

                var so_tank = await context.storing_order_tank.Where(sot => sot.guid == InGate.so_tank_guid).Include(so => so.storing_order).FirstOrDefaultAsync();

                if (so_tank == null)
                {
                    _logger.LogWarning("AddInGate failed: storing_order_tank not found for guid={SoTankGuid}", InGate.so_tank_guid);
                    throw new GraphQLException(new Error("Tank not found", "NOT FOUND"));
                }

                var so = so_tank.storing_order;
                if (so == null)
                {
                    _logger.LogWarning("AddInGate failed: storing_order not found for sot guid={SoTankGuid}", InGate.so_tank_guid);
                    throw new GraphQLException(new Error("Storing Order not found", "NOT FOUND"));
                }

                if (so.haulier != InGate.haulier)
                {
                    _logger.LogDebug("Updating SO haulier from {OldHaulier} to {NewHaulier} for soGuid={SoGuid}", so.haulier, InGate.haulier, so.guid);
                    so.haulier = InGate.haulier;
                }
                so.update_by = uid;
                so.update_dt = currentDate;

                if (InGate.tank != null)
                {
                    if (SOTankStatus.WAITING != so_tank.status_cv)
                    {
                        _logger.LogWarning("AddInGate failed: tank status is not WAITING for sotGuid={SoTankGuid} status={Status}", so_tank.guid, so_tank.status_cv);
                        throw new GraphQLException(new Error("Tank status is not waiting", "ERROR"));
                    }

                    so_tank.job_no = InGate.tank.job_no;
                    so_tank.status_cv = SOTankStatus.ACCEPTED;
                    so_tank.tank_status_cv = TankMovementStatus.INGATE_SURVEY;
                    so_tank.owner_guid = InGate.tank.owner_guid;
                    so_tank.last_cargo_guid = InGate.tank.last_cargo_guid;
                    so_tank.update_by = uid;
                    so_tank.update_dt = currentDate;
                    so_guid = so_tank.so_guid;

                    _logger.LogInformation("Accepted tank sotGuid={SotGuid} job_no={JobNo}", so_tank.guid, so_tank.job_no);
                }

                newInGate.eir_no = $"{so.so_no}";
                context.in_gate.Add(newInGate);

                if (!string.IsNullOrEmpty(so_guid))
                {
                    CheckAndUpdateSOStatus(context, so_guid);
                }

                retval = context.SaveChanges();
                _logger.LogInformation("AddInGate saved guid={Guid} affected={Affected}", newInGate.guid, retval);

                //added this after ingate done
                await AddBillingSOT(context, uid, currentDate, InGate);

                if (config != null)
                {
                    string evtId = Models.EventId.NEW_INGATE;
                    string evtName = EventName.NEW_INGATE;
                    int count = await context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                   .Include(s => s.tank).Where(i => i.tank != null)
                   .Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0).CountAsync();

                    //GqlUtils.SendGlobalNotification(config, evtId, evtName, count);
                    await NotificationHandling(context, config, Models.EventId.NEW_INGATE);

                    string notification_uid = $"in-gate-{newInGate.eir_no}";
                    GqlUtils.AddAndTriggerStaffNotification(config, 3, "in-gate", "new in-gate was check-in", notification_uid);

                    _logger.LogDebug("Notification triggered for new in_gate eir_no={EirNo} count={Count}", newInGate.eir_no, count);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddInGate for so_tank_guid={SoTankGuid}", InGate?.so_tank_guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
            return retval;
        }

        //[Authorize]
        public async Task<int> UpdateInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                                            [Service] IHttpContextAccessor httpContextAccessor, in_gate InGate)
        {
            int retval = 0;
            string so_guid = "";
            try
            {
                if (InGate != null)
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                    //added to update ingate as well
                    var updatedIngate = new in_gate() { guid = InGate.guid };
                    context.Attach(updatedIngate);

                    updatedIngate.remarks = InGate.remarks;
                    updatedIngate.driver_name = InGate.driver_name;
                    updatedIngate.vehicle_no = InGate.vehicle_no;
                    updatedIngate.update_by = uid;
                    updatedIngate.update_dt = epochNow;

                    var so_tank = await context.storing_order_tank.Where(sot => sot.guid == InGate.so_tank_guid).Include(so => so.storing_order).FirstOrDefaultAsync();

                    if (string.IsNullOrEmpty(InGate.so_tank_guid))
                    {
                        _logger.LogWarning("UpdateInGate failed: so_tank_guid is null or empty");
                        throw new GraphQLException(new Error("Tank not found", "NOT FOUND"));
                    }

                    if (so_tank == null)
                    {
                        _logger.LogWarning("UpdateInGate failed: storing_order_tank not found for guid={SoTankGuid}", InGate.so_tank_guid);
                        throw new GraphQLException(new Error("Tank not found", "NOT FOUND"));
                    }

                    var so = so_tank.storing_order;
                    if (so == null)
                    {
                        _logger.LogWarning("UpdateInGate failed: storing_order not found for sot guid={SoTankGuid}", InGate.so_tank_guid);
                        throw new GraphQLException(new Error("Storing Order not found", "NOT FOUND"));
                    }

                    if (!string.IsNullOrEmpty(InGate.haulier) & so.haulier != InGate.haulier)
                        so.haulier = InGate.haulier;

                    so.update_by = uid;
                    so.update_dt = epochNow;

                    if (InGate.tank != null)
                    {
                        so_tank.tank_status_cv = TankMovementStatus.INGATE_SURVEY;
                        so_tank.job_no = InGate.tank.job_no;
                        so_tank.status_cv = SOTankStatus.ACCEPTED; //"ACCEPTED";
                        so_tank.last_cargo_guid = InGate.tank.last_cargo_guid;
                        so_tank.owner_guid = InGate.tank.owner_guid;
                        so_tank.update_by = uid;
                        so_tank.update_dt = epochNow;
                        so_guid = so_tank.so_guid;

                        _logger.LogInformation("UpdateInGate accepted sotGuid={SotGuid} job_no={JobNo}", so_tank.guid, so_tank.job_no);
                    }

                    if (!string.IsNullOrEmpty(so_guid))
                    {
                        _logger.LogDebug("UpdateInGate calling CheckAndUpdateSOStatus for soGuid={SoGuid}", so_guid);
                        CheckAndUpdateSOStatus(context, so_guid);
                    }

                    retval = await context.SaveChangesAsync();

                    _logger.LogInformation("UpdateInGate saved guid={Guid} affected={Affected}", InGate.guid, retval);

                    await NotificationHandling(context, config, Models.EventId.UPDATE_INGATE);
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateInGate for guid={Guid}", InGate?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var query = context.in_gate.Where(i => i.guid == $"{InGate_guid}").FirstOrDefault();
                var querySurvey = context.in_gate_survey.Where(s => s.in_gate_guid == $"{InGate_guid}").FirstOrDefault();
                if (query != null)
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var delInGate = query;
                    delInGate.delete_dt = epochNow;
                    delInGate.update_by = uid;
                    delInGate.update_dt = epochNow;

                    if (querySurvey != null)
                    {
                        epochNow = GqlUtils.GetNowEpochInSec();
                        var delInGateSurvey = querySurvey;
                        delInGateSurvey.delete_dt = epochNow;
                        delInGateSurvey.update_by = uid;
                        delInGateSurvey.update_dt = epochNow;
                    }

                    retval = context.SaveChanges(true);
                    _logger.LogInformation("DeleteInGate marked guid={Guid} deleted affected={Affected}", InGate_guid, retval);
                }
                else
                {
                    _logger.LogWarning("DeleteInGate: in_gate not found for guid={Guid}", InGate_guid);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteInGate for guid={Guid}", InGate_guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
            return retval;
        }

        private void CheckAndUpdateSOStatus(ApplicationInventoryDBContext context, string guid)
        {
            try
            {
                _logger.LogDebug("CheckAndUpdateSOStatus start for soGuid={SoGuid}", guid);

                var tanks = context.storing_order_tank.Where(t => t.so_guid == guid);
                var Status = "PROCESSING";
                int nCountCancel = 0;
                int nCountWait = 0;
                int nCountAccept = 0;
                foreach (var tank in tanks)
                {
                    switch (tank.status_cv.Trim())
                    {
                        case "WATING":
                            nCountWait++;
                            break;
                        case "ACCEPTED":
                            nCountAccept++;
                            break;
                        case "CANCELED":
                            nCountCancel++;
                            break;
                    }
                }

                _logger.LogDebug("CheckAndUpdateSOStatus counts for soGuid={SoGuid} waiting={Waiting} accepted={Accepted} canceled={Canceled}", guid, nCountWait, nCountAccept, nCountCancel);

                if (nCountWait == 0)
                {
                    if ((nCountAccept + nCountCancel) == tanks.Count())
                    {
                        if (nCountAccept > 0)
                        {
                            Status = "COMPLETED";
                        }
                        else
                        {
                            Status = "CANCELED";
                        }
                    }
                }

                var so = context.storing_order.Where(so => so.guid == guid).FirstOrDefault();
                if (so != null)
                {
                    so.status_cv = Status;
                    _logger.LogInformation("SO status updated for soGuid={SoGuid} status={Status}", guid, Status);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CheckAndUpdateSOStatus for soGuid={SoGuid}", guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        private async Task<int> AddBillingSOT(ApplicationInventoryDBContext context, string user, long currentDateTime, in_gate inGate)
        {
            try
            {
                string? sotGuid = inGate?.so_tank_guid;
                var existingBS = await context.billing_sot.Where(b=>b.sot_guid == sotGuid).FirstOrDefaultAsync();

                var customerGuid = inGate?.tank?.storing_order?.customer_company_guid;
                //var tariffDepotGuid = await context.tank.Where(t => t.guid == inGate.tank.unit_type_guid)
                //                            .Select(t => t.tariff_depot.guid).FirstOrDefaultAsync();

                var tankUnitType = await context.tank.Where(t => t.guid == inGate.tank.unit_type_guid).FirstOrDefaultAsync();
                if(tankUnitType == null)
                    throw new GraphQLException(new Error($"Tank Unit type object not found", "ERROR"));

                if (string.IsNullOrEmpty(tankUnitType.tariff_depot_guid))
                    throw new GraphQLException(new Error($"Tariff depot guid not found", "ERROR"));

                var packageDepot = await context.Set<package_depot>().Where(b => b.customer_company_guid == customerGuid && b.tariff_depot_guid == tankUnitType.tariff_depot_guid).FirstOrDefaultAsync();
                if (packageDepot == null)
                    throw new GraphQLException(new Error($"Package depot object not found", "ERROR"));

                if(existingBS != null)
                {
                    existingBS.update_by = user;
                    existingBS.update_dt = currentDateTime;

                    existingBS.tariff_depot_guid = tankUnitType.tariff_depot_guid;
                    existingBS.lift_on_cost = packageDepot.lolo_cost;
                    existingBS.lift_off_cost = packageDepot.lolo_cost;
                    existingBS.storage_cost = packageDepot.storage_cost;
                    existingBS.gate_in_cost = packageDepot.gate_in_cost;
                    existingBS.gate_out_cost = packageDepot.gate_out_cost;
                    existingBS.free_storage = packageDepot.free_storage;
                    existingBS.preinspection_cost = packageDepot.preinspection_cost;
                    existingBS.storage_cal_cv = packageDepot.storage_cal_cv;

                    _logger.LogInformation("Updated billing_sot for sotGuid={SotGuid}", existingBS.sot_guid);
                }
                else
                {
                    var newBS = new billing_sot();
                    newBS.guid = Util.GenerateGUID();
                    newBS.create_by = user;
                    newBS.create_dt = currentDateTime;
                    newBS.update_by = user;
                    newBS.update_dt = currentDateTime;
                    newBS.sot_guid = inGate?.so_tank_guid;

                    newBS.tariff_depot_guid = tankUnitType.tariff_depot_guid;
                    newBS.lift_on_cost = packageDepot.lolo_cost;
                    newBS.lift_off_cost = packageDepot.lolo_cost;
                    newBS.storage_cost = packageDepot.storage_cost;
                    newBS.gate_in_cost = packageDepot.gate_in_cost;
                    newBS.gate_out_cost = packageDepot.gate_out_cost;
                    newBS.free_storage = packageDepot.free_storage;
                    newBS.preinspection_cost = packageDepot.preinspection_cost;
                    newBS.storage_cal_cv = packageDepot.storage_cal_cv;

                    newBS.preinspection = tankUnitType.preinspect;
                    newBS.lift_off = tankUnitType.lift_off;
                    newBS.lift_on = tankUnitType.lift_on;
                    newBS.gate_in = tankUnitType.gate_in;
                    newBS.gate_out = tankUnitType.gate_out;

                    await context.billing_sot.AddAsync(newBS);

                    _logger.LogInformation("Inserted new billing_sot guid={Guid} for sotGuid={SotGuid}", newBS.guid, newBS.sot_guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("AddBillingSOT completed for sotGuid={SotGuid} affected={Affected}", sotGuid, res);
                return res;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddBillingSOT for sotGuid={SotGuid}", inGate?.so_tank_guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<bool> NotificationHandling(ApplicationInventoryDBContext context, [Service]IConfiguration config, string eventId)
        {
            _logger.LogDebug("NotificationHandling start eventId={EventId}", eventId);

            string evtId = eventId;
            string evtName = SotNotificationType.onPendingIngate_Survey.ToString();
            int pendingIngateCount = await GqlUtils.GetWaitingSOTCount(context);
            int pendingSurveyCount = await GqlUtils.GetGateCountOfDay(context, "IN");
            var payload = new
            {
                Pending_Ingate_Count = pendingIngateCount,
                Pending_Ingate_Survey_Count = pendingSurveyCount
            };

            _logger.LogInformation("Dispatching notification eventId={EventId} pendingIngate={PendingIngate} pendingSurvey={PendingSurvey}", eventId, pendingIngateCount, pendingSurveyCount);

            GqlUtils.SendGlobalNotification1(config, SotNotificationTopic.INGATE_UPDATED, evtId, evtName, pendingIngateCount, JsonConvert.SerializeObject(payload));
            return true;
        }
    }
}
