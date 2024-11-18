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


namespace IDMS.Gate.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class OutGateMutation
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
                    //eir_status_cv = "YET_TO_SURVEY",
                    eir_no = string.IsNullOrEmpty(OutGate.eir_no) ? ReleaseOrder.ro_no : OutGate.eir_no,
                    so_tank_guid = OutGate.so_tank_guid,
                    vehicle_no = OutGate.vehicle_no,
                    remarks = OutGate.remarks,
                };
                await context.out_gate.AddAsync(newOutGate);

                var soTank = new storing_order_tank() { guid = OutGate.so_tank_guid };
                context.Attach(soTank);
                soTank.tank_status_cv = TankMovementStatus.OUTGATE_SURVEY;
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
                    //updatedOutgate.haulier = OutGate.haulier;


                    if (OutGate.tank == null)
                    {
                        throw new GraphQLException(new Error("Tank object cannot be null", "Error"));
                    }
                    var so_tank = new storing_order_tank() { guid = OutGate.tank.guid };
                    context.Attach(so_tank);
                    so_tank.release_job_no = OutGate.tank.release_job_no;
                    so_tank.update_by = user;
                    so_tank.update_dt = currentDate;

                   // if (OutGate.haulier != ReleaseOrder.haulier)
                    //{
                    var RO = new release_order() { guid = ReleaseOrder.guid };
                    context.Attach(RO);
                    RO.haulier = ReleaseOrder.haulier;
                    RO.update_by = user;
                    RO.update_dt = currentDate;
                    //}

                    retval = await context.SaveChangesAsync();
                }
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }
    }
}
