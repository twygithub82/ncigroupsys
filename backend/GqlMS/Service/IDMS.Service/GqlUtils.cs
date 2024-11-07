using HotChocolate;
using IDMS.Models.Notification;
using Microsoft.AspNetCore.Http;
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
    }
}
