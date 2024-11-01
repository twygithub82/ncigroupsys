using CommonUtil.Core.Service;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System.Security.Claims;
using System.Text;

namespace IDMS.StoringOrder.GqlTypes
{
    internal class GqlUtils
    {
        public static bool IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            bool result = false;
            try
            {
                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value; //authUser.FindFirstValue(ClaimTypes.GroupSid);

                //var c = authUser.FindFirst(ClaimTypes.GroupSid).Value;
                if (primarygroupSid != "s1")
                {
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }
            }
            catch
            {
                throw;
            }
            return result;
        }


        public static async Task SendGlobalNotification([Service] IConfiguration config, string eventId, string eventName, int count)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var query = @"
                    query($message: MessageInput!) {
                        sendMessage(message: $message) {
                  
                        }
                    }";

                    // Define the variables for the query
                    var variables = new
                    {
                        message = new
                        {
                            event_id = eventId,
                            event_name = eventName,
                            event_dt = DateTime.Now.ToEpochTime(),
                            count = count

                        }
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
