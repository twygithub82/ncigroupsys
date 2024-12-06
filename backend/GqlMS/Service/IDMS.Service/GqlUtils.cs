using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Notification;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Data.SqlTypes;
using System.Security.Claims;
using System.Text;

namespace IDMS.Service.GqlTypes
{
    public static class GqlUtils
    {
        public static string IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string uid = "";
            try
            {
                var isCheckAuthorization = Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";

                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value;
                uid = authUser.FindFirst(ClaimTypes.Name)?.Value;
                if (primarygroupSid != "s1")
                {
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }

            }
            catch
            {
                throw;
            }
            return uid;
        }

        public static async Task SendJobNotification([Service] IConfiguration config, JobNotification jobNotification, int type)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var query = @"query sendJobNotification($jobNotification: JobNotificationInput!, $type: Int!) 
                                    {sendJobNotification(jobNotification: $jobNotification, type: $type)}";

                    //// Define the variables for the query
                    // Variables for the query
                    var variables = new
                    {
                        jobNotification = jobNotification,
                        type = type  // Dynamic value for type
                    };

                    // Create the GraphQL request payload
                    var requestPayload = new
                    {
                        query = query,
                        variables = variables
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(requestPayload);

                    HttpClient _httpClient = new();
                    string queryStatement = JsonConvert.SerializeObject(query);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var data = await _httpClient.PostAsync(httpURL, content);
                    Console.WriteLine(data);
                }
            }
            catch (Exception ex)
            { }
        }

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


                if (ObjectAction.CANCEL.EqualsIgnore(action))
                {
                    foreach (var item in jobOrders)
                    {
                        var job_order = new job_order() { guid = item.guid };
                        context.job_order.Attach(job_order);
                        if (CurrentServiceStatus.PENDING.EqualsIgnore(item.status_cv))
                        {
                            job_order.status_cv = JobStatus.CANCELED;
                            job_order.update_by = user;
                            job_order.update_dt = currentDateTime;
                        }
                    }
                }
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
                    string sqlQuery = "";
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
                    if (jobOrderList != null && !jobOrderList.Any(j => j == null))
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
    }
}
