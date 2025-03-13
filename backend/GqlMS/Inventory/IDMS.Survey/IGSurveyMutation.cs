using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using HotChocolate.Data.Projections;
using IDMS.Survey.GqlTypes.LocalModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using IDMS.Models.Shared;
using IDMS.Inventory.GqlTypes.LocalModel;


namespace IDMS.Survey.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class IGSurveyMutation
    {
        //[Authorize]
        public async Task<Record> AddInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            InGateSurveyRequest inGateSurveyRequest, in_gate inGateRequest)
        {
            bool needAddCleaning = false;
            int retval = 0;
            List<string> retGuids = new List<string>();
            Record record = new();

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //ingate_survey handling
                in_gate_survey ingateSurvey = new();
                mapper.Map(inGateSurveyRequest, ingateSurvey);

                ingateSurvey.guid = Util.GenerateGUID();
                ingateSurvey.create_by = user;
                ingateSurvey.create_dt = currentDateTime;
                await context.in_gate_survey.AddAsync(ingateSurvey);

                //ingate handling
                var ingate = await context.in_gate.Where(i => i.guid == inGateRequest.guid).FirstOrDefaultAsync();
                if (ingate != null)
                {
                    ingate.remarks = inGateRequest.remarks;
                    ingate.vehicle_no = inGateRequest.vehicle_no;
                    ingate.driver_name = inGateRequest.driver_name;
                    ingate.haulier = inGateRequest.haulier;
                    //yet to survey --> pending
                    ingate.eir_status_cv = EirStatus.PENDING;
                    ingate.update_by = user;
                    ingate.update_dt = currentDateTime;
                }

                if (inGateRequest.tank == null || string.IsNullOrEmpty(inGateRequest.tank.guid))
                    throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "ERROR"));

                //Tank handling
                var tank = inGateRequest.tank;
                storing_order_tank? sot = await context.storing_order_tank.Include(t => t.storing_order).Include(t => t.tariff_cleaning)
                    .Where(t => t.guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();

                if (sot == null || string.IsNullOrEmpty(sot.tank_no))
                    throw new GraphQLException(new Error("Storing order tank not found.", "NOT FOUND"));

                sot.unit_type_guid = tank.unit_type_guid;
                sot.owner_guid = tank.owner_guid;
                sot.last_release_dt = tank.last_release_dt;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                //if (tank.purpose_steam ?? false)
                //    sot.tank_status_cv = TankMovementStatus.STEAM;
                //else if (tank.purpose_cleaning ?? false)
                //    sot.tank_status_cv = TankMovementStatus.CLEANING;
                //else if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                //    sot.tank_status_cv = TankMovementStatus.REPAIR;
                //else
                //    sot.tank_status_cv = TankMovementStatus.STORAGE;

                //Add the newly created guid into list for return
                retGuids.Add(ingateSurvey.guid);

                ////Add steaming by auto
                //if (tank.purpose_steam ?? false)
                //    await AddSteaming(context, sot, ingate.create_dt);

                ////Add cleaning by auto
                //if (tank.purpose_cleaning ?? false)
                //    await AddCleaning(context, sot, ingate.create_dt, ingateSurvey.tank_comp_guid);

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_INGATE;
                string evtName = EventName.NEW_INGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);


                //Tank info handling
                await AddTankInfo(context, mapper, user, currentDateTime, sot, ingateSurvey, inGateRequest.yard_cv ?? "");

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
        public async Task<int> UpdateInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            InGateSurveyRequest inGateSurveyRequest, in_gate inGateRequest)
        {
            int retval = 0;

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                in_gate_survey? ingateSurvey = await context.in_gate_survey.Where(i => i.guid == inGateSurveyRequest.guid &&
                                                                                 (i.delete_dt == null || i.delete_dt == 0)).FirstOrDefaultAsync();
                if (ingateSurvey == null)
                    throw new GraphQLException(new Error("Ingate survey not found.", "NOT_FOUND"));

                if (ingateSurvey.in_gate_guid == null)
                    throw new GraphQLException(new Error("Ingate guid cant be null.", "Error"));


                mapper.Map(inGateSurveyRequest, ingateSurvey);

                if (string.IsNullOrEmpty(inGateSurveyRequest.guid))
                {
                    ingateSurvey.guid = Util.GenerateGUID();
                    ingateSurvey.create_by = user;
                    ingateSurvey.create_dt = currentDateTime;
                    context.in_gate_survey.Add(ingateSurvey);
                }
                else
                {
                    ingateSurvey.update_by = user;
                    ingateSurvey.update_dt = currentDateTime;
                }

                //var igWithTank = inGateRequest;
                var ingate = await context.in_gate.Where(i => i.guid == inGateRequest.guid).FirstOrDefaultAsync();
                if (ingate != null)
                {
                    ingate.remarks = inGateRequest.remarks;
                    ingate.vehicle_no = inGateRequest.vehicle_no;
                    ingate.driver_name = inGateRequest.driver_name;
                    ingate.haulier = inGateRequest.haulier;
                    //yet to survey --> pending
                    ingate.eir_status_cv = string.IsNullOrEmpty(inGateRequest.eir_status_cv) ? EirStatus.PENDING : inGateRequest.eir_status_cv; //EirStatus.PENDING;
                    ingate.update_by = user;
                    ingate.update_dt = currentDateTime;
                }

                var tank = inGateRequest.tank;
                storing_order_tank sot = new storing_order_tank() { guid = tank.guid };
                context.storing_order_tank.Attach(sot);
                sot.unit_type_guid = tank.unit_type_guid;
                sot.owner_guid = tank.owner_guid;
                sot.tank_no = string.IsNullOrEmpty(tank.tank_no) ? throw new GraphQLException(new Error("Tank no cannot bu null or empty.", "Error")) : tank.tank_no;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                //will not happend tank movement status changes
                //if (tank.purpose_steam ?? false)
                //    sot.tank_status_cv = TankMovementStatus.STEAM;
                //else if (tank.purpose_cleaning ?? false)
                //    sot.tank_status_cv = TankMovementStatus.CLEANING;
                //else if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                //    sot.tank_status_cv = TankMovementStatus.REPAIR;
                //else
                //    sot.tank_status_cv = TankMovementStatus.STORAGE;

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_INGATE;
                string evtName = EventName.NEW_INGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);


                //Tank info handling
                await AddTankInfo(context, mapper, user, currentDateTime, sot, ingateSurvey, inGateRequest.yard_cv ?? "");
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string IGSurvey_guid)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var query = context.in_gate_survey.Where(i => i.guid == $"{IGSurvey_guid}");
                if (query.Any())
                {
                    var delInGateSurvey = query.FirstOrDefault();

                    delInGateSurvey.delete_dt = currentDateTime;
                    delInGateSurvey.update_by = user;
                    delInGateSurvey.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        private async Task<int> PublishIngateSurveyOld(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();


                var ingate = new in_gate() { guid = InGate_guid };
                context.Attach(ingate);

                ingate.eir_status_cv = EirStatus.PUBLISHED;
                ingate.update_by = user;
                ingate.publish_by = user;
                ingate.update_dt = currentDateTime;
                ingate.publish_dt = currentDateTime;

                retval = await context.SaveChangesAsync(true);

                //TODO: Pending implementation of publish pdf -------------------------------
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> PublishIngateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, in_gate inGateRequest)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(inGateRequest.guid))
                    throw new GraphQLException(new Error("Ingate Guid cannot be null or empty.", "ERROR"));

                if (string.IsNullOrEmpty(inGateRequest.so_tank_guid))
                    throw new GraphQLException(new Error("Storing Order Tank Guid cannot be null or empty.", "ERROR"));

                if (string.IsNullOrEmpty(inGateRequest?.in_gate_survey?.tank_comp_guid))
                    throw new GraphQLException(new Error("Tank Comp Guid cannot be null or empty.", "ERROR"));


                var ingate = new in_gate() { guid = inGateRequest.guid };
                context.in_gate.Attach(ingate);
                ingate.eir_status_cv = EirStatus.PUBLISHED;
                ingate.update_by = user;
                ingate.publish_by = user;
                ingate.update_dt = currentDateTime;
                ingate.publish_dt = currentDateTime;

                //var sot = inGateRequest.tank;
                storing_order_tank? sot = await context.storing_order_tank.Include(t => t.storing_order).Include(t => t.tariff_cleaning)
                                            .Where(t => t.guid == inGateRequest.so_tank_guid && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();

                if (sot.purpose_steam ?? false)
                    sot.tank_status_cv = TankMovementStatus.STEAM;
                else if (sot.purpose_cleaning ?? false)
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                else if (!string.IsNullOrEmpty(sot.purpose_repair_cv))
                    sot.tank_status_cv = TankMovementStatus.REPAIR;
                else
                    sot.tank_status_cv = TankMovementStatus.STORAGE;

                //Add steaming by auto
                if (sot?.purpose_steam ?? false)
                    await AddSteaming(context, sot, inGateRequest.create_dt);

                //Add cleaning by auto
                if (sot?.purpose_cleaning ?? false)
                    await AddCleaning(context, sot, inGateRequest.create_dt, inGateRequest?.in_gate_survey?.tank_comp_guid);

                retval = await context.SaveChangesAsync(true);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        private async Task<int> AddCleaning(ApplicationInventoryDBContext context, storing_order_tank sot, long? ingate_date, string tariffBufferGuid)
        {
            int retval = 0;
            try
            {
                string user = "system";
                long currentDateTime = DateTime.Now.ToEpochTime();

                //var sot = context.storing_order_tank.Include(t => t.storing_order).Include(t => t.tariff_cleaning)
                //    .Where(t => t.guid == sot_Guid && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefault();

                var ingateCleaning = new cleaning();
                ingateCleaning.guid = Util.GenerateGUID();
                ingateCleaning.create_by = user;
                ingateCleaning.create_dt = currentDateTime;
                ingateCleaning.sot_guid = sot.guid;
                ingateCleaning.approve_dt = ingate_date;
                ingateCleaning.approve_by = user;
                ingateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                ingateCleaning.job_no = sot?.job_no;
                var customerGuid = sot?.storing_order?.customer_company_guid;
                ingateCleaning.bill_to_guid = customerGuid;

                var categoryGuid = sot?.tariff_cleaning?.cleaning_category_guid;
                var adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                               .Select(c => c.adjusted_price).FirstOrDefaultAsync();
                ingateCleaning.cleaning_cost = adjustedPrice;

                //var tariffBufferGuid = await context.Set<tariff_buffer>().Where(t => t.buffer_type.ToUpper() == baffleType.ToUpper())
                //                                    .Select(t => t.guid).FirstOrDefaultAsync();
                var bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == tariffBufferGuid)
                                                   .Select(b => b.cost).FirstOrDefaultAsync();
                ingateCleaning.buffer_cost = bufferPrice;
                ingateCleaning.est_buffer_cost = bufferPrice;
                ingateCleaning.est_cleaning_cost = adjustedPrice;

                await context.AddAsync(ingateCleaning);
                retval = 1;
                //retval = await context.SaveChangesAsync(true);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        private async Task<int> AddSteaming(ApplicationInventoryDBContext context, storing_order_tank sot, long? ingate_date)
        {
            int retval = 0;
            try
            {
                string user = "system";//GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var customerGuid = sot?.storing_order?.customer_company_guid;
                var last_cargo_guid = sot?.last_cargo_guid;
                var last_cargo = await context.Set<tariff_cleaning>().Where(x => x.guid == last_cargo_guid).Select(x => x.cargo).FirstOrDefaultAsync();
                var description = $"Steaming/Heating cost of ({last_cargo})";
                var repTemp = sot?.required_temp;

                bool isExclusive = false;
                //First check whether have exclusive package cost
                var result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                            .Join(context.Set<steaming_exclusive>(), p => p.steaming_exclusive_guid, t => t.guid, (p, t) => new { p, t })
                            .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp && joined.t.tariff_cleaning_guid == last_cargo_guid)
                            .Select(joined => new SteamingPackageResult
                            {
                                cost = joined.p.cost,  // Selecting cost
                                labour = joined.p.labour, // Selecting labour
                                steaming_guid = joined.p.steaming_exclusive_guid
                            })
                            .FirstOrDefaultAsync();

                //If no exclusive found
                if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                {
                    //we check the general package cost
                    result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                                .Join(context.Set<tariff_steaming>(), p => p.tariff_steaming_guid, t => t.guid, (p, t) => new { p, t })
                                .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp)
                                .Select(joined => new SteamingPackageResult
                                {
                                    cost = joined.p.cost,  // Selecting cost
                                    labour = joined.p.labour, // Selecting labour
                                    steaming_guid = joined.p.tariff_steaming_guid
                                })
                                .FirstOrDefaultAsync();
                }
                else //the customer have exclusive package cost
                    isExclusive = true;

                if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                    throw new GraphQLException(new Error($"Package steaming not found", "ERROR"));

                var defQty = 1;
                var totalCost = defQty * (result?.cost ?? 0) + (result?.labour ?? 0);

                //steaming handling
                var newSteam = new steaming();
                newSteam.guid = Util.GenerateGUID();
                newSteam.create_by = user;
                newSteam.create_dt = currentDateTime;
                newSteam.sot_guid = sot.guid;
                newSteam.status_cv = CurrentServiceStatus.APPROVED;
                newSteam.bill_to_guid = customerGuid;
                newSteam.job_no = sot?.job_no;
                newSteam.est_cost = totalCost;
                newSteam.total_cost = totalCost;
                newSteam.approve_dt = ingate_date;
                newSteam.approve_by = user;
                newSteam.estimate_by = user;
                newSteam.estimate_dt = ingate_date;
                await context.AddAsync(newSteam);

                //steaming_part handling
                var steamingPart = new steaming_part();
                steamingPart.guid = Util.GenerateGUID();
                steamingPart.create_by = user;
                steamingPart.create_dt = currentDateTime;
                steamingPart.steaming_guid = newSteam.guid;
                if (isExclusive)
                    steamingPart.steaming_exclusive_guid = result?.steaming_guid;
                else
                    steamingPart.tariff_steaming_guid = result?.steaming_guid;
                steamingPart.description = description;
                steamingPart.quantity = defQty;
                steamingPart.labour = result?.labour;
                steamingPart.cost = result?.cost;
                steamingPart.approve_part = true;
                steamingPart.approve_qty = defQty;
                steamingPart.approve_cost = result?.cost;
                steamingPart.approve_labour = result?.labour;
                await context.AddAsync(steamingPart);

                retval = 1;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        private async Task AddTankInfo(ApplicationInventoryDBContext context, IMapper mapper, string user, long currentDateTime,
                                        storing_order_tank sot, in_gate_survey ingateSurvey, string yard)
        {
            //populate the tank_info details
            var tankInfo = new tank_info()
            {
                tank_no = sot.tank_no,
                owner_guid = sot.owner_guid,
                unit_type_guid = sot.unit_type_guid,
                last_release_dt = sot.last_release_dt,
                tank_comp_guid = ingateSurvey.tank_comp_guid,
                manufacturer_cv = ingateSurvey.manufacturer_cv,
                dom_dt = ingateSurvey.dom_dt,
                cladding_cv = ingateSurvey.cladding_cv,
                max_weight_cv = ingateSurvey.max_weight_cv,
                height_cv = ingateSurvey.height_cv,
                walkway_cv = ingateSurvey.walkway_cv,
                capacity = ingateSurvey.capacity,
                tare_weight = ingateSurvey.tare_weight,
                last_test_cv = ingateSurvey.last_test_cv,
                next_test_cv = ingateSurvey.next_test_cv,
                test_dt = ingateSurvey.test_dt,
                test_class_cv = ingateSurvey.test_class_cv,
                yard_cv = yard,
                //last_notify_dt = null,
            };

            await GqlUtils.UpdateTankInfo(mapper, context, user, currentDateTime, tankInfo);
        }

        //public async Task<int> UpdateTankInfo([Service] IMapper mapper, ApplicationInventoryDBContext context, string user, long currentDateTime, tank_info tankInfo)
        //{
        //    try
        //    {
        //        var tf = await context.tank_info.Where(t => t.tank_no == tankInfo.tank_no).FirstOrDefaultAsync();
        //        if (tf == null)
        //        {
        //            tf = tankInfo;
        //            tf.guid = Util.GenerateGUID();
        //            tf.create_by = user;
        //            tf.create_dt = currentDateTime;
        //            await context.AddAsync(tf);
        //        }
        //        else
        //        {
        //            mapper.Map(tankInfo, tf);
        //            tf.update_by = user;
        //            tf.update_dt = currentDateTime;
        //        }

        //        var res = await context.SaveChangesAsync();
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}
    }
}
