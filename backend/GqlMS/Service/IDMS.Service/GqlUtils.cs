using HotChocolate;
using IDMS.Models.Notification;
using IDMS.Models.Service.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
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
    }
}
