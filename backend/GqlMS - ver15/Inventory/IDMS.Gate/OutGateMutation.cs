﻿using CommonUtil.Core.Service;
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


                if (ReleaseOrder?.release_order_sot != null)
                {
                    foreach(var item in ReleaseOrder?.release_order_sot)
                    {
                        var roSOT = new release_order_sot() { guid = item.guid };
                        context.release_order_sot.Attach(roSOT);
                        roSOT.status_cv = SOTankStatus.ACCEPTED;
                        roSOT.update_by = user;
                        roSOT.update_dt = currentDate; 
                    }
                }
                //save change before check RO status based on roSOT
                retval = await context.SaveChangesAsync();

                var RO = new release_order() { guid = ReleaseOrder.guid };
                context.Attach(RO);
                RO.status_cv = await CheckAndUpdateROStatus(context, ReleaseOrder.guid);
                RO.update_by = user;
                RO.update_dt = currentDate;
                if (!string.IsNullOrEmpty(OutGate.haulier))
                    RO.haulier = OutGate.haulier;
                _ = await context.SaveChangesAsync();

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
            catch (Exception ex)
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
                    if (!string.IsNullOrEmpty(OutGate.haulier))
                        updatedOutgate.haulier = OutGate.haulier;

                    if (OutGate.tank == null)
                    {
                        throw new GraphQLException(new Error("Tank object cannot be null", "Error"));
                    }
                    var so_tank = new storing_order_tank() { guid = OutGate.tank.guid };
                    context.Attach(so_tank);
                    so_tank.release_job_no = OutGate.tank.release_job_no;
                    so_tank.update_by = user;
                    so_tank.update_dt = currentDate;

                    var RO = new release_order() { guid = ReleaseOrder.guid };
                    context.Attach(RO);
                    if (!string.IsNullOrEmpty(OutGate.haulier))
                        RO.haulier = OutGate.haulier;

                    RO.update_by = user;
                    RO.update_dt = currentDate;
        
                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        private async Task<string> CheckAndUpdateROStatus(ApplicationInventoryDBContext context, string guid)
        {
            try
            {
                var tanks = await context.release_order_sot.Where(t => t.ro_guid == guid).ToListAsync();
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

                return Status;
            }
            catch
            {
                throw;

            }
        }
    }
}