using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.InGateSurvey.GqlTypes;
using IDMS.InGateSurvey.Model;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace IDMS.InGate.GqlTypes
{
    [ExtendObjectType(typeof(IGSurveyMutation))]
    public class OutGate_MutationType
    {
        //[Authorize]
        public async Task<Record> AddOutGate(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, 
            out_gate OutGate, release_order ReleaseOrder)
        {
            int retval = 0;
            Record record = new();

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);

                if (string.IsNullOrEmpty(OutGate.so_tank_guid))
                {
                    throw new GraphQLException(new Error("Tank guid is empty", "Error"));
                }

                var currentDate = DateTime.Now.ToEpochTime();
                var newGuid = (string.IsNullOrEmpty(OutGate.guid) ? Util.GenerateGUID() : OutGate.guid);
                
                out_gate newOutGate = new()
                {
                    guid = newGuid,
                    create_by = user,
                    create_dt = currentDate,

                    eir_dt = currentDate,
                    driver_name = OutGate.driver_name,
                    //Trigger auto generated
                    //eir_no = OutGate.eir_no,
                    //eir_status_cv = "YET_TO_SURVEY",

                    so_tank_guid = OutGate.so_tank_guid,
                    vehicle_no = OutGate.vehicle_no,
                    remarks = OutGate.remarks,
                };
                await context.out_gate.AddAsync(newOutGate);

                var soTank = new storing_order_tank() { guid = OutGate.so_tank_guid };
                context.Attach(soTank);
                soTank.tank_status_cv = TankMovementStatus.OUTGATE;
                soTank.update_by = user;
                soTank.update_dt = currentDate;

                var RO = new release_order() { guid = ReleaseOrder.guid };
                context.Attach(RO);
                RO.status_cv = ROStatus.PROCESSING;
                RO.update_by = user;
                RO.update_dt = currentDate;

                if (OutGate.haulier != ReleaseOrder.haulier)
                    RO.haulier = OutGate.haulier;

                retval = await context.SaveChangesAsync();
                record = new Record() { affected = retval, guid = new List<string>() { newGuid } };

                if (config != null)
                {
                    string evtId = EventId.NEW_OUTGATE;
                    string evtName = EventName.NEW_OUTGATE;

                    int count = context.out_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                                .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0).Count();
                   //.Include(s => s.tank.tariff_cleaning)
                   //.Include(s => s.tank.storing_order)
                   //.Include(s => s.tank.storing_order.customer_company)
                   //.Include(s => s.tank.tariff_cleaning.cleaning_method)
                   //.Include(s => s.tank.tariff_cleaning.cleaning_category).Count();
                    GqlUtils.SendGlobalNotification(config, evtId, evtName, count);
                    string notification_uid = $"out-gate-{newOutGate.eir_no}";
                    GqlUtils.AddAndTriggerStaffNotification(config, 3, "out-gate", "new out-gate was check-out", notification_uid);
                }
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

            return record;
        }

        //[Authorize]
        public async Task<int> UpdateOutGate(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,
            out_gate OutGate, release_order ReleaseOrder)
        {
            int retval = 0;
            //string so_guid = "";
            try
            {
                if (OutGate != null)
                {

                    if (string.IsNullOrEmpty(OutGate.so_tank_guid))
                    {
                        throw new GraphQLException(new Error("Tank guid is empty", "Error"));
                    }

                    var currentDate = DateTime.Now.ToEpochTime();
                    var user = GqlUtils.IsAuthorize(config, httpContextAccessor);

                    var updatedOutgate = new out_gate() { guid = OutGate.guid };
                    context.Attach(updatedOutgate);
                    updatedOutgate.update_by = user;
                    updatedOutgate.update_dt = currentDate;
                    updatedOutgate.vehicle_no = OutGate.vehicle_no;
                    updatedOutgate.driver_name = OutGate.driver_name;
                    updatedOutgate.remarks = OutGate.remarks;


                    if (OutGate.tank == null)
                    {
                        throw new GraphQLException(new Error("Tank object cannot be null", "Error"));
                    }
                    var so_tank = new storing_order_tank() { guid = OutGate.tank.guid };
                    context.Attach(so_tank);
                    so_tank.release_job_no = OutGate.tank.release_job_no;
                    so_tank.update_by = user;
                    so_tank.update_dt = currentDate;

                    if (OutGate.haulier != ReleaseOrder.haulier)
                    {
                        var RO = new release_order() { guid = ReleaseOrder.guid };
                        context.Attach(RO);
                        RO.haulier = OutGate.haulier;
                        RO.update_by = user;
                        RO.update_dt = currentDate;
                    }

                    retval = context.SaveChanges();
                }
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        //public async Task<int> DeleteInGate(ApplicationInventoryDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        //{
        //    int retval = 0;
        //    try
        //    {

        //        var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        var query = context.in_gate.Where(i => i.guid == $"{InGate_guid}").FirstOrDefault();
        //        var querySurvey = context.in_gate_survey.Where(s=>s.in_gate_guid == $"{InGate_guid}").FirstOrDefault();
        //        if (query!=null)
        //        {
        //            long epochNow = GqlUtils.GetNowEpochInSec();
        //            var delInGate = query;
        //            delInGate.delete_dt = epochNow;
        //            delInGate.update_by = uid;
        //            delInGate.update_dt = epochNow;

        //            if(querySurvey!=null)
        //            {
        //                epochNow = GqlUtils.GetNowEpochInSec();
        //                var delInGateSurvey = querySurvey;
        //                delInGateSurvey.delete_dt = epochNow;
        //                delInGateSurvey.update_by = uid;
        //                delInGateSurvey.update_dt = epochNow;
        //            }
        //           retval = context.SaveChanges(true);
        //        }

        //        //long epochNow = GqlUtils.GetNowEpochInSec();
        //        //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        //var guid = Util.GenerateGUID();
        //        //var delNow = GqlUtils.GetNowEpochInSec();
        //        //var command = @$"update in_gate set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{InGate_guid}' ";
        //        ////var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
        //        ////            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
        //        ////            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

        //        //var result = await GqlUtils.RunNonQueryCommand(config, command);
        //        //if (result["result"] != null)
        //        //{
        //        //    retval.result = Convert.ToInt32(result["result"]);
        //        //}
        //    }
        //    catch
        //    {
        //        throw;
        //    }
        //    return retval;
        //}


        //private void CheckAndUpdateROStatus(ApplicationInventoryDBContext context, string guid)
        //{
        //    try
        //    {
        //        var tanks = context.storing_order_tank.Where(t => t.so_guid == guid);
        //        var Status = "PROCESSING";
        //        int nCountCancel = 0;
        //        int nCountWait = 0;
        //        int nCountAccept = 0;
        //        foreach (var tank in tanks)
        //        {
        //            switch (tank.status_cv.Trim())
        //            {
        //                case "WATING":
        //                    nCountWait++;
        //                    break;
        //                case "ACCEPTED":
        //                    nCountAccept++;
        //                    break;
        //                case "CANCELED":
        //                    nCountCancel++;
        //                    break;
        //            }
        //        }

        //        if (nCountWait == 0)
        //        {
        //            if ((nCountAccept + nCountCancel) == tanks.Count())
        //            {
        //                if (nCountAccept > 0)
        //                {
        //                    Status = "COMPLETED";
        //                }
        //                else
        //                {
        //                    Status = "CANCELED";
        //                }
        //            }

        //        }

        //        var so = context.storing_order.Where(so => so.guid == guid).FirstOrDefault();
        //        if (so != null)
        //        {
        //            so.status_cv = Status;
        //        }

        //    }
        //    catch
        //    {
        //        throw;

        //    }
        //}
    }
}
