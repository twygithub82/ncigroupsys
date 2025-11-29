using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models;
using IDMS.Models.Notification;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

using System.Security.Claims;
using System.Text;

namespace IDMS.Service.GqlTypes
{
    public static class GqlUtils
    {
        private static ILogger? _logger;

        public static void Initialize(ILoggerFactory factory)
        {
            _logger = factory.CreateLogger(nameof(GqlUtils));
        }


        public static async void PingThread(IServiceScope scope, int duration)
        {
            Thread t = new Thread(async () =>
            {
                using (scope)
                {
                    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationServiceDBContext>>();

                    // Create a new instance of ApplicationPackageDBContext
                    using (var dbContext = await contextFactory.CreateDbContextAsync())
                    {
                        while (true)
                        {
                            await dbContext.Database.OpenConnectionAsync();
                            //await dbContext.currency.Where(c => c.guid == "1").Select(c => c.code_val).FirstOrDefaultAsync();
                            await dbContext.currency.Where(c => c.currency_code == "SGD").Select(c => c.guid).FirstOrDefaultAsync();
                            await dbContext.Database.CloseConnectionAsync();
                            Thread.Sleep(1000 * 60 * duration);
                        }
                    }
                }
            });
            t.Start();
        }

        public static async Task<string> GetJWTKey(string connectionString)
        {
            string secretkey = "JWTAuthenticationHIGHSeCureDWMScNiproject_2024";
            try
            {
                var query = "select * from param_values where param_val_type='JWT_SECRET_KEY'";

                using (var connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var result = new List<JToken>();
                            while (await reader.ReadAsync())
                            {
                                var row = new JObject();
                                for (var i = 0; i < reader.FieldCount; i++)
                                {
                                    row[reader.GetName(i)] = JToken.FromObject(reader.GetValue(i));
                                }
                                result.Add(row);
                            }
                            return $"{result[0]["param_val"]}";
                        }
                    }
                }
            }
            catch
            {
                throw;
            }

