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

        private async Task<int> RemoveCleaning(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var jobOrders = await context.job_order.Where(j => j.cleaning.Any(c => c.guid == processGuid)).ToListAsync();

                    var abortCleaning = new cleaning() { guid = processGuid };
                    context.cleaning.Attach(abortCleaning);

                    abortCleaning.update_by = user;
                    abortCleaning.update_dt = currentDateTime;
                    abortCleaning.status_cv = CurrentServiceStatus.NO_ACTION;
                    //abortCleaning.remarks = remarks;

                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            job_order.status_cv = CurrentServiceStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_cleaning = false;
                        sot.cleaning_remarks = tank.cleaning_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
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
                await GqlUtils.NotificationHandling(config, PurposeType.CLEAN, tank.guid, tank.status_cv);
                return res;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

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

        private async Task<int> RemoveSteaming(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string processGuid, storing_order_tank tank)
        {
            try
            {
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var jobOrders = await context.job_order.Where(j => j.steaming_part.Any(c => c.guid == processGuid)).ToListAsync();

                    var abortSteaming = new steaming() { guid = processGuid };
                    context.steaming.Attach(abortSteaming);

                    abortSteaming.update_by = user;
                    abortSteaming.update_dt = currentDateTime;
                    abortSteaming.status_cv = CurrentServiceStatus.NO_ACTION;

                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            job_order.status_cv = CurrentServiceStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_steam = false;
                        sot.steaming_remarks = tank.steaming_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
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
                    sot.purpose_steam = false;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.STEAM, tank.guid, tank.status_cv);
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
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var jobOrders = await context.job_order.Where(j => j.repair_part.Any(c => c.guid == processGuid)).ToListAsync();

                    //Process handling
                    var abortRepair = new repair() { guid = processGuid };
                    context.repair.Attach(abortRepair);
                    abortRepair.update_by = user;
                    abortRepair.update_dt = currentDateTime;
                    abortRepair.status_cv = CurrentServiceStatus.NO_ACTION;

                    //Job order handling
                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            job_order.status_cv = CurrentServiceStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }

                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        sot.purpose_repair_cv = tank.purpose_repair_cv;
                        sot.repair_remarks = tank.repair_remarks;
                        sot.tank_status_cv = await GqlUtils.TankMovementConditionCheck1(context, sot);
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                    }
                    else
                        throw new GraphQLException(new Error("Tank not found.", "ERROR"));

                    //var res = await context.SaveChangesAsync();
                    //TankMovement Check
                    //var curTankStatus = await GqlUtils.TankMovementConditionCheck(context, config, user, currentDateTime, tank.guid, PurposeType.REPAIR, tank.repair_remarks);
                    //return res;
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
                await GqlUtils.NotificationHandling(config, PurposeType.REPAIR, tank.guid, tank.status_cv);
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
                if (TankMovementStatus.validTankStatus.Contains(tank.tank_status_cv))
                {
                    var sot = await context.storing_order_tank.FindAsync(tank.guid);
                    if (sot != null)
                    {
                        tank.storage_remarks = sot.storage_remarks;
                        tank.purpose_storage = false;
                        var curTankStatus = await GqlUtils.TankMovementConditionCheck1(context, sot);
                        tank.update_by = user;
                        tank.update_dt = currentDateTime;
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
                    tank.purpose_storage = false;
                }

                var res = await context.SaveChangesAsync();
                await GqlUtils.NotificationHandling(config, PurposeType.STORAGE, tank.guid, tank.status_cv);
                return res;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<int> AddSurveyDetail(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, survey_detail surveyDetail)
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

                newSuyDetail.customer_company_guid = surveyDetail.customer_company_guid;
                newSuyDetail.sot_guid = surveyDetail.sot_guid;
                newSuyDetail.status_cv = surveyDetail.status_cv;
                newSuyDetail.remarks = surveyDetail.remarks;
                newSuyDetail.survey_type_cv = surveyDetail.survey_type_cv;
                newSuyDetail.survey_dt = surveyDetail.survey_dt;

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

                updateSuyDetail.customer_company_guid = surveyDetail.customer_company_guid;
                updateSuyDetail.sot_guid = surveyDetail.sot_guid;
                updateSuyDetail.status_cv = surveyDetail.status_cv;
                updateSuyDetail.remarks = surveyDetail.remarks;
                updateSuyDetail.survey_type_cv = surveyDetail.survey_type_cv;
                updateSuyDetail.survey_dt = surveyDetail.survey_dt;

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        public async Task<int> UpdatePeriodicTest(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, PeriodicTestRequest periodicTest)
        {
            try
            {
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if(periodicTest.survey_detail == null)
                    throw new GraphQLException(new Error($"survey_detail object cannot be null or empty.", "ERROR"));

                var newSuyDetail = new survey_detail();
                newSuyDetail.guid = Util.GenerateGUID();
                newSuyDetail.create_by = user;
                newSuyDetail.create_dt = currentDateTime;

                newSuyDetail.customer_company_guid = periodicTest.survey_detail.customer_company_guid;
                newSuyDetail.sot_guid = periodicTest.survey_detail.sot_guid;
                newSuyDetail.status_cv = periodicTest.survey_detail.status_cv;
                newSuyDetail.remarks = periodicTest.survey_detail.remarks;
                newSuyDetail.survey_type_cv = periodicTest.survey_detail.survey_type_cv;
                newSuyDetail.survey_dt = currentDateTime;
                await context.survey_detail.AddAsync(newSuyDetail);


                if (SurveyStatus.ACCEPT.EqualsIgnore(periodicTest.survey_detail.status_cv))
                {
                    var tankInfo = await context.tank_info.Where(t => t.tank_no == periodicTest.tank_no & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                    if (tankInfo == null)
                        throw new GraphQLException(new Error($"tank info not found.", "ERROR"));

                    tankInfo.last_test_cv = periodicTest.last_test_cv;
                    tankInfo.next_test_cv = periodicTest.next_test_cv;
                    tankInfo.test_dt = newSuyDetail.survey_dt;
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

    }
}
