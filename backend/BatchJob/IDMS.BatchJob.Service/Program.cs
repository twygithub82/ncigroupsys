using MySql.Data.MySqlClient;
using MySqlX.XDevAPI.Common;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Data.Common;
using System.Globalization;
using static Org.BouncyCastle.Math.EC.ECCurve;
using static System.Net.Mime.MediaTypeNames;

namespace IDMS.BatchJob.Service
{
    internal class Program
    {
        static string filePath = "./Config/app_config.json";

        static async Task Main(string[] args)
        {
            var input = args.Any() ? args[0] : "";
            Console.WriteLine($"Start Batch Job.... input: {input}");

            if (string.IsNullOrEmpty(input))
                await Start();
            else
            {
                if (ValidateDate(args[0]))
                    await Start(args[0]);
                else
                    Console.WriteLine("Invalid Input -- {yyyy-MM-dd}");
            }
               

            // Access the configuration values
            Console.WriteLine("Done.");
        }

        private static bool ValidateDate(string dateStr)
        {
            DateTime date;
            return DateTime.TryParseExact(dateStr, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out date);
        }

        private static async Task Start()
        {
            // Specify the path to your JSON configuration file
          
            try
            {
                using StreamReader streamReader = File.OpenText(filePath);
                var configuration = JToken.Parse(streamReader.ReadToEnd());

                // Deserialize the JSON string into an object
                //var configuration = JToken.Parse("");
                string dbConnection = $"{configuration?.SelectToken("ConnectionStrings.DefaultConnection")?.ToString()}";
                //string mode = $"{configuration?.SelectToken("Setting.Mode")?.ToString().ToLower()}";
                //string dateInput = $"{configuration?.SelectToken("Setting.InputDate")?.ToString()}";

                await CheckSchedulingDescrepancy(configuration, dbConnection);
                await CheckBookingDescrepancy(configuration, dbConnection);

            }
            catch (Exception ex)
            {
                string errMsg = ex.Message;
                throw (ex);
            }
        }

        private static async Task Start(string dateInput)
        {
            // Specify the path to your JSON configuration file
            //string filePath = "./Config/app_config.json";
            try
            {
                using StreamReader streamReader = File.OpenText(filePath);
                var configuration = JToken.Parse(streamReader.ReadToEnd());

                // Deserialize the JSON string into an object
                //var configuration = JToken.Parse("");
                string dbConnection = $"{configuration?.SelectToken("ConnectionStrings.DefaultConnection")?.ToString()}";
                //string mode = $"{configuration?.SelectToken("Setting.Mode")?.ToString().ToLower()}";
                //string dateInput = $"{configuration?.SelectToken("Setting.InputDate")?.ToString()}";

                await CheckSchedulingDescrepancy(configuration, dbConnection,  dateInput);
                await CheckBookingDescrepancy(configuration, dbConnection, dateInput);

            }
            catch (Exception ex)
            {
                string errMsg = ex.Message;
                throw (ex);
            }
        }

        private static async Task<List<JToken>> CheckSchedulingDescrepancy(JToken config, string dbConnection, string date = "")
        {
            MySqlConnection? conn = new MySqlConnection(dbConnection);
            await conn.OpenAsync();

            string BOOKTYPE = "RELEASE_ORDER";
            string STATUS = "CANCELED";
            string dateInput = string.IsNullOrEmpty(date) ? "NOW()" : $"'{date}'";

            string sql = $"SELECT sot_guid FROM booking WHERE book_type_cv = '{BOOKTYPE}' " +
                $"AND status_cv <> '{STATUS}' " +
                "AND (delete_dt is null or delete_dt = 0)  " +
                $"AND create_dt <= UNIX_TIMESTAMP({dateInput}) " +
                //$"AND create_dt < UNIX_TIMESTAMP({dateInput} + INTERVAL 1 DAY) " +
                "AND sot_guid NOT IN " +
                "(SELECT sc.sot_guid FROM scheduling sc WHERE (sc.delete_dt is null or sc.delete_dt = 0) " +
                //"AND sc.create_dt >= UNIX_TIMESTAMP(CURDATE()) " +
                //"AND sc.create_dt < UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY)" +
                ")";

            var result = new List<JToken>();
            using (var cmd = new MySqlCommand(sql, conn))
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new JObject();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = JToken.FromObject(reader.GetValue(i));
                        }
                        result.Add(row);
                    }
                }
            }

            string url = config.SelectToken("Setting.notificationUrl").ToString();
            foreach (var row in result)
            {
                string notification_uid = $"cc-scheduling-{row?.SelectToken("sot_guid")?.ToString()}";
                await Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-scheduling", "missing scheduling", notification_uid);
            }

            return result;
        }

        private static async Task<List<JToken>> CheckBookingDescrepancy(JToken config, string dbConnection, string date = "")
        {
            MySqlConnection? conn = new MySqlConnection(dbConnection);
            await conn.OpenAsync();

            string BOOKTYPE = "RELEASE_ORDER";
            string STATUS = "CANCELED";
            string dateInput = string.IsNullOrEmpty(date) ? "NOW()" : $"'{date}'";

            string sql = "SELECT sc.sot_guid FROM scheduling sc WHERE (sc.delete_dt is null or sc.delete_dt = 0) " +
                $"AND sc.create_dt <= UNIX_TIMESTAMP({dateInput}) " +
                //$"AND sc.create_dt < UNIX_TIMESTAMP({dateInput} + INTERVAL 1 DAY) " +
                "AND sc.sot_guid NOT IN " +
                $"(SELECT bk.sot_guid FROM booking bk WHERE bk.book_type_cv = '{BOOKTYPE}' " +
                $"AND bk.status_cv <> '{STATUS}' " +
                //"AND bk.create_dt >= UNIX_TIMESTAMP(CURDATE()) " +
                //"AND bk.create_dt < UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY) " +
                "AND (bk.delete_dt is null or bk.delete_dt = 0)  " +
                ")";

            var result = new List<JToken>();
            using (var cmd = new MySqlCommand(sql, conn))
            {
                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        var row = new JObject();
                        for (var i = 0; i < reader.FieldCount; i++)
                        {
                            row[reader.GetName(i)] = JToken.FromObject(reader.GetValue(i));
                        }
                        result.Add(row);
                    }
                }
            }
            //TODO :: there is descrepancy, send alert notification
            string url = config.SelectToken("Setting.notificationUrl").ToString();
            foreach (var row in result) 
            {
                string notification_uid = $"cc-booking-{row?.SelectToken("sot_guid")?.ToString()}";
                await Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-booking", "missing booking", notification_uid);
            }
  
            return result;
        }
    }
}
