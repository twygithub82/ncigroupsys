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
using Newtonsoft.Json;

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
            bool needPublish = false;
            string currentTankMovement = "";

            string retResidueGuid = "";
            int retResiueVal;

            int retval = 0;
            List<string> retGuids = new List<string>();
            Record record = new();

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
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
                    ingateSurvey.update_by = user;
                    ingateSurvey.update_dt = currentDateTime;
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

                        //-------------------------------------------------------
                        if (!string.IsNullOrEmpty(inGateSurveyRequest?.action ?? "")
                            && inGateSurveyRequest.action.EqualsIgnore(EirStatus.PUBLISHED))
                        {
                            needPublish = true;
                            ingate.eir_status_cv = EirStatus.PUBLISHED;
                            ingate.publish_by = user;
                            ingate.publish_dt = currentDateTime;
                        }
                        //--------------------------------------------------------
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

                    //----------------------------------------------------------------------
                    if (!string.IsNullOrEmpty(inGateSurveyRequest?.action ?? "")
                         && inGateSurveyRequest.action.EqualsIgnore(EirStatus.PUBLISHED))
                    {
                        needPublish = true;
                        if (sot.purpose_steam ?? false)
                        {
                            sot.tank_status_cv = TankMovementStatus.STEAM;
                            await AddSteaming(context, sot, ingate.create_dt);
                            currentTankMovement = TankMovementStatus.STEAM;
                        }
                        else if (sot.purpose_cleaning ?? false)
                        {
                            sot.tank_status_cv = TankMovementStatus.CLEANING;
                            await AddCleaning(context, sot, ingate.create_dt, ingateSurvey.tank_comp_guid);
                            currentTankMovement = TankMovementStatus.CLEANING;
                        }
                        else if (!string.IsNullOrEmpty(sot.purpose_repair_cv))
                        {
                            sot.tank_status_cv = TankMovementStatus.REPAIR;
                            currentTankMovement = TankMovementStatus.REPAIR;
                        }
                        else
                        {
                            sot.tank_status_cv = TankMovementStatus.STORAGE;
                            currentTankMovement = TankMovementStatus.STORAGE;
                        }

                        //Newly added logic
                        if ((!currentTankMovement.EqualsIgnore(TankMovementStatus.STEAM))
                            && (ingateSurvey.residue != null && ingateSurvey.residue > 0.0))
                        {
                          (retResiueVal, retResidueGuid) = await AddResidue(context, sot, ingate.create_dt, ingateSurvey.residue);
                        }
                    }
                    //----------------------------------------------------------------------------

                    //Add the newly created guid into list for return
                    retGuids.Add(ingateSurvey.guid);

                    retval = await context.SaveChangesAsync();

                    //Tank info handling
                    await AddTankInfo(context, mapper, user, currentDateTime, sot, ingateSurvey, inGateRequest.yard_cv ?? "", inGateRequest.eir_no ?? "");

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();

                    //Notification Handling
                    if (needPublish)
                    {
                        string evtId = EventId.PUBLISH_EIR;
                        await NotificationHandling(context, config, evtId);
                    }
                    //Bundle the retVal and retGuid return as record object
                    record = new Record() { affected = retval, guid = retGuids, residue_guid = retResidueGuid };
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();

                    throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
                }
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
                    throw new GraphQLException(new Error("Ingate survey object cannot be null or empty.", "ERROR"));

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
                //string evtId = EventId.NEW_INGATE;
                //string evtName = EventName.NEW_INGATE;
                //GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);


                //Tank info handling
                await AddTankInfo(context, mapper, user, currentDateTime, sot, ingateSurvey, inGateRequest.yard_cv ?? "", inGateRequest.eir_no ?? "");
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


        //private async Task<int> PublishIngateSurveyOld(ApplicationInventoryDBContext context, [Service] IConfiguration config,
        //        [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        //{
        //    int retval = 0;
        //    try
        //    {
        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        //string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();


        //        var ingate = new in_gate() { guid = InGate_guid };
        //        context.Attach(ingate);

        //        ingate.eir_status_cv = EirStatus.PUBLISHED;
        //        ingate.update_by = user;
        //        ingate.publish_by = user;
        //        ingate.update_dt = currentDateTime;
        //        ingate.publish_dt = currentDateTime;

        //        retval = await context.SaveChangesAsync(true);

        //        //TODO: Pending implementation of publish pdf -------------------------------
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //    return retval;
        //}

        public async Task<Record> PublishIngateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, in_gate inGateRequest)
        {
            int retResidueVal;
            string retResidueGuid = "";
            int retval = 0;
            string currentTankMovement = "";
            Record record = new();

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
                {
                    sot.tank_status_cv = TankMovementStatus.STEAM;
                    currentTankMovement = TankMovementStatus.STEAM;
                }
                else if (sot.purpose_cleaning ?? false)
                {
                    currentTankMovement = TankMovementStatus.CLEANING;
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                }
                else if (!string.IsNullOrEmpty(sot.purpose_repair_cv))
                {
                    currentTankMovement = TankMovementStatus.REPAIR;
                    sot.tank_status_cv = TankMovementStatus.REPAIR;
                }
                else
                {
                    currentTankMovement = TankMovementStatus.STORAGE;
                    sot.tank_status_cv = TankMovementStatus.STORAGE;
                }
                  
                //Add steaming by auto
                if (sot?.purpose_steam ?? false)
                    await AddSteaming(context, sot, inGateRequest.create_dt);

                //Add cleaning by auto
                if (sot?.purpose_cleaning ?? false)
                    await AddCleaning(context, sot, inGateRequest.create_dt, inGateRequest?.in_gate_survey?.tank_comp_guid);

                //Newly added logic
                if ((!currentTankMovement.EqualsIgnore(TankMovementStatus.STEAM))
                    && (inGateRequest?.in_gate_survey?.residue != null && inGateRequest?.in_gate_survey?.residue > 0.0))
                {
                    (retResidueVal, retResidueGuid) = await AddResidue(context, sot, ingate.create_dt, inGateRequest?.in_gate_survey?.residue);
                }

                retval = await context.SaveChangesAsync(true);

                //Bundle the retVal and retGuid return as record object
                record = new Record() { affected = retval, residue_guid = retResidueGuid };

                //Notification Handling
                string evtId = EventId.PUBLISH_EIR;
                await NotificationHandling(context, config, evtId);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return record;
        }

        private async Task<int> AddCleaning(ApplicationInventoryDBContext context, storing_order_tank sot, long? ingate_date, string tariffBufferGuid)
        {
            int retval = 0;
            try
            {
                string user = "system";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var ingateCleaning = new cleaning();
                ingateCleaning.guid = Util.GenerateGUID();
                ingateCleaning.create_by = user;
                ingateCleaning.create_dt = currentDateTime;
                ingateCleaning.update_by = user;
                ingateCleaning.update_dt = currentDateTime;
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

                //Added for later use
                var unit_type_guid = sot?.unit_type_guid;
                var isFlatRate = await context.Set<tank>().Where(t => t.guid == unit_type_guid).Select(t => t.flat_rate).FirstOrDefaultAsync();

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
                //var totalCost = defQty * (result?.cost ?? 0) + (result?.labour ?? 0);

                //steaming handling
                var newSteam = new steaming();
                newSteam.guid = Util.GenerateGUID();
                newSteam.create_by = user;
                newSteam.create_dt = currentDateTime;
                newSteam.update_by = user;
                newSteam.update_dt = currentDateTime;
                newSteam.sot_guid = sot.guid;
                newSteam.status_cv = CurrentServiceStatus.APPROVED;
                newSteam.bill_to_guid = customerGuid;
                newSteam.job_no = sot?.job_no;

                newSteam.approve_dt = ingate_date;
                newSteam.approve_by = user;
                newSteam.estimate_by = user;
                newSteam.estimate_dt = ingate_date;

                var cost = 0.0;
                var rate = 0.0;
                if (isFlatRate ?? false)
                {
                    cost = result?.cost ?? 0.0;
                    rate = result?.labour ?? 0.0; //result?.cost ?? 0.0;
                    newSteam.total_hour = 1.0;
                    newSteam.est_hour = 1.0;
                }
                else
                {
                    cost = result?.labour ?? 0.0;
                    rate = result?.labour ?? 0.0;
                    newSteam.est_hour = 1.0;
                    //if hourly_rate --> total_hour updated after completed
                }
                //Added for later use
                newSteam.rate = rate;
                newSteam.est_cost = cost;
                newSteam.total_cost = cost;
                newSteam.flat_rate = isFlatRate;
                await context.AddAsync(newSteam);

                //steaming_part handling
                var steamingPart = new steaming_part();
                steamingPart.guid = Util.GenerateGUID();
                steamingPart.create_by = user;
                steamingPart.create_dt = currentDateTime;
                steamingPart.update_by = user;
                steamingPart.update_dt = currentDateTime;
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

        private async Task<(int, string)> AddResidue(ApplicationInventoryDBContext context, storing_order_tank sot, long? ingate_date, float? residueQty)
        {
            int retval = 0;
            string retGuid = "";
            try
            {
                string desc = "Per Kg";
                string user = "system";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var residueDis = new residue();
                residueDis.guid = Util.GenerateGUID();
                residueDis.create_by = user;
                residueDis.create_dt = currentDateTime;
                residueDis.update_by = user;
                residueDis.update_dt = currentDateTime;
                residueDis.sot_guid = sot.guid;
                residueDis.approve_dt = ingate_date;
                residueDis.approve_by = user;
                residueDis.status_cv = CurrentServiceStatus.PENDING;
                residueDis.job_no = sot?.job_no;
                var customerGuid = sot?.storing_order?.customer_company_guid;
                residueDis.bill_to_guid = customerGuid;

                //TODO::
                var tariffResiudeGuid = await context.Set<tariff_residue>().Where(t => t.description == desc).Select(t => t.guid).FirstOrDefaultAsync();
                if (string.IsNullOrEmpty(tariffResiudeGuid))
                    throw new GraphQLException(new Error($"Tariff residue GUID not found", "ERROR"));


                var cost = await context.Set<package_residue>().Where(c => c.customer_company_guid == customerGuid && c.tariff_residue_guid == tariffResiudeGuid)
                               .Select(c => c.cost).FirstOrDefaultAsync();
                residueDis.total_cost = cost;
                residueDis.est_cost = cost;
                await context.residue.AddAsync(residueDis);

                var residueParts = new residue_part();
                residueParts.guid = Util.GenerateGUID();
                residueParts.create_by = user;
                residueParts.create_dt = currentDateTime;
                residueParts.update_by = user;
                residueParts.update_dt = currentDateTime;
                residueParts.residue_guid = residueDis.guid;
                residueParts.tariff_residue_guid = tariffResiudeGuid;
                residueParts.description = desc;
                residueParts.quantity = (int?)residueQty;
                residueParts.qty_unit_type_cv = "KG";
                residueParts.cost = cost;
                await context.Set<residue_part>().AddAsync(residueParts);
               

                retval = 1;
                retGuid = residueDis.guid;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return (retval, retGuid);
        }

        private async Task AddTankInfo(ApplicationInventoryDBContext context, IMapper mapper, string user, long currentDateTime,
                                        storing_order_tank sot, in_gate_survey ingateSurvey, string yard, string eirNo)
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
                last_eir_no = eirNo,
            };

            //await GqlUtils.TankInfoHandling(mapper, context, user, currentDateTime, tankInfo);


            try
            {
                var tf = await context.tank_info.Where(t => t.tank_no == tankInfo.tank_no && t.delete_dt == null).FirstOrDefaultAsync();
                if (tf == null)
                {
                    tf = tankInfo;
                    tf.guid = Util.GenerateGUID();
                    tf.create_by = user;
                    tf.create_dt = currentDateTime;
                    tf.update_by = user;
                    tf.update_dt = currentDateTime;
                    await context.AddAsync(tf);
                }
                else
                {
                    //tf.storing_order_tank = null;
                    mapper.Map(tankInfo, tf);
                    //already ignore the guid, created_by, created_dt in program.config
                    tf.update_by = user;
                    tf.update_dt = currentDateTime;
                }

                var res = await context.SaveChangesAsync();
                //return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<bool> NotificationHandling(ApplicationInventoryDBContext context, [Service] IConfiguration config, string eventId)
        {
            string evtId = eventId;
            string evtName = SotNotificationType.onPendingProcess_GateIn_Survey.ToString();
            int count = 1;
            int gateInCount_Day = await GqlUtils.GetGateCountOfDay(context, "IN");
            int pendingSurveyCount = await GqlUtils.GetGateCountOfDay(context, "IN");
            var pendingProcessCount = await GqlUtils.GetSOTPendingProcessCount(context);
            var payload = new
            {
                pendingProcessCount,
                Gate_In_Count = gateInCount_Day,
                Pending_Ingate_Survey_Count = pendingSurveyCount
            };

            GqlUtils.SendGlobalNotification1(config, SotNotificationTopic.EIR_PUBLISHED, evtId, evtName, count, JsonConvert.SerializeObject(payload));
            return true;
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
