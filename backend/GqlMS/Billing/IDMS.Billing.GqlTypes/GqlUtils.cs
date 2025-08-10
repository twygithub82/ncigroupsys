using HotChocolate;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using Newtonsoft.Json.Linq;
using System.Globalization;
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
                if (primarygroupSid == null)
                    primarygroupSid = authUser.FindFirst("groupsid")?.Value;
                uid = authUser.FindFirst(ClaimTypes.Name)?.Value;
                if (uid == null)
                    uid = authUser.FindFirst("name").Value;
                if (primarygroupSid != "s1")
                {
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }

            }
            catch (Exception ex)
            {
                throw new Exception("Unauthorized - " + ex.Message);
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


        public static async Task<List<string>> GenerateWeeklyColumns(int year, int month)
        {
            if (month < 1 || month > 12)
            {
                throw new ArgumentOutOfRangeException(nameof(month), "Month must be between 1 and 12.");
            }

            var result = new List<string>();
            var firstDayOfMonth = new DateTime(year, month, 1);
            var lastDayOfMonth = firstDayOfMonth.AddMonths(1).AddDays(-1);

            var calendar = CultureInfo.CurrentCulture.Calendar;
            var currentWeek = calendar.GetWeekOfYear(firstDayOfMonth, CalendarWeekRule.FirstDay, DayOfWeek.Monday); // Assuming Monday is the first day of the week

            var currentDate = firstDayOfMonth;
            while (currentDate <= lastDayOfMonth)
            {
                var weekStart = GetWeekStartDate(currentDate, calendar);
                var weekEnd = weekStart.AddDays(6);

                // Handle week spanning across year boundaries
                if (weekStart.Year != year && weekEnd.Year == year)
                {
                    weekStart = new DateTime(year, 1, 1);
                }
                else if (weekEnd.Year != year && weekStart.Year == year)
                {
                    weekEnd = new DateTime(year, 12, 31);
                }

                // Handle week 53 spanning across year boundaries
                if (weekStart.Year != year && weekEnd.Year != year)
                {
                    if (calendar.GetWeekOfYear(weekStart, CalendarWeekRule.FirstDay, DayOfWeek.Monday) == 53)
                    {
                        weekStart = GetWeekStartDate(new DateTime(weekStart.Year, 12, 31), calendar);
                    }
                }

                var weekStartFormatted = weekStart.ToString("dd MMM", CultureInfo.InvariantCulture);
                var weekEndFormatted = weekEnd.ToString("dd MMM", CultureInfo.InvariantCulture);

                result.Add($"WK-{currentWeek:00} ({weekStartFormatted}-{weekEndFormatted})");

                currentDate = weekEnd.AddDays(1);
                currentWeek = calendar.GetWeekOfYear(currentDate, CalendarWeekRule.FirstDay, DayOfWeek.Monday);
            }

            // Handle the last week of the previous year if it's in the selected month
            if (calendar.GetWeekOfYear(firstDayOfMonth.AddDays(-1), CalendarWeekRule.FirstDay, DayOfWeek.Monday) !=
                calendar.GetWeekOfYear(firstDayOfMonth, CalendarWeekRule.FirstDay, DayOfWeek.Monday))
            {
                var lastWeekOfYear = new DateTime(year - 1, 12, 31);
                var lastWeekStart = GetWeekStartDate(lastWeekOfYear, calendar);
                var lastWeekEnd = lastWeekStart.AddDays(6);

                if (lastWeekEnd >= firstDayOfMonth)
                {
                    var lastWeekStartFormatted = lastWeekStart.ToString("dd MMM", CultureInfo.InvariantCulture);
                    var lastWeekEndFormatted = lastWeekEnd.ToString("dd MMM", CultureInfo.InvariantCulture);
                    var lastWeekNumber = calendar.GetWeekOfYear(lastWeekOfYear, CalendarWeekRule.FirstDay, DayOfWeek.Monday);

                    result.Add($"WK-{lastWeekNumber:00} ({lastWeekStartFormatted}-{lastWeekEndFormatted})");
                }
            }

            result.Sort((a, b) =>
            {
                var weekNumberA = int.Parse(a.Substring(3, 2));
                var weekNumberB = int.Parse(b.Substring(3, 2));
                return weekNumberA.CompareTo(weekNumberB);
            });

            return result;
        }

        private static DateTime GetWeekStartDate(DateTime date, Calendar calendar)
        {
            var dayOfWeek = calendar.GetDayOfWeek(date);
            var diff = (7 + (dayOfWeek - DayOfWeek.Monday)) % 7;
            return date.AddDays(-1 * diff).Date;
        }

        public static double CalculateMaterialCostRoundedUp(double? materialCost)
        {
            if (materialCost == 0.0)
                return 0.0;

            double result = Math.Ceiling(Convert.ToDouble(materialCost * 20)) / 20.0;
            return result;
        }
    }
}
