using MySqlConnector;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace IDMS.Master.Application
{
    public static class GqlUtils
    {
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
    }
}
