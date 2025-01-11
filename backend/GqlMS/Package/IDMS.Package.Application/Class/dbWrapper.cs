using CommonUtil.Core.Service;
using IDMS.Models.DB;
using Microsoft.EntityFrameworkCore;
using MySqlConnector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text.Json;

namespace IDMS.Parameter.CleaningProcedure.Class
{
    public class dbWrapper
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
                //var sqlStatement = JsonConvert.SerializeObject( "select * from param_values where param_val_type='JWT_SECRET_KEY'");
                //var (status, resultstring) = await Util.RestCallAsync(urlQueryApi, HttpMethod.Post, sqlStatement);
                //if(status==System.Net.HttpStatusCode.OK)
                //{
                //    var result = JToken.Parse(resultstring);
                //    if(result["result"]?.Count() == 0)
                //    {
                //        return secretkey;
                //    }

                //    secretkey = $"{result["result"][0]["param_val"]}";
                //}

            }
            catch
            {
                throw;
            }

            return secretkey;
        }

        public static async void PingThread(IServiceScope scope, int duration)
        {
            Thread t = new Thread(async () =>
            {
                using (scope)
                {
                    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationPackageDBContext>>();

                    // Create a new instance of ApplicationPackageDBContext
                    using (var dbContext = await contextFactory.CreateDbContextAsync())
                    {
                        while (true)
                        {

                            //Task.Run(async() =>
                            //{

                            await dbContext.Database.OpenConnectionAsync();
                            //    // You can perform other operations here if needed
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
