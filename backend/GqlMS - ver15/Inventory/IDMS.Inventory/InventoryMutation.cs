﻿using HotChocolate;
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

                                await RemoveCleaning(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank);
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

                                await RemoveRepair(context, config, user, currentDateTime, tankPurpose.guid, tankPurpose.storing_order_tank);
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
                newSuyDetail.sot_guid = surveyDetail.sot_guid;
                newSuyDetail.status_cv = surveyDetail.status_cv;
                newSuyDetail.remarks = surveyDetail.remarks;
                newSuyDetail.survey_dt = surveyDetail.survey_dt;
                newSuyDetail.test_class_cv = surveyDetail.test_class_cv;
                newSuyDetail.survey_type_cv = surveyDetail.survey_type_cv;

                if (surveyDetail.survey_type_cv.EqualsIgnore("PERIODIC_TEST"))
                {
                    if (periodicTest == null)
                        throw new GraphQLException(new Error($"Periodic test object cannot be null", "ERROR"));

                    newSuyDetail.test_class_cv = surveyDetail.test_class_cv;
                    newSuyDetail.test_type_cv = surveyDetail.test_type_cv;
                    if (surveyDetail.status_cv.EqualsIgnore(SurveyStatus.ACCEPT))
                    {
                        //Update Tank Info
                        var tankInfo = await context.tank_info.Where(t => t.tank_no == periodicTest.tank_no & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                        if (tankInfo == null)
                            throw new GraphQLException(new Error($"tank info not found.", "ERROR"));

                        tankInfo.last_test_cv = periodicTest.last_test_cv;
                        tankInfo.next_test_cv = periodicTest.next_test_cv;
                        tankInfo.test_class_cv = surveyDetail.test_class_cv;
                        tankInfo.test_dt = newSuyDetail.survey_dt;
                        tankInfo.update_by = user;
                        tankInfo.update_dt = currentDateTime;
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
            [Service] IHttpContextAccessor httpContextAccessor, survey_detail surveyDetail)
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

                if(string.IsNullOrEmpty(transfer.sot_guid))
                    throw new GraphQLException(new Error($"SOT guid cannot be null", "ERROR"));

                if (string.IsNullOrEmpty(transfer.guid))
                {
                    //need to add new transfer record
                    transfer newTransfer = transfer;
                    newTransfer.guid = Util.GenerateGUID();
                    newTransfer.create_by = user;
                    newTransfer.create_dt = currentDateTime;
                    newTransfer.transfer_out_dt = currentDateTime;
                    await context.AddAsync(newTransfer);
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
                    updateTransfer.haulier = transfer.haulier;
                    updateTransfer.driver_name = transfer.driver_name;
                    updateTransfer.location_from_cv = transfer.location_from_cv;
                    updateTransfer.location_to_cv = transfer.location_to_cv;
                    updateTransfer.transfer_out_dt = transfer.transfer_out_dt;
                    updateTransfer.transfer_in_dt = currentDateTime;
                    updateTransfer.remarks = transfer.remarks;

                    if (transfer.delete_dt != null)
                        transfer.delete_dt = currentDateTime;
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

        private async Task<int> RemoveCleaning(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
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
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
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
                        steam.status_cv = CurrentServiceStatus.NO_ACTION;

                        var jobOrders = await context.job_order.Where(j => j.steaming_part.Any(c => c.guid == steam.guid)).ToListAsync();
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
                            steam.status_cv = CurrentServiceStatus.COMPLETED;
                            steam.complete_dt = currentDateTime;
                        }
                        else
                            steam.status_cv = CurrentServiceStatus.NO_ACTION;
                    }

                    //Save the changes before do tank movement check
                    await context.SaveChangesAsync();

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_steam = false;
                        sot.steaming_remarks = tank.steaming_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
                        sot.required_temp = null;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        currentTankStatus = sot.tank_status_cv;
                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));

                    //var res = await context.SaveChangesAsync();
                    //var curTankStatus = await GqlUtils.TankMovementConditionCheck(context, config, user, currentDateTime, tank.guid, PurposeType.STEAM, tank.steaming_remarks);
                    //return res;
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
        private async Task<int> RemoveRepair(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                string currentTankStatus = tank.tank_status_cv;
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
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
                        
                        if (await StatusChangeConditionCheck(jobOrders))
                        {
                            rep.status_cv = CurrentServiceStatus.COMPLETED;
                            rep.complete_dt = currentDateTime;
                        }
                        else
                            rep.status_cv = CurrentServiceStatus.NO_ACTION;
                    }

                    //Save the changes before do tank movement check
                    await context.SaveChangesAsync();

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_repair_cv = null;
                        sot.repair_remarks = tank.repair_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
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
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
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