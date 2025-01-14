using HotChocolate;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using Newtonsoft.Json.Linq;
using System.Security.Claims;

namespace IDMS.Billing.Application
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

        public static async void PingThread(IServiceScope scope, int duration)
        {
            Thread t = new Thread(async () =>
            {
                using (scope)
                {
                    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationMasterDBContext>>();

                    // Create a new instance of ApplicationPackageDBContext
                    using (var dbContext = await contextFactory.CreateDbContextAsync())
                    {
                        while (true)
                        {

                            //Task.Run(async() =>
                            //{

                            await dbContext.Database.OpenConnectionAsync();
                            await dbContext.currency.Where(c => c.currency_code == "SGD").Select(c => c.guid).FirstOrDefaultAsync();
                            await dbContext.Database.CloseConnectionAsync();

                            //});
                            Thread.Sleep(1000 * 60 * duration);
                        }

                    }
                }
            });
            t.Start();
        }
    }
}
