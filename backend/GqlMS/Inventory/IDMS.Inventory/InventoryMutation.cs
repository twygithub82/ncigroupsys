using HotChocolate;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using IDMS.Inventory.GqlTypes.LocalModel;
using IDMS.Models;
using Newtonsoft.Json;
using System.Text;
using IDMS.Models.Service;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Shared;
using IDMS.Models.Inventory;
using IDMS.Models.Notification;
using System.Data.SqlTypes;
using System.IO;
using Microsoft.EntityFrameworkCore.Diagnostics;
using IDMS.Models.Billing;
using System.Data.Entity.ModelConfiguration.Conventions;
using IDMS.Models.Package;
using Microsoft.Extensions.Primitives;
using IDMS.Models.Tariff;
using AutoMapper;

namespace IDMS.Inventory.GqlTypes
{
    public class InventoryMutation
    {
        public async Task<int> UpdateTankPurpose(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, TankPurposeRequest tankPurpose)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in tankPurpose.purpose_changes)
                {
                    switch (item.type)
                    {
                        case PurposeType.CLEAN:
                            if (PurposeAction.ADD.EqualsIgnore(item.action))
                                await GqlUtils.AddCleaning1(context, config, user, currentDateTime, tankPurpose.storing_order_tank, tankPurpose.in_gate_dt, tankPurpose.tank_comp_guid, tankPurpose.job_no);
                            else if (PurposeAction.REMOVE.EqualsIgnore(item.action))
                            {
                                if (string.IsNullOrEmpty(tankPurpose.guid))
                                    throw new GraphQLException(new Error("Process guid cannot be null or empty.", "ERROR"));

                                await RemoveCleaning(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank, tankPurpose.residue_request ?? null);
                            }
                            break;
                        case PurposeType.STEAM:
                            if (PurposeAction.ADD.EqualsIgnore(item.action))
                                await GqlUtils.AddSteaming1(context, config, user, currentDateTime, tankPurpose.storing_order_tank, tankPurpose.in_gate_dt, tankPurpose.job_no);
                            else if (PurposeAction.REMOVE.EqualsIgnore(item.action))
                            {
                                if (string.IsNullOrEmpty(tankPurpose.guid))
                                    throw new GraphQLException(new Error("Process guid cannot be null or empty.", "ERROR"));

                                await RemoveSteaming(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank);
                            }
                            break;
                        case PurposeType.REPAIR:
                            if (PurposeAction.ADD.EqualsIgnore(item.action))
                                await GqlUtils.AddRepair(context, config, user, currentDateTime, tankPurpose.storing_order_tank);
                            else if (PurposeAction.REMOVE.EqualsIgnore(item.action))
                            {
                                if (string.IsNullOrEmpty(tankPurpose.guid))
                                    throw new GraphQLException(new Error("Process guid cannot be null or empty.", "ERROR"));

                                await RemoveRepair(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank, tankPurpose.residue_request ?? null);
                            }
                            break;
                        case PurposeType.STORAGE:
                            if (PurposeAction.ADD.EqualsIgnore(item.action))
                                await GqlUtils.AddStorage(context, config, user, currentDateTime, tankPurpose.storing_order_tank);
                            else if (PurposeAction.REMOVE.EqualsIgnore(item.action))
                            {
                                if (string.IsNullOrEmpty(tankPurpose.guid))
                                    throw new GraphQLException(new Error("Process guid cannot be null or empty.", "ERROR"));

                                await RemoveStorage(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank);
                            }
                            break;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

            return 1;
        }
        public async Task<int> AddSurveyDetail(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, survey_detail surveyDetail, PeriodicTestRequest? periodicTest)
        {
            try
            {
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newSuyDetail = new survey_detail();
                newSuyDetail.guid = Util.GenerateGUID();
                newSuyDetail.create_by = user;
                newSuyDetail.create_dt = currentDateTime;
                newSuyDetail.update_by = user;
                newSuyDetail.update_dt = currentDateTime;
                newSuyDetail.sot_guid = surveyDetail.sot_guid;
                newSuyDetail.status_cv = surveyDetail.status_cv;
                newSuyDetail.remarks = surveyDetail.remarks;
                newSuyDetail.survey_dt = surveyDetail.survey_dt;
                newSuyDetail.test_class_cv = surveyDetail.test_class_cv;
                newSuyDetail.survey_type_cv = surveyDetail.survey_type_cv;
                newSuyDetail.test_type_cv = surveyDetail.test_type_cv;

                if (surveyDetail.survey_type_cv.EqualsIgnore("PERIODIC_TEST"))
                {
                    if (periodicTest != null)
                    {
                        //newSuyDetail.test_class_cv = surveyDetail.test_class_cv;
                        if (surveyDetail.status_cv.EqualsIgnore(SurveyStatus.ACCEPT))
                        {
                            //Update Tank Info
                            var tankInfo = await context.tank_info.Where(t => t.tank_no == periodicTest.tank_no & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                            if (tankInfo == null)
                                throw new GraphQLException(new Error($"tank info not found.", "ERROR"));

                            tankInfo.last_test_cv = periodicTest.last_test_cv;
                            tankInfo.next_test_cv = periodicTest.next_test_cv;
                            tankInfo.test_class_cv = surveyDetail.test_class_cv;
                            tankInfo.test_dt = periodicTest.test_dt; //newSuyDetail.survey_dt;
                            tankInfo.update_by = user;
                            tankInfo.update_dt = currentDateTime;
                        }
                    }
                }

                await context.AddAsync(newSuyDetail);
                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }
        public async Task<int> UpdateSurveyDetail(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, survey_detail surveyDetail, PeriodicTestRequest? periodicTest)
        {
            try
            {
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var updateSuyDetail = new survey_detail() { guid = surveyDetail.guid };
                context.Attach(updateSuyDetail);
                updateSuyDetail.update_by = user;
                updateSuyDetail.update_dt = currentDateTime;

                //updateSuyDetail.customer_company_guid = surveyDetail.customer_company_guid;
                updateSuyDetail.sot_guid = surveyDetail.sot_guid;
                updateSuyDetail.status_cv = surveyDetail.status_cv;
                updateSuyDetail.remarks = surveyDetail.remarks;
                updateSuyDetail.survey_type_cv = surveyDetail.survey_type_cv;
                updateSuyDetail.test_class_cv = surveyDetail.test_class_cv;
                updateSuyDetail.survey_dt = surveyDetail.survey_dt;

                if (surveyDetail.survey_type_cv.EqualsIgnore("PERIODIC_TEST"))
                {
                    if (periodicTest != null)
                    {
                        //Update Tank Info
                        var tankInfo = await context.tank_info.Where(t => t.tank_no == periodicTest.tank_no & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                        if (tankInfo == null)
                            throw new GraphQLException(new Error($"tank info not found.", "ERROR"));

                        tankInfo.test_dt = periodicTest.test_dt; //surveyDetail.survey_dt;
                        tankInfo.update_by = user;
                        tankInfo.update_dt = currentDateTime;
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

        public async Task<int> DeleteSurveyDetail(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, string deletedGuid, survey_detail surveyDetail, PeriodicTestRequest? periodicTest)
        {
            try
            {
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var deleteSuyDetail = new survey_detail() { guid = deletedGuid };
                context.Attach(deleteSuyDetail);
                deleteSuyDetail.update_by = user;
                deleteSuyDetail.update_dt = currentDateTime;
                deleteSuyDetail.delete_dt = currentDateTime;

                if (surveyDetail.survey_type_cv.EqualsIgnore("PERIODIC_TEST"))
                {
                    if (periodicTest != null)
                    {
                        //Update Tank Info
                        var tankInfo = await context.tank_info.Where(t => t.tank_no == periodicTest.tank_no & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                        if (tankInfo == null)
                            throw new GraphQLException(new Error($"tank info not found.", "ERROR"));

                        tankInfo.test_class_cv = surveyDetail.test_class_cv;
                        tankInfo.test_dt = periodicTest.test_dt;
                        tankInfo.last_test_cv = periodicTest.last_test_cv;
                        tankInfo.next_test_cv = periodicTest.next_test_cv;
                        tankInfo.update_by = user;
                        tankInfo.update_dt = currentDateTime;
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

        public async Task<int> UpdateTransfer(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, transfer transfer)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(transfer.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null", "ERROR"));

                if (string.IsNullOrEmpty(transfer.action))
                {
                    if (string.IsNullOrEmpty(transfer.guid))
                    {
                        //need to add new transfer record
                        transfer newTransfer = new transfer();
                        newTransfer.guid = Util.GenerateGUID();
                        newTransfer.create_by = user;
                        newTransfer.create_dt = currentDateTime;
                        newTransfer.sot_guid = transfer.sot_guid;
                        newTransfer.location_from_cv = transfer.location_from_cv;
                        newTransfer.location_to_cv = transfer.location_to_cv;
                        newTransfer.transfer_out_dt = currentDateTime;
                        newTransfer.haulier = transfer.haulier;
                        newTransfer.vehicle_no = transfer.vehicle_no;
                        newTransfer.driver_name = transfer.driver_name;
                        newTransfer.remarks = transfer.remarks;
                        await context.transfer.AddAsync(newTransfer);
                    }
                    else
                    {
                        transfer updateTransfer = new transfer()
                        {
                            guid = transfer.guid
                        };
                        context.Attach(updateTransfer);
                        updateTransfer.sot_guid = transfer.sot_guid;
                        updateTransfer.update_by = user;
                        updateTransfer.update_dt = currentDateTime;
                        updateTransfer.location_from_cv = transfer.location_from_cv;
                        updateTransfer.location_to_cv = transfer.location_to_cv;
                        updateTransfer.transfer_out_dt = transfer?.transfer_out_dt;
                        updateTransfer.transfer_in_dt = transfer?.transfer_in_dt;
                        updateTransfer.haulier = transfer?.haulier;
                        updateTransfer.driver_name = transfer?.driver_name;
                        updateTransfer.vehicle_no = transfer?.vehicle_no;
                        updateTransfer.remarks = transfer?.remarks;
                        if (transfer?.delete_dt != null)
                            transfer.delete_dt = currentDateTime;
                    }

                    //if (transfer.transfer_in_dt != null)
                    //{
                    //    if (transfer?.storing_order_tank == null || string.IsNullOrEmpty(transfer.storing_order_tank.tank_no))
                    //        throw new GraphQLException(new Error($"SOT & tank_no cannot be null", "ERROR"));

                    //    var tankInfo = await context.tank_info.Where(t => t.tank_no == transfer.storing_order_tank.tank_no).FirstOrDefaultAsync();
                    //    if (tankInfo != null)
                    //    {
                    //        tankInfo.yard_cv = transfer.location_to_cv;
                    //        tankInfo.update_by = user;
                    //        tankInfo.update_dt = currentDateTime;
                    //    }
                    //}
                }
                else
                {
                    if (transfer.action.EqualsIgnore(SOTankAction.CANCEL))
                    {
                        var updateTransfer = new transfer() { guid = transfer.guid };
                        context.transfer.Attach(updateTransfer);
                        updateTransfer.update_by = user;
                        updateTransfer.update_dt = currentDateTime;
                        updateTransfer.delete_dt = currentDateTime;

                        if (transfer.transfer_in_dt != null)
                        {
                            if (transfer?.storing_order_tank == null || string.IsNullOrEmpty(transfer.storing_order_tank.tank_no))
                                throw new GraphQLException(new Error($"SOT & tank_no cannot be null", "ERROR"));

                            var tankInfo = await context.tank_info.Where(t => t.tank_no == transfer.storing_order_tank.tank_no).FirstOrDefaultAsync();
                            if (tankInfo != null)
                            {
                                tankInfo.yard_cv = transfer.location_from_cv;
                                tankInfo.update_by = user;
                                tankInfo.update_dt = currentDateTime;
                            }
                        }
                    }
                    else if (transfer.action.EqualsIgnore(SOTankAction.ROLLBACK))
                    {
                        var updateTransfer = new transfer() { guid = transfer.guid };
                        context.transfer.Attach(updateTransfer);
                        updateTransfer.update_by = user;
                        updateTransfer.update_dt = currentDateTime;
                        updateTransfer.transfer_in_dt = null;
                        context.Entry(updateTransfer).Property(p => p.transfer_in_dt).IsModified = true;

                        if (transfer?.storing_order_tank == null || string.IsNullOrEmpty(transfer.storing_order_tank.tank_no))
                            throw new GraphQLException(new Error($"SOT & tank_no cannot be null", "ERROR"));

                        var tankInfo = await context.tank_info.Where(t => t.tank_no == transfer.storing_order_tank.tank_no).FirstOrDefaultAsync();
                        if (tankInfo != null)
                        {
                            tankInfo.yard_cv = transfer.location_from_cv;
                            tankInfo.update_by = user;
                            tankInfo.update_dt = currentDateTime;
                        }
                    }
                    else if (transfer.action.EqualsIgnore("COMPLETE"))
                    {
                        var updateTransfer = new transfer() { guid = transfer.guid };
                        context.transfer.Attach(updateTransfer);
                        updateTransfer.update_by = user;
                        updateTransfer.update_dt = currentDateTime;
                        updateTransfer.transfer_in_dt = currentDateTime;


                        //if (transfer.transfer_in_dt != null)
                        //{
                        if (transfer?.storing_order_tank == null || string.IsNullOrEmpty(transfer.storing_order_tank.tank_no))
                            throw new GraphQLException(new Error($"SOT & tank_no cannot be null", "ERROR"));

                        var tankInfo = await context.tank_info.Where(t => t.tank_no == transfer.storing_order_tank.tank_no).FirstOrDefaultAsync();
                        if (tankInfo != null)
                        {
                            tankInfo.yard_cv = transfer.location_to_cv;
                            tankInfo.update_by = user;
                            tankInfo.update_dt = currentDateTime;
                        }
                        //}
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

        public async Task<int> AddTank(ApplicationInventoryDBContext context, [Service] IConfiguration config,
             [Service] IHttpContextAccessor httpContextAccessor, tank newTank)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var tank = new tank();
                tank = newTank;
                tank.guid = Util.GenerateGUID();
                tank.create_by = user;
                tank.create_dt = currentDateTime;
                tank.update_by = user;
                tank.update_dt = currentDateTime;

                await context.AddAsync(tank);
                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateTank(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tank updateTank)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var tank = new tank() { guid = updateTank.guid };
                context.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.description = updateTank.description;
                tank.unit_type = updateTank.unit_type;
                tank.tariff_depot_guid = updateTank.tariff_depot_guid;
                tank.preinspect = updateTank.preinspect;
                tank.lift_on = updateTank.lift_on;
                tank.lift_off = updateTank.lift_off;
                tank.gate_in = updateTank.gate_in;
                tank.gate_out = updateTank.gate_out;
                tank.iso_format = updateTank.iso_format;
                tank.flat_rate = updateTank.flat_rate;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> DeleteTank(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string tankGuid)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var tank = new tank() { guid = tankGuid };
                context.Attach(tank);

                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.delete_dt = currentDateTime;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateJobNo(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, storing_order_tank sot)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (sot == null || string.IsNullOrEmpty(sot.guid))
                    throw new GraphQLException(new Error($"SOT object cannot be null or empty", "ERROR"));

                var tank = new storing_order_tank() { guid = sot.guid };
                context.Attach(tank);

                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.preinspect_job_no = sot.preinspect_job_no;
                tank.liftoff_job_no = sot.liftoff_job_no;
                tank.lifton_job_no = sot.lifton_job_no;

                //tank.takein_job_no = sot.takein_job_no;
                tank.job_no = sot.job_no;

                tank.release_job_no = sot.release_job_no;
                tank.job_no_remarks = sot.job_no_remarks;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateLastCargo(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, storing_order_tank sot)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (sot == null || string.IsNullOrEmpty(sot.guid))
                    throw new GraphQLException(new Error($"SOT object cannot be null or empty", "ERROR"));

                var tank = new storing_order_tank() { guid = sot.guid };
                context.Attach(tank);

                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.last_cargo_guid = sot.last_cargo_guid;
                tank.last_cargo_remarks = sot.last_cargo_remarks;

                if (sot.cleaning == null || !sot.cleaning.Any())
                    throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));

                if (sot.tariff_cleaning == null || string.IsNullOrEmpty(sot.tariff_cleaning.cleaning_category_guid))
                    throw new GraphQLException(new Error($"Cleaning category guid cannot be null or empty", "ERROR"));

                if (sot.storing_order == null || string.IsNullOrEmpty(sot.storing_order.customer_company_guid))
                    throw new GraphQLException(new Error($"Customer company guid cannot be null or empty", "ERROR"));

                var categoryGuid = sot?.tariff_cleaning?.cleaning_category_guid;
                var customerGuid = sot?.storing_order?.customer_company_guid;
                var adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                               .Select(c => c.adjusted_price).FirstOrDefaultAsync() ?? 0;

                foreach (var item in sot.cleaning)
                {
                    var clean = new cleaning() { guid = item.guid };
                    context.Attach(clean);
                    clean.update_by = user;
                    clean.update_dt = currentDateTime;
                    clean.cleaning_cost = adjustedPrice;
                    clean.est_cleaning_cost = adjustedPrice;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateCleanStatus(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, storing_order_tank sot)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (sot == null || string.IsNullOrEmpty(sot.guid))
                    throw new GraphQLException(new Error($"SOT object cannot be null or empty", "ERROR"));

                var tank = new storing_order_tank() { guid = sot.guid };
                context.Attach(tank);

                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.clean_status_cv = sot.clean_status_cv;
                tank.clean_status_remarks = sot.clean_status_remarks;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateTankSummaryDetails(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, TankSummaryRequest tankSummaryRequest)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (tankSummaryRequest.SOT != null && !string.IsNullOrEmpty(tankSummaryRequest?.SOT?.guid ?? ""))
                {
                    //SOT Handling
                    var tank = new storing_order_tank() { guid = tankSummaryRequest?.SOT?.guid };
                    context.storing_order_tank.Attach(tank);

                    //Even empty string need to update also
                    if (tankSummaryRequest?.SOT.clean_status_cv != null)
                        tank.clean_status_cv = tankSummaryRequest?.SOT.clean_status_cv;

                    if (!string.IsNullOrEmpty(tankSummaryRequest?.SOT.clean_status_remarks))
                        tank.clean_status_remarks = tankSummaryRequest?.SOT.clean_status_remarks;

                    if (!string.IsNullOrEmpty(tankSummaryRequest?.SOT?.owner_guid))
                    {
                        tank.owner_guid = tankSummaryRequest?.SOT?.owner_guid;
                        tank.update_by = user;
                        tank.update_dt = currentDateTime;
                    }
                }


                //SO Handling
                if (tankSummaryRequest.SO != null && !string.IsNullOrEmpty(tankSummaryRequest.SO.guid))
                {
                    var sOrder = new storing_order() { guid = tankSummaryRequest.SO.guid };
                    context.storing_order.Attach(sOrder);
                    if (!string.IsNullOrEmpty(tankSummaryRequest.SO.customer_company_guid))
                    {
                        sOrder.customer_company_guid = tankSummaryRequest.SO.customer_company_guid;
                        sOrder.update_by = user;
                        sOrder.update_dt = currentDateTime;
                    }
                }

                //InGate Handling
                if (tankSummaryRequest.Ingate != null && !string.IsNullOrEmpty(tankSummaryRequest.Ingate.guid ?? ""))
                {
                    var inGate = new in_gate() { guid = tankSummaryRequest.Ingate.guid };
                    context.in_gate.Attach(inGate);
                    if (!string.IsNullOrEmpty(tankSummaryRequest.Ingate.yard_cv ?? ""))
                    {
                        inGate.yard_cv = tankSummaryRequest.Ingate.yard_cv;
                        inGate.update_by = user;
                        inGate.update_dt = currentDateTime;
                    }
                }

                //InGate Survey Handling
                var igSurveyRequest = tankSummaryRequest.IngateSurvey ?? null;
                if (igSurveyRequest != null && !string.IsNullOrEmpty(igSurveyRequest?.guid ?? ""))
                {
                    var igSurvey = new in_gate_survey() { guid = igSurveyRequest?.guid };
                    context.in_gate_survey.Attach(igSurvey);
                    if (!string.IsNullOrEmpty(igSurveyRequest?.last_test_cv ?? ""))
                        igSurvey.last_test_cv = igSurveyRequest?.last_test_cv;
                    if (!string.IsNullOrEmpty(igSurveyRequest?.next_test_cv ?? ""))
                        igSurvey.next_test_cv = igSurveyRequest?.next_test_cv;
                    if (igSurveyRequest?.test_dt != 0)
                        igSurvey.test_dt = igSurveyRequest?.test_dt;
                    if (!string.IsNullOrEmpty(igSurveyRequest?.test_class_cv ?? ""))
                        igSurvey.test_class_cv = igSurveyRequest?.test_class_cv;

                    igSurvey.update_by = user;
                    igSurvey.update_dt = currentDateTime;
                }


                //Tank info Handling
                var tankInfoRequest = tankSummaryRequest.TankInfo ?? null;
                if (tankInfoRequest != null && !string.IsNullOrEmpty(tankInfoRequest?.guid ?? "") && !string.IsNullOrEmpty(tankInfoRequest?.tank_no ?? ""))
                {
                    var tankInfo = new tank_info() { guid = tankInfoRequest?.guid, tank_no = tankInfoRequest?.tank_no };
                    context.tank_info.Attach(tankInfo);
                    if (!string.IsNullOrEmpty(tankInfoRequest?.owner_guid ?? ""))
                        tankInfo.owner_guid = tankInfoRequest?.owner_guid;
                    if (!string.IsNullOrEmpty(tankInfoRequest?.last_test_cv ?? ""))
                        tankInfo.last_test_cv = tankInfoRequest?.last_test_cv;
                    if (!string.IsNullOrEmpty(tankInfoRequest?.next_test_cv ?? ""))
                        tankInfo.next_test_cv = tankInfoRequest?.next_test_cv;
                    if (igSurveyRequest?.test_dt != 0)
                        tankInfo.test_dt = tankInfoRequest?.test_dt;
                    if (!string.IsNullOrEmpty(tankInfoRequest?.test_class_cv ?? ""))
                        tankInfo.test_class_cv = tankInfoRequest?.test_class_cv;
                    if (!string.IsNullOrEmpty(tankInfoRequest?.yard_cv ?? ""))
                        tankInfo.yard_cv = tankInfoRequest?.yard_cv;

                    tankInfo.update_by = user;
                    tankInfo.update_dt = currentDateTime;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateTankDetails(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, TankDetailRequest tankDetailRequest)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (tankDetailRequest != null)
                {
                    //SOT Handling
                    if (!string.IsNullOrEmpty(tankDetailRequest?.SOT?.guid ?? ""))
                    {
                        if (string.IsNullOrEmpty(tankDetailRequest?.SOT?.unit_type_guid ?? ""))
                            throw new GraphQLException(new Error($"unit_type_guid cannot be null or empty", "ERROR"));

                        var tank = new storing_order_tank() { guid = tankDetailRequest?.SOT?.guid };
                        context.storing_order_tank.Attach(tank);
                        var unit_type_guid = tankDetailRequest?.SOT?.unit_type_guid;
                        tank.unit_type_guid = unit_type_guid;
                        tank.update_by = user;
                        tank.update_dt = currentDateTime;

                        //affect steaming, unit_type changes                        
                        var isFlatRate = await context.Set<tank>().Where(t => t.guid == unit_type_guid).Select(t => t.flat_rate).FirstOrDefaultAsync();
                        if (isFlatRate == null)
                            throw new GraphQLException(new Error($"The expected FlatRate cannot be found", "ERROR"));

                        foreach (var item in tankDetailRequest?.Steaming ?? Enumerable.Empty<Steaming>())
                        {
                            var updateSteaming = new steaming() { guid = item.guid };
                            context.steaming.Attach(updateSteaming);
                            updateSteaming.flat_rate = isFlatRate;
                            updateSteaming.update_by = user;
                            updateSteaming.update_dt = currentDateTime;

                            if (isFlatRate ?? false)
                            {
                                updateSteaming.est_cost = item?.cost ?? 0.0;
                                updateSteaming.rate = item?.cost ?? 0.0;
                                updateSteaming.total_hour = 1.0;
                                updateSteaming.est_hour = 1.0;
                            }
                            else
                            {
                                updateSteaming.est_cost = item?.labour ?? 0.0;
                                updateSteaming.rate = item?.labour ?? 0.0;
                                updateSteaming.est_hour = 1.0;
                                updateSteaming.total_hour = 0.0;
                                //if hourly_rate --> total_hour updated after completed
                            }
                        }
                    }

                    //InGate Survey Handling
                    var igSurveyRequest = tankDetailRequest?.IngateSurvey ?? null;
                    if (igSurveyRequest != null && !string.IsNullOrEmpty(igSurveyRequest?.guid ?? ""))
                    {
                        var igSurvey = new in_gate_survey() { guid = igSurveyRequest?.guid };
                        context.in_gate_survey.Attach(igSurvey);
                        if (igSurveyRequest?.tare_weight != null && igSurveyRequest?.tare_weight > 0)
                            igSurvey.tare_weight = igSurveyRequest?.tare_weight;
                        if (igSurveyRequest?.capacity != null && igSurveyRequest?.capacity > 0)
                            igSurvey.capacity = igSurveyRequest?.capacity;
                        if (igSurveyRequest?.dom_dt != 0)
                            igSurvey.dom_dt = igSurveyRequest?.dom_dt;
                        if (!string.IsNullOrEmpty(igSurveyRequest?.cladding_cv ?? ""))
                            igSurvey.cladding_cv = igSurveyRequest?.cladding_cv;
                        if (!string.IsNullOrEmpty(igSurveyRequest?.btm_dis_comp_cv ?? ""))
                            igSurvey.btm_dis_comp_cv = igSurveyRequest?.btm_dis_comp_cv;
                        if (!string.IsNullOrEmpty(igSurveyRequest?.manufacturer_cv ?? ""))
                            igSurvey.manufacturer_cv = igSurveyRequest?.manufacturer_cv;
                        if (!string.IsNullOrEmpty(igSurveyRequest?.max_weight_cv ?? ""))
                            igSurvey.max_weight_cv = igSurveyRequest?.max_weight_cv;
                        if (!string.IsNullOrEmpty(igSurveyRequest?.walkway_cv ?? ""))
                            igSurvey.walkway_cv = igSurveyRequest?.walkway_cv;


                        if (!string.IsNullOrEmpty(igSurveyRequest?.tank_comp_guid ?? ""))
                        {
                            //Update the tank_comp_guid
                            igSurvey.tank_comp_guid = igSurveyRequest?.tank_comp_guid;

                            if (string.IsNullOrEmpty(tankDetailRequest?.SO?.customer_company_guid ?? ""))
                                throw new GraphQLException(new Error($"SO.customer_company_guid cannot be null or empty", "ERROR"));

                            if (string.IsNullOrEmpty(tankDetailRequest?.Cleaning?.guid ?? ""))
                                throw new GraphQLException(new Error($"CleaningGuid cannot be null or empty", "ERROR"));

                            //affect cleaning, buffer changes
                            var customerGuid = tankDetailRequest?.SO?.customer_company_guid;
                            var bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == igSurveyRequest.tank_comp_guid)
                                       .Select(b => b.cost).FirstOrDefaultAsync();

                            if (bufferPrice == null)
                                throw new GraphQLException(new Error($"Buffer cost not found", "ERROR"));

                            var cleaning = new cleaning() { guid = tankDetailRequest?.Cleaning?.guid };
                            context.cleaning.Attach(cleaning);
                            cleaning.buffer_cost = bufferPrice;
                            cleaning.update_by = user;
                            cleaning.update_dt = currentDateTime;
                        }

                        igSurvey.update_by = user;
                        igSurvey.update_dt = currentDateTime;

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

        public async Task<int> UpdateGateDetails(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, GateDetailRequest gateDetailRequest)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (gateDetailRequest.InGateDetail != null)
                {
                    //SOT Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.SOT?.guid ?? ""))
                    {
                        if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.SOT?.job_no))
                        {
                            var tank = new storing_order_tank() { guid = gateDetailRequest.InGateDetail?.SOT?.guid };
                            context.storing_order_tank.Attach(tank);
                            tank.job_no = gateDetailRequest.InGateDetail?.SOT?.job_no;
                            tank.update_by = user;
                            tank.update_dt = currentDateTime;
                        }
                    }

                    //SO Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.OrderInfo?.guid ?? ""))
                    {
                        if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.OrderInfo?.haulier))
                        {
                            var so = new storing_order() { guid = gateDetailRequest.InGateDetail?.OrderInfo?.guid };
                            context.storing_order.Attach(so);
                            so.haulier = gateDetailRequest.InGateDetail?.OrderInfo?.haulier;
                            so.update_by = user;
                            so.update_dt = currentDateTime;
                        }
                    }

                    //Gate Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.GateInfo?.guid ?? ""))
                    {
                        var ingate = new in_gate() { guid = gateDetailRequest.InGateDetail?.GateInfo?.guid };
                        context.in_gate.Attach(ingate);
                        if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.GateInfo?.vehicle_no))
                            ingate.vehicle_no = gateDetailRequest.InGateDetail?.GateInfo?.vehicle_no;
                        if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.GateInfo?.driver_name))
                            ingate.driver_name = gateDetailRequest.InGateDetail?.GateInfo?.driver_name;
                        if (!string.IsNullOrEmpty(gateDetailRequest.InGateDetail?.GateInfo?.remarks))
                            ingate.remarks = gateDetailRequest.InGateDetail?.GateInfo?.remarks;
                        ingate.update_by = user;
                        ingate.update_dt = currentDateTime;
                    }
                }

                if (gateDetailRequest.OutGateDetail != null)
                {
                    //SOT Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.SOT?.guid ?? ""))
                    {
                        if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.SOT?.release_job_no))
                        {
                            var tank = new storing_order_tank() { guid = gateDetailRequest.OutGateDetail?.SOT?.guid };
                            context.storing_order_tank.Attach(tank);
                            tank.release_job_no = gateDetailRequest.OutGateDetail?.SOT?.release_job_no;
                            tank.update_by = user;
                            tank.update_dt = currentDateTime;
                        }
                    }

                    //SO Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.OrderInfo?.guid ?? ""))
                    {
                        if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.OrderInfo?.haulier))
                        {
                            var ro = new release_order() { guid = gateDetailRequest.OutGateDetail?.OrderInfo?.guid };
                            context.release_order.Attach(ro);
                            ro.haulier = gateDetailRequest.OutGateDetail?.OrderInfo?.haulier;
                            ro.update_by = user;
                            ro.update_dt = currentDateTime;
                        }
                    }

                    //Gate Handling
                    if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.GateInfo?.guid ?? ""))
                    {
                        var outgate = new out_gate() { guid = gateDetailRequest.OutGateDetail?.GateInfo?.guid };
                        context.out_gate.Attach(outgate);
                        if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.GateInfo?.vehicle_no))
                            outgate.vehicle_no = gateDetailRequest.OutGateDetail?.GateInfo?.vehicle_no;
                        if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.GateInfo?.driver_name))
                            outgate.driver_name = gateDetailRequest.OutGateDetail?.GateInfo?.driver_name;
                        if (!string.IsNullOrEmpty(gateDetailRequest.OutGateDetail?.GateInfo?.remarks))
                            outgate.remarks = gateDetailRequest.OutGateDetail?.GateInfo?.remarks;
                        outgate.update_by = user;
                        outgate.update_dt = currentDateTime;
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

        public async Task<int> UpdateTankInfo(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, TankInfoRequest tankInfoRequest)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (tankInfoRequest != null && TankInfoAction.REOWNERSHIP.EqualsIgnore(tankInfoRequest?.action))
                {
                    //SOT Handling
                    if (!string.IsNullOrEmpty(tankInfoRequest?.SOT?.guid ?? ""))
                    {
                        if (string.IsNullOrEmpty(tankInfoRequest?.SOT?.owner_guid ?? ""))
                            throw new GraphQLException(new Error($"owner_guid cannot be null or empty", "ERROR"));

                        var tank = new storing_order_tank() { guid = tankInfoRequest?.SOT?.guid };
                        context.storing_order_tank.Attach(tank);
                        tank.owner_guid = tankInfoRequest?.SOT?.owner_guid;
                        tank.update_by = user;
                        tank.update_dt = currentDateTime;


                        var tankInfoObject = tankInfoRequest?.TankInfo;
                        if (string.IsNullOrEmpty(tankInfoObject?.guid ?? "") || string.IsNullOrEmpty(tankInfoObject?.tank_no ?? ""))
                            throw new GraphQLException(new Error($"tank_info guid/tank_no cannot be null or empty", "ERROR"));

                        var tank_info = await context.tank_info.Where(t => t.guid == tankInfoObject.guid && t.tank_no == tankInfoObject.tank_no
                                                                && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();

                        if (tank_info != null)
                        {
                            tank_info.previous_owner_guid = tank_info.owner_guid;
                            tank_info.owner_guid = tankInfoRequest?.SOT?.owner_guid;
                            tank_info.update_by = user;
                            tank_info.update_dt = currentDateTime;
                        }
                        else
                            throw new GraphQLException(new Error($"tank info not found", "NOT FOUND"));
                    }
                }

                if (tankInfoRequest != null && TankInfoAction.RENUMBER.EqualsIgnore(tankInfoRequest?.action))
                {
                    if (string.IsNullOrEmpty(tankInfoRequest?.SOT?.tank_no ?? ""))
                        throw new GraphQLException(new Error($"tank_no cannot be null or empty", "ERROR"));

                    var tank = new storing_order_tank() { guid = tankInfoRequest?.SOT?.guid };
                    context.storing_order_tank.Attach(tank);
                    tank.tank_no = tankInfoRequest?.SOT?.tank_no;
                    tank.update_by = user;
                    tank.update_dt = currentDateTime;


                    var tankInfoObject = tankInfoRequest?.TankInfo;
                    if (string.IsNullOrEmpty(tankInfoObject?.guid ?? "") || string.IsNullOrEmpty(tankInfoObject?.tank_no ?? ""))
                        throw new GraphQLException(new Error($"tank_info guid/tank_no cannot be null or empty", "ERROR"));

                    var oldTankInfo = await context.tank_info.Where(t => t.guid == tankInfoObject.guid && t.tank_no == tankInfoObject.tank_no
                                                            && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();

                    if (oldTankInfo != null)
                    {
                        tank_info duplicateTankInfo = new tank_info();
                        mapper.Map(oldTankInfo, duplicateTankInfo);

                        duplicateTankInfo.guid = Util.GenerateGUID();
                        duplicateTankInfo.previous_tank_no = oldTankInfo.tank_no;
                        duplicateTankInfo.tank_no = tankInfoRequest?.SOT?.tank_no;
                        duplicateTankInfo.update_by = user;
                        duplicateTankInfo.update_dt = currentDateTime;
                        await context.tank_info.AddAsync(duplicateTankInfo);

                        oldTankInfo.update_by = user;
                        oldTankInfo.update_dt = currentDateTime;
                        oldTankInfo.delete_dt = currentDateTime;
                    }
                    else
                        throw new GraphQLException(new Error($"tank info not found", "NOT FOUND"));
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        #region Private Local Functions

        private async Task<int> RemoveCleaning(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank, ResidueRequest? residueRequest)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
                bool hasPendingResidue = false;

                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var cleaning = await context.cleaning.Where(c => c.sot_guid == tank.guid && (c.delete_dt == null || c.delete_dt == 0)).ToListAsync();
                    foreach (var clean in cleaning)
                    {
                        clean.update_by = user;
                        clean.update_dt = currentDateTime;
                        clean.na_dt = currentDateTime;
                        clean.status_cv = CurrentServiceStatus.NO_ACTION;

                        var jobOrders = await context.job_order.Where(j => j.cleaning.Any(c => c.guid == clean.guid)).ToListAsync();
                        foreach (var item in jobOrders)
                        {
                            if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                            {
                                item.status_cv = CurrentServiceStatus.CANCELED;
                                item.update_by = user;
                                item.update_dt = currentDateTime;
                            }
                        }

                        if (await StatusChangeConditionCheck(jobOrders))
                        {
                            clean.status_cv = CurrentServiceStatus.COMPLETED;
                            clean.complete_dt = currentDateTime;
                        }
                        else
                            clean.status_cv = CurrentServiceStatus.NO_ACTION;
                    }

                    var residues = await context.residue.Where(c => c.sot_guid == tank.guid && (c.delete_dt == null || c.delete_dt == 0)).ToListAsync();
                    foreach (var resd in residues)
                    {
                        hasPendingResidue = true;

                        resd.update_by = user;
                        resd.update_dt = currentDateTime;
                        resd.na_dt = currentDateTime;
                        resd.status_cv = CurrentServiceStatus.NO_ACTION;

                        var jobOrders = await context.job_order.Where(j => j.residue_part.Any(c => c.guid == resd.guid)).ToListAsync();
                        foreach (var item in jobOrders)
                        {
                            if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                            {
                                item.status_cv = CurrentServiceStatus.CANCELED;
                                item.update_by = user;
                                item.update_dt = currentDateTime;
                            }
                        }

                        if (await StatusChangeConditionCheck(jobOrders))
                        {
                            resd.status_cv = CurrentServiceStatus.COMPLETED;
                            resd.complete_dt = currentDateTime;
                        }
                        else
                            resd.status_cv = CurrentServiceStatus.NO_ACTION;
                    }

                    //Save the changes before do tank movement check
                    await context.SaveChangesAsync();

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_cleaning = false;
                        sot.cleaning_remarks = tank.cleaning_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck(context, sot);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        currentTankStatus = sot.tank_status_cv;

                        if (hasPendingResidue)
                            sot.purpose_repair_cv = "";
                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));
                }
                else
                {
                    var sot = new storing_order_tank() { guid = tank.guid };
                    context.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.cleaning_remarks = tank.cleaning_remarks;
                    sot.purpose_cleaning = false;
                    //var res = await context.SaveChangesAsync();
                    //return res;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.CLEAN, tank.guid, currentTankStatus);
                return res;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private async Task<int> RemoveSteaming(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var steams = await context.steaming.Where(s => s.sot_guid == tank.guid && (s.delete_dt == null || s.delete_dt == 0)).ToListAsync();
                    foreach (var steam in steams)
                    {
                        steam.update_by = user;
                        steam.update_dt = currentDateTime;
                        steam.na_dt = currentDateTime;
                        steam.delete_dt = currentDateTime;
                        steam.status_cv = CurrentServiceStatus.NO_ACTION;

                        var jobOrders = await context.job_order.Where(j => j.steaming_part.Any(c => c.guid == steam.guid)).ToListAsync();
                        foreach (var item in jobOrders)
                        {
                            if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                            {
                                item.status_cv = CurrentServiceStatus.CANCELED;
                                item.update_by = user;
                                item.update_dt = currentDateTime;
                                item.delete_dt = currentDateTime;
                            }
                        }
                    }

                    //Save the changes before do tank movement check
                    await context.SaveChangesAsync();

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_steam = false;
                        sot.steaming_remarks = tank.steaming_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck(context, sot);
                        sot.required_temp = null;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        currentTankStatus = sot.tank_status_cv;
                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));
                }
                else
                {
                    var sot = new storing_order_tank() { guid = tank.guid };
                    context.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.steaming_remarks = tank.steaming_remarks;
                    sot.required_temp = null;
                    sot.purpose_steam = false;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.STEAM, tank.guid, currentTankStatus);
                return res;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private async Task<int> RemoveRepair(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank, ResidueRequest? residueRequest)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    bool pendingJob = false;
                    //var repairs = await context.repair.Where(r => r.sot_guid == tank.guid & r.status_cv == CurrentServiceStatus.PENDING).ToListAsync();
                    var repairs = await context.repair.Where(r => r.sot_guid == tank.guid && (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
                    foreach (var rep in repairs)
                    {
                        //Process handling
                        rep.update_by = user;
                        rep.update_dt = currentDateTime;
                        rep.na_dt = currentDateTime;
                        rep.status_cv = CurrentServiceStatus.NO_ACTION;

                        //Job order handling
                        var jobOrders = await context.job_order.Where(j => j.repair_part.Any(c => c.guid == rep.guid)).ToListAsync();
                        foreach (var item in jobOrders)
                        {
                            if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                            {
                                item.status_cv = CurrentServiceStatus.CANCELED;
                                item.update_by = user;
                                item.update_dt = currentDateTime;
                            }
                        }

                        if (jobOrders.Any(j => j.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS)))
                            pendingJob = true;

                        if (await StatusChangeConditionCheck(jobOrders))
                        {
                            rep.status_cv = CurrentServiceStatus.COMPLETED;
                            rep.complete_dt = currentDateTime;
                        }
                        else
                            rep.status_cv = CurrentServiceStatus.NO_ACTION;
                    }


                    if (residueRequest != null && !string.IsNullOrEmpty(residueRequest.residue_guid))
                    {
                        var pendingResidue = new residue() { guid = residueRequest.residue_guid };
                        context.residue.Attach(pendingResidue);
                        pendingResidue.update_by = user;
                        pendingResidue.update_dt = currentDateTime;
                        pendingResidue.na_dt = currentDateTime;
                        pendingResidue.status_cv = CurrentServiceStatus.NO_ACTION;

                        //foreach (var partGuid in residueRequest.residue_part_guid)
                        //{
                        //    var resPart = new residue_part() { guid = partGuid };
                        //    context.Set<residue_part>().Attach(resPart);
                        //    resPart.approve_part = false;
                        //    resPart.update_dt = currentDateTime;
                        //    resPart.update_by = user;
                        //}
                    }
                    //Save the changes before do tank movement check
                    await context.SaveChangesAsync();

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_repair_cv = null;
                        sot.repair_remarks = tank.repair_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck(context, sot, pendingJob);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        currentTankStatus = sot.tank_status_cv;
                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));
                }
                else
                {
                    var sot = new storing_order_tank() { guid = tank.guid };
                    context.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.repair_remarks = tank.repair_remarks;
                    sot.purpose_repair_cv = tank.purpose_repair_cv;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.REPAIR, tank.guid, currentTankStatus);
                return res;

            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private async Task<int> RemoveStorage(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.storage_remarks = tank.storage_remarks;
                        sot.purpose_storage = false;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck(context, sot);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        currentTankStatus = sot.tank_status_cv;

                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));
                }
                else
                {
                    var sot = new storing_order_tank() { guid = tank.guid };
                    context.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.storage_remarks = tank.storage_remarks;
                    sot.purpose_storage = false;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.STORAGE, tank.guid, currentTankStatus);
                return res;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        private async Task<bool> StatusChangeConditionCheck(List<job_order> jobOrders)
        {
            bool allValid = false;
            allValid = jobOrders.All(jO => jO.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
                    jO.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED));

            // If all are canceled, set allValid to false
            if (allValid && jobOrders.All(jO => jO.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED)))
                allValid = false;

            return allValid;
        }

        #endregion

        [Obsolete]
        private async Task<int> RemoveSteaming1(ApplicationInventoryDBContext context, [Service] IConfiguration config, string steamingGuid, string sotGuid, List<job_order?>? job_orders)
        {
            try
            {
                var jobOrders = await context.job_order.Where(j => j.steaming_part.Any(c => c.guid == steamingGuid)).ToListAsync();

                string httpURL = $"{config["GatewayURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var mutation = @"
                    mutation($cleaningJobOrder: CleaningJobOrderInput!) {
                        abortCleaning(cleaningJobOrder: $cleaningJobOrder) {
                        }
                    }";

                    // Define the variables for the query
                    var variables = new
                    {
                        cleaningJobOrder = new
                        {
                            guid = steamingGuid,
                            sot_guid = sotGuid,
                            remarks = "message",
                            job_order = jobOrders
                        }
                    };

                    // Create the GraphQL request payload
                    var requestPayload = new
                    {
                        query = mutation,
                        variables = variables
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(requestPayload);

                    HttpClient _httpClient = new();
                    //string queryStatement = JsonConvert.SerializeObject(query);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var data = await _httpClient.PostAsync(httpURL, content);
                    Console.WriteLine(data);
                }

                return 1;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [Obsolete]
        private async Task<int> RemoveCleaning2(ApplicationInventoryDBContext context, [Service] IConfiguration config, string cleaningGuid, string sotGuid, List<job_order?>? job_orders)
        {
            try
            {
                var jobOrders = await context.job_order.Where(j => j.cleaning.Any(c => c.guid == cleaningGuid)).ToListAsync();

                string httpURL = $"{config["GatewayURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var mutation = @"
                    mutation($cleaningJobOrder: CleaningJobOrderInput!) {
                        abortCleaning(cleaningJobOrder: $cleaningJobOrder) {
                        }
                    }";

                    // Define the variables for the query
                    var variables = new
                    {
                        cleaningJobOrder = new
                        {
                            guid = cleaningGuid,
                            sot_guid = sotGuid,
                            remarks = "message",
                            job_order = jobOrders
                        }
                    };

                    // Create the GraphQL request payload
                    var requestPayload = new
                    {
                        query = mutation,
                        variables = variables
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(requestPayload);

                    HttpClient _httpClient = new();
                    //string queryStatement = JsonConvert.SerializeObject(query);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var data = await _httpClient.PostAsync(httpURL, content);
                    Console.WriteLine(data);
                }

                return 1;
            }
            catch (Exception ex)
            {
                throw;
            }
        }
    }
}