            return secretkey;
        }

        public static string IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string uid = "";
            try
            {
                var isCheckAuthorization = Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";

                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value;
                if (primarygroupSid == null)
                    primarygroupSid = authUser.FindFirst("groupsid")?.Value;
                uid = authUser.FindFirst(ClaimTypes.Name)?.Value;
                if (uid == null)
                    uid = authUser.FindFirst("name").Value;
                if (primarygroupSid != "s1")
                {
                    _logger?.LogError("Unauthorized access attempt by user: {UserId}", uid);
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }

            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "Authorization failed");  
                throw new Exception("Unauthorized - " + ex.Message);
            }
            return uid;
        }

        public static async Task SendJobNotification([Service] IConfiguration config, JobNotification jobNotification, string type)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";

                if (!string.IsNullOrEmpty(httpURL))
                {
                    string jsonString = JsonConvert.SerializeObject(jobNotification);
                    var message = new
                    {
                        topic = jobNotification?.job_order_guid ?? Util.GenerateGUID(),
                        count = 1,
                        event_id = Util.GenerateGUID(),
                        event_name = type,
                        event_dt = DateTime.Now.ToEpochTime(),
                        payload = jsonString
                    };


                    var graphqlQuery = new
                    {
                        query = @"
                        query SendMessage($message: Message_r1Input!) {
                          sendMessage_r1(message: $message)
                        }",
                        variables = new
                        {
                            message
                        }
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(graphqlQuery);
                    //string jsonPayload = JObject.FromObject(requestPayload).ToString(Newtonsoft.Json.Formatting.None);

                    HttpClient _httpClient = new();
                    //string queryStatement = Newtonsoft.Json.JsonConvert.SerializeObject(query);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var data = await _httpClient.PostAsync(httpURL, content);
                    Console.WriteLine(data);
                }

            }
            catch (Exception ex)
            { }
        }

        //public static async Task SendJobNotification([Service] IConfiguration config, JobNotification jobNotification, int type)
        //{
        //    try
        //    {
        //        string httpURL = $"{config["GlobalNotificationURL"]}";
        //        if (!string.IsNullOrEmpty(httpURL))
        //        {
        //            var query = @"query sendJobNotification($jobNotification: JobNotificationInput!, $type: Int!) 
        //                            {sendJobNotification(jobNotification: $jobNotification, type: $type)}";

        //            //// Define the variables for the query
        //            // Variables for the query
        //            var variables = new
        //            {
        //                jobNotification = jobNotification,
        //                type = type  // Dynamic value for type
        //            };

        //            // Create the GraphQL request payload
        //            var requestPayload = new
        //            {
        //                query = query,
        //                variables = variables
        //            };

        //            // Serialize the payload to JSON
        //            var jsonPayload = JsonConvert.SerializeObject(requestPayload);

        //            HttpClient _httpClient = new();
        //            string queryStatement = JsonConvert.SerializeObject(query);
        //            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
        //            var data = await _httpClient.PostAsync(httpURL, content);
        //            Console.WriteLine(data);
        //        }
        //    }
        //    catch (Exception ex)
        //    { }
        //}


        //public static async Task<bool> TankMovementCheck(ApplicationServiceDBContext context, string processType, string sotGuid, string processGuid)
        //{
        //    //List<string> status = new List<string> { CurrentServiceStatus.APPROVED, CurrentServiceStatus.JOB_IN_PROGRESS, CurrentServiceStatus.QC, CurrentServiceStatus.PENDING };
        //    //var result = await context.repair
        //    //            .Where(r => status.Contains(r.status_cv) && r.sot_guid == sotGuid && r.guid != processGuid).Select(r => r.guid)
        //    //            .ToListAsync();

        //    try
        //    {
        //        string tableName = processType;

        //        var sqlQuery = $@"SELECT guid FROM {tableName} 
        //                    WHERE status_cv IN ('{CurrentServiceStatus.APPROVED}', '{CurrentServiceStatus.JOB_IN_PROGRESS}', '{CurrentServiceStatus.QC}', '{CurrentServiceStatus.PENDING}')
        //                    AND sot_guid = '{sotGuid}' AND guid != '{processGuid}' AND delete_dt IS NULL";
        //        var result = await context.Database.SqlQueryRaw<string>(sqlQuery).ToListAsync();

        //        if (result.Count > 0)
        //            return true;
        //        else
        //            return false;
        //    }
        //    catch(Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

        public static async Task JobOrderHandling(ApplicationServiceDBContext context, string processType, string user, long currentDateTime, string action, string? processGuid = "", List<job_order>? jobOrders = null)
        {
            try
            {
                if (ObjectAction.APPROVE.EqualsIgnore(action))
                {
                    //string partTableName = "";
                    //string processGuidName = "";

                    var pt = processType.ToLowerInvariant();

                    IQueryable<job_order>? query = pt switch
                    {
                        "cleaning" =>
                            from jo in context.job_order
                            join c in context.cleaning on jo.guid equals c.job_order_guid
                            where jo.delete_dt == null
                                  && c.delete_dt == null
                                  && c.guid == processGuid
                            select jo,

                        "steaming" =>
                            from jo in context.job_order
                            join s in context.steaming_part on jo.guid equals s.job_order_guid
                            where jo.delete_dt == null
                                  && s.delete_dt == null
                                  && s.steaming_guid == processGuid
                                  && s.approve_part == true
                            select jo,

                        "residue" =>
                            from jo in context.job_order
                            join r in context.residue_part on jo.guid equals r.job_order_guid
                            where jo.delete_dt == null
                                  && r.delete_dt == null
                                  && r.residue_guid == processGuid
                                  && r.approve_part == true
                            select jo,

                        "repair" =>
                            from jo in context.job_order
                            join rp in context.repair_part on jo.guid equals rp.job_order_guid
                            where jo.delete_dt == null
                                  && rp.delete_dt == null
                                  && rp.repair_guid == processGuid
                                  && rp.approve_part == true
                            select jo,

                        _ => null
                    };


                    if (query is null)
                    {
                        _logger?.LogError("Invalid process type provided: {ProcessType}", processType);
                        throw new Exception($"Invalid process type: {processType}");
                    }

                    // Distinct in case of accidental duplicates due to data issues
                    var jobOrderList = await query.Distinct().ToListAsync();
                    foreach (var item in jobOrderList)
                    {
                        if (item != null && JobStatus.CANCELED.EqualsIgnore(item.status_cv))
                        {
                            item.status_cv = JobStatus.PENDING;
                            item.update_by = user;
                            item.update_dt = currentDateTime;
                        }
                    }

                }
                else if (ObjectAction.CANCEL.EqualsIgnore(action))
                {
                    foreach (var item in jobOrders)
                    {
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            var job_order = new job_order() { guid = item.guid };
                            context.job_order.Attach(job_order);
                            job_order.status_cv = JobStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }
                }
                else if (ObjectAction.ROLLBACK.EqualsIgnore(action))
                {
                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        job_order.status_cv = JobStatus.PENDING;
                        job_order.update_by = user;
                        job_order.update_dt = currentDateTime;
                    }
                }
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "JobOrderHandling failed for processType: {ProcessType}, action: {Action}", processType, action);
                throw;
            }
        }

        public static async Task JobOrderHandling_Bk(ApplicationServiceDBContext context, string processType, string user, long currentDateTime, string action, string? processGuid = "", List<job_order>? jobOrders = null)
        {
            try
            {
                if (ObjectAction.APPROVE.EqualsIgnore(action))
                {
                    string partTableName = "";
                    string processGuidName = "";

                    switch (processType.ToLower())
                    {
                        case "cleaning":
                            partTableName = "cleaning";
                            processGuidName = "guid";
                            break;
                        case "steaming":
                            partTableName = "steaming_part";
                            processGuidName = "steaming_guid";
                            break;
                        case "residue":
                            partTableName = "residue_part";
                            processGuidName = "residue_guid";
                            break;
                        case "repair":
                            partTableName = "repair_part";
                            processGuidName = "repair_guid";
                            break;
                    }

                    if (partTableName != "")
                    {
                        var sqlQuery = "";
                        if (partTableName == "cleaning")
                        {
                            sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
                                            SELECT job_order_guid FROM {partTableName} 
                                            WHERE {processGuidName} = '{processGuid}' AND delete_dt IS NULL)";
                        }
                        else
                        {
                            sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
                                            SELECT job_order_guid FROM {partTableName} 
                                            WHERE {processGuidName} = '{processGuid}' AND approve_part = 1 AND delete_dt IS NULL)";
                        }

                        var jobOrderList = await context.job_order.FromSqlRaw(sqlQuery).ToListAsync();

                        foreach (var item in jobOrderList)
                        {
                            if (item != null && JobStatus.CANCELED.EqualsIgnore(item.status_cv))
                            {
                                item.status_cv = JobStatus.PENDING;
                                item.update_by = user;
                                item.update_dt = currentDateTime;
                            }
                        }
                    }
                }
                else if (ObjectAction.CANCEL.EqualsIgnore(action))
                {
                    foreach (var item in jobOrders)
                    {
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            var job_order = new job_order() { guid = item.guid };
                            context.job_order.Attach(job_order);
                            job_order.status_cv = JobStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }
                }
                else if (ObjectAction.ROLLBACK.EqualsIgnore(action))
                {
                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        job_order.status_cv = JobStatus.PENDING;
                        job_order.update_by = user;
                        job_order.update_dt = currentDateTime;
                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static double CalculateMaterialCostRoundedUp(double? materialCost)
        {
            if (materialCost == 0.0)
                return 0.0;

            double result = Math.Ceiling(Convert.ToDouble(materialCost * 20)) / 20.0;
            return result;
        }

        public static async Task<bool> StatusChangeConditionCheck_BK(ApplicationServiceDBContext context, string processType, string processGuid, string newStatus)
        {
            try
            {
                string partTableName = "";
                string processGuidName = "";

                switch (processType.ToLower())
                {
                    case "cleaning":
                        partTableName = "cleaning";
                        processGuidName = "guid";
                        break;
                    case "steaming":
                        partTableName = "steaming_part";
                        processGuidName = "steaming_guid";
                        break;
                    case "residue":
                        partTableName = "residue_part";
                        processGuidName = "residue_guid";
                        break;
                    case "repair":
                        partTableName = "repair_part";
                        processGuidName = "repair_guid";
                        break;
                }

                if (!string.IsNullOrEmpty(partTableName))
                {
                    string sqlQuery = "";
                    if (partTableName == "cleaning")
                    {
                        sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
                                            SELECT distinct job_order_guid FROM {partTableName} 
                                            WHERE {processGuidName} = '{processGuid}' AND delete_dt IS NULL);";
                    }
                    else
                    {
                        sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
                                        SELECT distinct job_order_guid FROM {partTableName} 
                                        WHERE {processGuidName} = '{processGuid}' AND approve_part = 1 AND delete_dt IS NULL);";
                    }

                    var jobOrderList = await context.job_order.FromSqlRaw(sqlQuery).AsNoTracking().ToListAsync();
                    


                    if (jobOrderList?.Any() == true & !jobOrderList.Any(j => j == null))
                    {
                        bool allValid = false;
                        if (newStatus.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS))
                        {
                            allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
                                                            jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));
                        }
                        else if (newStatus.EqualsIgnore(CurrentServiceStatus.COMPLETED))
                        {
                            allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
                                jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED));

                            // If all are canceled, set allValid to false
                            if (allValid && jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED)))
                            {
                                allValid = false;
                            }
                        }
                        return allValid;
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static async Task<bool> StatusChangeConditionCheck(ApplicationServiceDBContext context, string processType, string processGuid, string newStatus)
        {
            try
            {
                //string partTableName = "";
                //string processGuidName = "";

                var pt = processType.ToLowerInvariant();
                IQueryable<job_order>? query = pt switch
                {
                    "cleaning" =>
                        from jo in context.job_order.AsNoTracking()
                        join c in context.cleaning.AsNoTracking() on jo.guid equals c.job_order_guid
                        where jo.delete_dt == null
                              && c.delete_dt == null
                              && c.guid == processGuid
                        select jo,

                    "steaming" =>
                        from jo in context.job_order.AsNoTracking()
                        join s in context.steaming_part.AsNoTracking() on jo.guid equals s.job_order_guid
                        where jo.delete_dt == null
                              && s.delete_dt == null
                              && s.steaming_guid == processGuid
                              && s.approve_part == true  // bool? comparison; null treated as not approved
                        select jo,

                    "residue" =>
                        from jo in context.job_order.AsNoTracking()
                        join r in context.residue_part.AsNoTracking() on jo.guid equals r.job_order_guid
                        where jo.delete_dt == null
                              && r.delete_dt == null
                              && r.residue_guid == processGuid
                              && r.approve_part == true
                        select jo,

                    "repair" =>
                        from jo in context.job_order.AsNoTracking()
                        join rp in context.repair_part.AsNoTracking() on jo.guid equals rp.job_order_guid
                        where jo.delete_dt == null
                              && rp.delete_dt == null
                              && rp.repair_guid == processGuid
                              && rp.approve_part == true
                        select jo,

                    _ => null
                };

                if (query is null)
                {
                    _logger?.LogError("Invalid process type provided: {ProcessType}", processType);
                    throw new Exception($"Invalid process type: {processType}");
                }

                var jobOrderList = await query.Distinct().ToListAsync();
                if (jobOrderList?.Any() == true & !jobOrderList.Any(j => j == null))
                {
                    bool allValid = false;
                    if (newStatus.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS))
                    {
                        allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
                                                        jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));
                    }
                    else if (newStatus.EqualsIgnore(CurrentServiceStatus.COMPLETED))
                    {
                        allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
                            jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED));

                        // If all are canceled, set allValid to false
                        if (allValid && jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.CANCELED)))
                        {
                            allValid = false;
                        }
                    }
                    return allValid;
                }

                return true;
            }
            catch (Exception ex)
            {
                _logger?.LogError(ex, "StatusChangeConditionCheck failed for processType: {ProcessType}, processGuid: {ProcessGuid}, newStatus: {NewStatus}", processType, processGuid, newStatus);
                throw;
            }
        }

        public static async Task<bool> TankMovementConditionCheck(ApplicationServiceDBContext context, string user, long currentDateTime, string sotGuid, string processGuid = "", ILogger? logger = null)
        {

            //first check tank purpose
            var tank = await context.storing_order_tank.Where(t => t.guid == sotGuid & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
            if (tank != null)
            {
                var completedStatuses = new[] { CurrentServiceStatus.COMPLETED, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };
                var qcCompletedStatuses = new[] { CurrentServiceStatus.QC, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };

                //check if tank have any steaming purpose
                if (tank.purpose_steam ?? false)
                {
                    var res = await context.steaming.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    if (res.Any())
                    {
                        if (res.Any(t => !completedStatuses.Contains(t.status_cv)))
                        {
                            tank.tank_status_cv = TankMovementStatus.STEAM;
                            goto ProceesUpdate;
                        }
                    }
                }

                //check if tank have any cleaning purpose
                if (tank.purpose_cleaning ?? false)
                {
                    var cleaningTasks = await context.cleaning.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    var residueTasks = await context.residue.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();

                    // Check if any cleaning or residue tasks exist and have pending statuses
                    bool hasPendingTasks = cleaningTasks.Any(t => !completedStatuses.Contains(t.status_cv))
                                            || residueTasks.Any(t => !completedStatuses.Contains(t.status_cv));
                    if (hasPendingTasks)
                    {
                        tank.tank_status_cv = TankMovementStatus.CLEANING;
                        goto ProceesUpdate;
                    }
                }

                //check if tank have any repair purpose
                if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                {
                    var res = await context.repair.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    if (res.Any())
                    {
                        if (res.Any(t => !qcCompletedStatuses.Contains(t.status_cv)))
                        {
                            tank.tank_status_cv = TankMovementStatus.REPAIR;
                            goto ProceesUpdate;
                        }
                        else
                        {
                            if (AnyJobInProgress(context, processGuid))
                            {
                                tank.tank_status_cv = TankMovementStatus.REPAIR;
                                goto ProceesUpdate;
                            }
                        }
                    }
                    else
                    {
                        tank.tank_status_cv = TankMovementStatus.REPAIR;
                        goto ProceesUpdate;
                    }
                }

                if (true) //(tank.purpose_storage ?? false)
                {
                    tank.tank_status_cv = TankMovementStatus.STORAGE;
                }

            ProceesUpdate:
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                var ret = await context.SaveChangesAsync();
                _logger?.LogInformation("TankMovementConditionCheck updated tank {SotGuid} to status {TankStatus}", sotGuid, tank.tank_status_cv);
                return true;
            }
            return false;
        }

        private static bool AnyJobInProgress(ApplicationServiceDBContext context, string processGuid)
        {
            if (string.IsNullOrWhiteSpace(processGuid))
                return false;

            return context.job_order
                 .AsNoTracking()
                 .Where(j => j.delete_dt == null)
                 .Where(j => context.repair_part
                     .Any(rp =>
                         rp.repair_guid == processGuid &&
                         rp.approve_part == true &&
                         rp.delete_dt == null &&
                         rp.job_order_guid == j.guid))
                 .Any(j => j.status_cv.Equals(CurrentServiceStatus.JOB_IN_PROGRESS));
        }

        private static bool AnyJobInProgress_bk(ApplicationServiceDBContext context, string processGuid)
        {
            string sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
                                        SELECT distinct job_order_guid FROM repair_part 
                                        WHERE repair_guid = '{processGuid}' AND approve_part = 1 AND delete_dt IS NULL);";

            var jobOrderList = context.job_order.FromSqlRaw(sqlQuery).AsNoTracking().ToList();
            if (jobOrderList?.Any() == true & !jobOrderList.Any(j => j == null))
            {
                bool pendingJob = false;
                pendingJob = jobOrderList.Any(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));

                return pendingJob;
            }
            return false;
        }
    }
}
