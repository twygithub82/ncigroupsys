using CommonUtil.Core.Service;
using HotChocolate.Language;
using IDMS.Models;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGate.GqlTypes
{
    internal class GqlUtils
    {
        public static long GetNowEpochInSec()
        {
            DateTimeOffset now = DateTimeOffset.UtcNow;

            // Get the epoch time
            return now.ToUnixTimeSeconds();
        }


        public static async Task<JToken> RunNonQueryCommands([Service] IConfiguration config, List<string> commands)
        {
            JToken data = null;
            try
            {

                string urlApi_querydata = $"{config["DBService:NonQueriesUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(commands);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);

                }
                else
                {
                    throw new GraphQLException(new Error("Run NonQuery Command", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }

        public static async Task<JToken> RunNonQueryCommand([Service] IConfiguration config, string command)
        {
            JToken data = null;
            try
            {

                string urlApi_querydata = $"{config["DBService:NonQueryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(command);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);

                }
                else
                {
                    throw new GraphQLException(new Error("Run NonQuery Command", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }

        public static async Task<JToken> QueryData([Service] IConfiguration config, string querystatement)
        {
            JToken data = null;
            try
            {
                string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(querystatement);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);

                }
                else
                {
                    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }
        public static string IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string uid = "";
            try
            {
                var isCheckAuthorization = Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";

                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirstValue(ClaimTypes.GroupSid);
                uid = authUser.FindFirstValue(ClaimTypes.Name);
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

        public static string GetCodeValue(ApplicationInventoryDBContext dbContext, string guid)
        {
            string retval = "";
            try
            {
                if (dbContext != null)
                {
                    var cv = dbContext.code_values.Find(guid);
                    if (cv != null)
                    {
                        retval = $"{cv.code_val}";
                    }
                }

            }
            catch
            {
                throw;
            }
            return retval;
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
                            event_dt = GqlUtils.GetNowEpochInSec(),
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


        public static async Task AddAndTriggerStaffNotification([Service] IConfiguration config, int id, string module_cv, string message)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var mutation = @"
                    mutation($message: notificationInput!) {
                        addNotification(newNotification: $message) {
                  
                        }
                    }";

                    // Define the variables for the query
                    var variables = new
                    {
                        message = new
                        {
                            id = id,
                            module_cv = module_cv,
                            message = message,
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
            }
            catch (Exception ex)
            { }
        }
    }
}
