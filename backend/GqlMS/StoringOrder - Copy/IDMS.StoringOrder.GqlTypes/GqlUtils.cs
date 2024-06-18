using CommonUtil.Core.Service;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Newtonsoft.Json;
using System.Net;
using System.Security.Claims;

namespace IDMS.StoringOrder.GqlTypes
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
    }
}
