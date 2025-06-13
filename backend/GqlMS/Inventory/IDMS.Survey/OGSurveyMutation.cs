using AutoMapper;
using CommonUtil.Core.Service;
using IDMS.Survey.GqlTypes.LocalModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using IDMS.Models.Shared;

namespace IDMS.Survey.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class OGSurveyMutation
    {
        //[Authorize]
        public async Task<Record> AddOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            OutGateSurveyRequest outGateSurveyRequest, OutGateRequest outGateRequest)
        {
            int retval = 0;
            List<string> retGuids = new List<string>();
            Record record = new();

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                out_gate_survey outgateSurvey = new();
                mapper.Map(outGateSurveyRequest, outgateSurvey);

                outgateSurvey.guid = Util.GenerateGUID();
                outgateSurvey.create_by = user;
                outgateSurvey.create_dt = currentDateTime;
                context.out_gate_survey.Add(outgateSurvey);

                //Outgate handling
                var outgate = await context.out_gate.Where(i => i.guid == outGateRequest.guid && i.delete_dt == null).FirstOrDefaultAsync();
                if (outgate != null)
                {
                    outgate.remarks = outGateRequest.remarks;
                    outgate.vehicle_no = outGateRequest.vehicle_no;
                    outgate.driver_name = outGateRequest.driver_name;
                    outgate.haulier = outGateRequest.haulier;
                    //yet to survey --> pending
                    outgate.eir_status_cv = EirStatus.PENDING;
                    outgate.update_by = user;
                    outgate.update_dt = currentDateTime;
                }

                //if (outgateSurvey == null)
                //    throw new GraphQLException(new Error("Outgate survey object cannot be null or empty.", "ERROR"));

                ////Get the SOT object
                //if (outGateRequest.tank == null || string.IsNullOrEmpty(outGateRequest.tank.guid))
                //    throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "ERROR"));

                //var tnk = outGateRequest.tank;

                //var tankDetail = new TankDetail();
                //tankDetail.tank_no = tnk.tank_no;
                //tankDetail.owner_guid = tnk.owner_guid;
                //tankDetail.unit_type_guid = tnk.unit_type_guid;

                //if (!outGateRequest.have_outgate_survrey)
                //{
                //    storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                //    context.storing_order_tank.Attach(sot);
                //    sot.unit_type_guid = tnk.unit_type_guid;
                //    sot.owner_guid = tnk.owner_guid;
                //    sot.tank_no = string.IsNullOrEmpty(tnk.tank_no) ? throw new GraphQLException(new Error("Tank no cannot bu null or empty.", "Error")) : tnk.tank_no;
                //    sot.update_by = user;
                //    sot.update_dt = currentDateTime;
                //    sot.tank_status_cv = TankMovementStatus.RELEASED;

                //    //Add the newly created guid into list for return
                //    retGuids.Add(outgateSurvey.guid);

                //    if (!string.IsNullOrEmpty(outGateRequest.release_order?.guid))
                //    {
                //        var RO = new release_order() { guid = outGateRequest.release_order.guid };
                //        context.Attach(RO);
                //        if (!string.IsNullOrEmpty(outGateRequest.haulier))
                //        {
                //            RO.haulier = outGateRequest.haulier;
                //            RO.update_by = user;
                //            RO.update_dt = currentDateTime;
                //        }
                //    }

                //    var preOrderTank = await context.storing_order_tank.Where(s => s.tank_no == tnk.tank_no && s.status_cv == SOTankStatus.PREORDER
                //                                                                 && s.delete_dt == null).FirstOrDefaultAsync();
                //    if (preOrderTank != null)
                //    {
                //        preOrderTank.status_cv = SOTankStatus.WAITING;
                //        preOrderTank.update_by = user;
                //        preOrderTank.update_dt = currentDateTime;
                //    }
                //}

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_OUTGATE;
                string evtName = EventName.NEW_OUTGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);

                //Tank info handling
                //await AddTankInfo(context, mapper, user, currentDateTime, tankDetail, outgateSurvey, null);

                //Bundle the retVal and retGuid return as record object
                record = new Record() { affected = retval, guid = retGuids };
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return record;
        }

        //[Authorize]
        public async Task<int> UpdateOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            OutGateSurveyRequest outGateSurveyRequest, OutGateRequest outGateRequest)
        {
            int retval = 0;
            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    long currentDateTime = DateTime.Now.ToEpochTime();

                    out_gate_survey? outgateSurvey = await context.out_gate_survey.Where(i => i.guid == outGateSurveyRequest.guid &&
                                                                                     (i.delete_dt == null || i.delete_dt == 0)).FirstOrDefaultAsync();
                    if (outgateSurvey == null)
                        throw new GraphQLException(new Error("Outgate survey object cannot be null or empty.", "ERROR"));

                    if (outgateSurvey.out_gate_guid == null)
                        throw new GraphQLException(new Error("Outgate guid cant be null.", "ERROR"));


                    mapper.Map(outGateSurveyRequest, outgateSurvey);

                    if (string.IsNullOrEmpty(outGateSurveyRequest.guid))
                    {
                        outgateSurvey.guid = Util.GenerateGUID();
                        outgateSurvey.create_by = user;
                        outgateSurvey.create_dt = currentDateTime;
                        context.out_gate_survey.Add(outgateSurvey);
                    }
                    else
                    {
                        outgateSurvey.update_by = user;
                        outgateSurvey.update_dt = currentDateTime;
                    }

                    //var igWithTank = inGateWithTankRequest;
                    var outgate = await context.out_gate.Where(i => i.guid == outGateRequest.guid).FirstOrDefaultAsync();
                    if (outgate != null)
                    {
                        outgate.remarks = outGateRequest.remarks;
                        outgate.vehicle_no = outGateRequest.vehicle_no;
                        outgate.driver_name = outGateRequest.driver_name;
                        outgate.haulier = outGateRequest.haulier;
                        //yet to survey --> pending
                        //outgate.eir_status_cv = EirStatus.PENDING;
                        outgate.update_by = user;
                        outgate.update_dt = currentDateTime;
                    }

                    if (!string.IsNullOrEmpty(outGateRequest.release_order?.guid))
                    {
                        var RO = new release_order() { guid = outGateRequest.release_order.guid };
                        context.Attach(RO);
                        if (!string.IsNullOrEmpty(outGateRequest.haulier))
                        {
                            RO.haulier = outGateRequest.haulier;
                            RO.update_by = user;
                            RO.update_dt = currentDateTime;
                        }
                    }

                    var tnk = outGateRequest.tank;
                    storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                    context.Attach(sot);
                    sot.owner_guid = tnk.owner_guid;
                    sot.unit_type_guid = tnk.unit_type_guid;
                    sot.tank_no = string.IsNullOrEmpty(tnk.tank_no) ? throw new GraphQLException(new Error("Tank no cannot bu null or empty.", "ERROR")) : tnk.tank_no;
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();

                    //Tank info handling
                    var tankDetail = new TankDetail();
                    tankDetail.tank_no = tnk.tank_no;
                    tankDetail.owner_guid = tnk.owner_guid;
                    tankDetail.unit_type_guid = tnk.unit_type_guid;

                    await AddTankInfo(context, mapper, user, currentDateTime, tankDetail, outgateSurvey, null);

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();

                    //TODO
                    string evtId = EventId.NEW_OUTGATE;
                    string evtName = EventName.NEW_OUTGATE;
                    GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();
                    throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
                }
            }

            return retval;
        }

        public async Task<int> DeleteOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string OGSurvey_guid)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var query = context.out_gate_survey.Where(i => i.guid == $"{OGSurvey_guid}");
                if (query.Any())
                {
                    var delOutGateSurvey = query.FirstOrDefault();

                    delOutGateSurvey.delete_dt = currentDateTime;
                    delOutGateSurvey.update_by = user;
                    delOutGateSurvey.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        public async Task<int> PublishOutgateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, OutGateRequest outGateRequest)
        {
            int retval = 0;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {

                    var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    long currentDateTime = DateTime.Now.ToEpochTime();

                    var outgate = new out_gate() { guid = outGateRequest.guid };
                    context.Attach(outgate);

                    outgate.eir_status_cv = EirStatus.PUBLISHED;
                    outgate.update_by = user;
                    outgate.publish_by = user;
                    outgate.update_dt = currentDateTime;
                    outgate.publish_dt = currentDateTime;

                    //TODO: Pending implementation of publish pdf -------------------------------

                    //SOT Handling
                    if (outGateRequest.tank == null || string.IsNullOrEmpty(outGateRequest.tank.guid))
                        throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "ERROR"));

                    if (outGateRequest.out_gate_survey == null)
                        throw new GraphQLException(new Error("Outgate survey object cannot be null or empty.", "ERROR"));

                    var tnk = outGateRequest.tank;
                    storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                    context.storing_order_tank.Attach(sot);
                    //sot.unit_type_guid = tnk.unit_type_guid;
                    //sot.owner_guid = tnk.owner_guid;
                    //sot.tank_no = string.IsNullOrEmpty(tnk.tank_no) ? throw new GraphQLException(new Error("Tank no cannot bu null or empty.", "Error")) : tnk.tank_no;
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.tank_status_cv = TankMovementStatus.RELEASED;

                    //Pre-Order Handling
                    var preOrderTank = await context.storing_order_tank.Where(s => s.tank_no == tnk.tank_no &&
                                                                s.status_cv == SOTankStatus.PREORDER && s.delete_dt == null).FirstOrDefaultAsync();
                    if (preOrderTank != null)
                    {
                        preOrderTank.status_cv = SOTankStatus.WAITING;
                        preOrderTank.update_by = user;
                        preOrderTank.update_dt = currentDateTime;
                    }

                    await context.SaveChangesAsync();

                    //Tank info handling
                    var tankDetail = new TankDetail();
                    tankDetail.tank_no = tnk.tank_no;
                    tankDetail.owner_guid = tnk.owner_guid;
                    tankDetail.unit_type_guid = tnk.unit_type_guid;
                    await AddTankInfo(context, mapper, user, currentDateTime, tankDetail, outGateRequest.out_gate_survey, null);

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();
                    throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
                }
            }

            return retval;
        }

        private async Task AddTankInfo(ApplicationInventoryDBContext context, IMapper mapper, string user, long currentDateTime,
                                  TankDetail tankDetail, out_gate_survey outgateSurvey, string? yard)
        {
            //populate the tank_info details
            var tankInfo = new tank_info()
            {
                tank_no = tankDetail.tank_no,
                owner_guid = tankDetail.owner_guid,
                unit_type_guid = tankDetail.unit_type_guid,
                last_release_dt = currentDateTime, //use current Date Time 
                tank_comp_guid = outgateSurvey.tank_comp_guid,
                manufacturer_cv = outgateSurvey.manufacturer_cv,
                dom_dt = outgateSurvey.dom_dt,
                cladding_cv = outgateSurvey.cladding_cv,
                max_weight_cv = outgateSurvey.max_weight_cv,
                height_cv = outgateSurvey.height_cv,
                walkway_cv = outgateSurvey.walkway_cv,
                capacity = outgateSurvey.capacity,
                tare_weight = outgateSurvey.tare_weight,
                last_test_cv = outgateSurvey.last_test_cv,
                next_test_cv = outgateSurvey.next_test_cv,
                test_dt = outgateSurvey.test_dt,
                test_class_cv = outgateSurvey.test_class_cv,
                yard_cv = yard,
                //last_notify_dt = null,
            };

            await GqlUtils.TankInfoHandling(mapper, context, user, currentDateTime, tankInfo);
        }
    }
}
