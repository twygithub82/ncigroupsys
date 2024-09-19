using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace IDMS.InGate.GqlTypes
{
    [ExtendObjectType(typeof(Mutation))]
    public class InGate_Mutation
    {
        //[Authorize]
        public async Task<int> AddInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor
            , InGateWithTank InGate)
        {
            int retval = 0;
            try
            {
                
                string so_guid = "";
                //GqlUtils.AddAndTriggerStaffNotification(config, 3, "in-gate", "new in-gate was check-in");
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDate = GqlUtils.GetNowEpochInSec();
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                InGate.create_by = uid;
                InGate.create_dt = currentDate;
                InGateWithTank newInGate = new()
                {
                    create_by = InGate.create_by,
                    create_dt = InGate.create_dt,
                    driver_name = InGate.driver_name,
                    //eir_doc =InGate.eir_doc,
                    eir_dt = currentDate,
                    eir_no = InGate.eir_no,
                    guid = InGate.guid,
                    remarks = InGate.remarks,
                    //   haulier =InGate.haulier,
                    lolo_cv = InGate.lolo_cv,
                    preinspection_cv = InGate.preinspection_cv,
                    so_tank_guid = InGate.so_tank_guid,
                    vehicle_no = InGate.vehicle_no,
                    yard_cv = InGate.yard_cv,

                };
                if(string.IsNullOrEmpty(InGate.so_tank_guid))
                {
                    throw new GraphQLException(new Error("Tank guid is empty", "404"));
                }

                var so_tank = context.storing_order_tank.Where(sot => sot.guid == InGate.so_tank_guid).Include(so => so.storing_order).FirstOrDefault();

                if (so_tank == null)
                {
                    throw new GraphQLException(new Error("Tank not found", "404"));
                }

                var so = so_tank.storing_order;
                if (so == null)
                {
                    throw new GraphQLException(new Error("Storing Order not found", "404"));
                }

                if (so.haulier != InGate.haulier)
                {
                    so.haulier = InGate.haulier;
                    so.update_by = uid;
                    so.update_dt = currentDate;
                }

                if (InGate.tank != null)
                {
                    string tankStatusGuid =$"{config["CodeValuesSetting:TankStatusGuid"]}";
                    if (so_tank.status_cv != "WAITING")
                    {
                        throw new GraphQLException(new Error("Tank status is not waiting", "404"));
                    }
                    so_tank.job_no = InGate.tank.job_no;
                    so_tank.status_cv = "ACCEPTED";
                    so_tank.tank_status_cv = GqlUtils.GetCodeValue(context, tankStatusGuid);
                    //   so_tank.purpose_cleaning = InGate.tank.purpose_cleaning;
                    //   so_tank.purpose_steam= InGate.tank.purpose_steam;
                    so_tank.owner_guid = InGate.tank.owner_guid;
                    so_tank.last_cargo_guid = InGate.tank.last_cargo_guid;
                    so_tank.purpose_storage = InGate.tank.purpose_storage;
                    so_tank.update_by = uid;
                    so_tank.update_dt = currentDate;
                    so_guid = so_tank.so_guid;
                }
                newInGate.eir_no = $"{so.so_no}";
                //if(so.haulier!=InGate.haulier)
                //{
                //    so.haulier = InGate.haulier;
                //}

                context.in_gate.Add(newInGate);


                if (!string.IsNullOrEmpty(so_guid))
                {
                    CheckAndUpdateSOStatus(context, so_guid);
                }

                retval = context.SaveChanges();
                if (config != null)
                {
                    string evtId = EventId.NEW_INGATE;
                    string evtName = EventName.NEW_INGATE;
                    int count = context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                   .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0)
                   .Include(s => s.tank.tariff_cleaning)
                   .Include(s => s.tank.storing_order)
                   .Include(s => s.tank.storing_order.customer_company)
                   .Include(s => s.tank.tariff_cleaning.cleaning_method)
                   .Include(s => s.tank.tariff_cleaning.cleaning_category).Count();
                    GqlUtils.SendGlobalNotification(config, evtId, evtName, count);
                    string notification_uid = $"in-gate-{newInGate.eir_no}";
                    GqlUtils.AddAndTriggerStaffNotification(config, 3, "in-gate", "new in-gate was check-in", notification_uid);
                }
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        //[Authorize]
        public async Task<int> UpdateInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, InGateWithTank InGate)
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
                    var updatedIngate = new InGateWithTank() { guid = InGate.guid };
                    context.Attach(updatedIngate);

                    updatedIngate.remarks = InGate.remarks;
                    updatedIngate.driver_name = InGate.driver_name;
                    updatedIngate.vehicle_no = InGate.vehicle_no;
                    updatedIngate.update_by = uid;
                    updatedIngate.update_dt = epochNow;

                    var so_tank = context.storing_order_tank.Where(sot => sot.guid == InGate.so_tank_guid).Include(so => so.storing_order).FirstOrDefault();

                    if (string.IsNullOrEmpty(InGate.so_tank_guid))
                    {
                        throw new GraphQLException(new Error("Tank guid is empty", "404"));
                    }

                    if (so_tank == null)
                    {
                        throw new GraphQLException(new Error("Tank not found", "404"));
                    }

                    var so = so_tank.storing_order;

                    if (so == null)
                    {
                        throw new GraphQLException(new Error("Storing Order not found", "404"));
                    }

                    if (so.haulier != InGate.haulier)
                    {
                        so.haulier = InGate.haulier;
                        so.update_by = uid;
                        so.update_dt = epochNow;
                    }

                    if (InGate.tank != null)
                    {
                        so_tank.job_no = InGate.tank.job_no;
                        so_tank.status_cv = "ACCEPTED";
                        //so_tank.purpose_cleaning = InGate.tank.purpose_cleaning;
                        //  so_tank.purpose_steam = InGate.tank.purpose_steam;
                        so_tank.last_cargo_guid = InGate.tank.last_cargo_guid;
                        so_tank.purpose_storage = InGate.tank.purpose_storage;
                        so_tank.owner_guid = InGate.tank.owner_guid;
                        so_tank.update_by = uid;
                        so_tank.update_dt = epochNow;
                        so_guid = so_tank.so_guid;
                    }

                    if (!string.IsNullOrEmpty(so_guid))
                    {
                        CheckAndUpdateSOStatus(context, so_guid);
                    }

                    retval = await context.SaveChangesAsync();
                    // retval = InGate;
                }

            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
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
                var querySurvey = context.in_gate_survey.Where(s=>s.in_gate_guid == $"{InGate_guid}").FirstOrDefault();
                if (query!=null)
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var delInGate = query;
                    delInGate.delete_dt = epochNow;
                    delInGate.update_by = uid;
                    delInGate.update_dt = epochNow;

                    if(querySurvey!=null)
                    {
                        epochNow = GqlUtils.GetNowEpochInSec();
                        var delInGateSurvey = querySurvey;
                        delInGateSurvey.delete_dt = epochNow;
                        delInGateSurvey.update_by = uid;
                        delInGateSurvey.update_dt = epochNow;
                    }
                   retval = context.SaveChanges(true);
                }

                //long epochNow = GqlUtils.GetNowEpochInSec();
                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = Util.GenerateGUID();
                //var delNow = GqlUtils.GetNowEpochInSec();
                //var command = @$"update in_gate set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{InGate_guid}' ";
                ////var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                ////            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                ////            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                //var result = await GqlUtils.RunNonQueryCommand(config, command);
                //if (result["result"] != null)
                //{
                //    retval.result = Convert.ToInt32(result["result"]);
                //}
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        private void CheckAndUpdateSOStatus(ApplicationInventoryDBContext context, string guid)
        {
            try
            {
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
                }

            }
            catch
            {
                throw;

            }
        }
    }
}
