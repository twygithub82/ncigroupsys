using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using System.Configuration;
using System.Data.Common;
using System.Diagnostics.Contracts;
using System.Globalization;

namespace IDMS.BatchJob.Service
{
    internal class Program
    {
        static string filePath = "./Config/app_config.json";
        static string dbConnection;
        static MySqlConnection? conn1;

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
            Console.WriteLine("Done. Press any key to exit");
            Console.ReadLine();
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
                dbConnection = $"{configuration?.SelectToken("ConnectionStrings.DefaultConnection")?.ToString()}";
                await CheckDescrepancy(configuration, dbConnection);
                //await CheckBookingDescrepancy(configuration, dbConnection);

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
                dbConnection = $"{configuration?.SelectToken("ConnectionStrings.DefaultConnection")?.ToString()}";
                await CheckDescrepancy(configuration, dbConnection, dateInput);
                //await CheckBookingDescrepancy(configuration, dbConnection, dateInput);

            }
            catch (Exception ex)
            {
                string errMsg = ex.Message;
                throw (ex);
            }
        }

        private static async Task<List<JToken>> CheckDescrepancy(JToken config, string dbConnection, string date = "")
        {
            Console.WriteLine("Booking_Scheduling_CrossCheck...");

            var conn = new MySqlConnection(dbConnection);
            await conn.OpenAsync();

            string BOOKTYPE = "RELEASE_ORDER";
            string STATUS_NEW = "NEW";
            string STATUS_EDIT = "EDIT";
            string dateInput = string.IsNullOrEmpty(date) ? "NOW()" : $"'{date}'";

            string sqlBooking = $"SELECT sot.tank_no, b.guid, b.book_type_cv, b.booking_dt as scheduling_dt, b.sot_guid FROM booking b " +
                $"LEFT JOIN storing_order_tank sot on (sot.guid = b.sot_guid) " +
                $"WHERE (b.status_cv = '{STATUS_NEW}' OR b.status_cv = '{STATUS_EDIT}') " +
                $"AND (b.delete_dt is null or b.delete_dt = 0) ";
                //$"AND b.sot_guid in ('sot1', 'sot2', 'sot3')";
            //$"AND create_dt <= UNIX_TIMESTAMP({dateInput}) " +
            //$"AND create_dt < UNIX_TIMESTAMP({dateInput} + INTERVAL 1 DAY) " +
            //"AND sot_guid NOT IN " +
            //"(SELECT sc.sot_guid FROM scheduling sc WHERE (sc.delete_dt is null or sc.delete_dt = 0) " +
            //"AND sc.create_dt >= UNIX_TIMESTAMP(CURDATE()) " +
            //"AND sc.create_dt < UNIX_TIMESTAMP(CURDATE() + INTERVAL 1 DAY)" +
            //")";

            var bookingList = new List<JToken>();
            var bookDupList = new List<JToken>();
            using (var cmd = new MySqlCommand(sqlBooking, conn))
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
                        bookingList.Add(row);
                        bookDupList.Add(row.DeepClone());
                    }
                }
            }

            var bookingSOTList = bookingList.Select(x => x.SelectToken("sot_guid")).ToList();

            // Create a formatted string with each item surrounded by quotes
            string formattedSOTList = $"({string.Join(", ", bookingSOTList.ConvertAll(item => $"\"{item}\""))})";


            string sqlScheduling = "SELECT sot.tank_no, sch.guid, sch.book_type_cv, sch.scheduling_dt, ss.sot_guid FROM scheduling sch " +
                            $"LEFT JOIN scheduling_sot ss ON (ss.scheduling_guid = sch.guid) " +
                            $"LEFT JOIN storing_order_tank sot on (sot.guid = ss.sot_guid) " +
                            $"WHERE (sch.status_cv = '{STATUS_NEW}' OR sch.status_cv = '{STATUS_EDIT}') " +
                            $"AND (sch.delete_dt is null OR sch.delete_dt = 0) ";
                            //$"AND ss.sot_guid in ('sot1', 'sot2')";

            var schedulingList = new List<JToken>();
            var schedulingDupList = new List<JToken>();
            using (var cmd = new MySqlCommand(sqlScheduling, conn))
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
                        schedulingList.Add(row);
                        schedulingDupList.Add(row.DeepClone());
                    }
                }
            }

            Console.WriteLine($"{bookingList.Count} new record from booking");
            Console.WriteLine($"{schedulingList.Count} new record from scheduling");

            if(bookingList.Count > 0 || schedulingList.Count > 0)
            {
                RecordDescrepancyCheck(bookingList, schedulingList, bookDupList, schedulingDupList, config);
                conn.Close();
                return bookingList;
            }
            conn.Close();
            return new List<JToken>();
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
                Console.WriteLine($"Found Descrepancy {notification_uid}, send notification...");
                await Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-booking", "missing booking", notification_uid);
            }

            return result;
        }

        private static async void RecordDescrepancyCheck(List<JToken> bookingList, List<JToken> schedulingList, 
            List<JToken> oriBookingList, List<JToken> oriSchedulingList, JToken config)
        {
            try
            {
                string url = config.SelectToken("Setting.notificationUrl").ToString();

                List<JObject> bookingObjects = bookingList.OfType<JObject>().ToList();
                foreach (var obj in bookingObjects)
                {
                    obj.Remove("guid");
                    //obj.Remove("sot_guid");
                    obj.Remove("scheduling_dt");
                    //obj.Remove("reference");
                }

                List<JObject> schedulingObjects = schedulingList.OfType<JObject>().ToList();
                foreach (var obj in schedulingObjects)
                {
                    obj.Remove("guid");
                    //obj.Remove("sot_guid");
                    obj.Remove("scheduling_dt");
                    //obj.Remove("reference");
                }

                var sortedBookingList = bookingObjects.OrderBy(token => token.ToString()).ToList();
                var sortedSchedulingList = schedulingObjects.OrderBy(token => token.ToString()).ToList();

                // Identify missing items
                var missingInScheduling = sortedBookingList.Except(sortedSchedulingList, new JTokenEqualityComparer()).ToList();
                var missingInBooking = sortedSchedulingList.Except(sortedBookingList, new JTokenEqualityComparer()).ToList();

                if (missingInBooking.Any() || missingInScheduling.Any())
                    Console.WriteLine("----Missing Records-----");

                foreach (var item in missingInBooking)
                {
                    var tankNo = item.SelectToken("tank_no");
                    Console.WriteLine($"Commercial forgot to book : {tankNo} for {item.SelectToken("book_type_cv")}");
                    string notification_uid = $"cc-booking-{tankNo}";
                    await Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-booking", $"Commercial forgot to book:{tankNo}", notification_uid);
                }

                foreach (var item in missingInScheduling)
                {
                    var tankNo = item.SelectToken("tank_no");
                    Console.WriteLine($"Operation forgot to schedule : {tankNo} for {item.SelectToken("book_type_cv")}");
                    string notification_uid = $"cc-scheduling-{tankNo}";
                    await Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-scheduling", $"Operation forgot to schedule:{tankNo}", notification_uid);
                }

                MatchCheck(sortedBookingList, sortedSchedulingList, oriBookingList, oriSchedulingList, url);

                await Task.Delay(1);
            }
            catch (Exception ex)
            {
                throw ex;
            }
       
        }

        private static bool ContainsPartial(JObject source, JObject reference)
        {
            // Get all key-value pairs from the reference JObject
            foreach (var property in reference.Properties())
            {
                // Check if the source JObject contains the key and has the same value
                if (!source.TryGetValue(property.Name, out var value) || !JToken.DeepEquals(value, property.Value))
                {
                    return false;
                }
            }
            return true;
        }

        private static void MatchCheck(List<JObject> sortedBookingList, List<JObject> sortedSchedulingList, 
            List<JToken> oriBookingList, List<JToken> oriSchedulingList, string url)
        {

            try
            {
                List<JToken> bookingCommonList = new List<JToken>();
                List<JToken> schedulingCommonList = new List<JToken>();
                List<JToken> schedulingSOTList = new List<JToken>();    

                var commonInList = sortedBookingList.Intersect(sortedSchedulingList, new JTokenEqualityComparer()).ToList();
                foreach (var item in commonInList)
                {
                    bookingCommonList.Add(oriBookingList.Where(obj => ContainsPartial((JObject)obj, (JObject)item)).FirstOrDefault());
                    schedulingCommonList.Add(oriSchedulingList.Where(obj => ContainsPartial((JObject)obj, (JObject)item)).FirstOrDefault());
                }

                //List<JToken> schedulingMatchedList = new List<JToken>();
                //var commonInScheduling = sortedSchedulingList.Intersect(sortedBookingList, new JTokenEqualityComparer()).ToList();
                //foreach (var item in commonInScheduling)
                //{
                //    schedulingMatchedList.Add(oriSchedulingList.Where(obj => ContainsPartial((JObject)obj, (JObject)item)).FirstOrDefault());
                //}

                List<string> bookingMatchedGuid = new List<string>();
                List<string> schedulingMatchedGuid = new List<string>();

                foreach (var item in bookingCommonList)
                {
                    var tankNo = item.SelectToken("tank_no");
                    var sotGuid = item.SelectToken("sot_guid");
                    var bookType = item.SelectToken("book_type_cv");
                    var dateTime = item.SelectToken("scheduling_dt");

                    var result = schedulingCommonList.Where(s => s.SelectToken("sot_guid").Equals(sotGuid) &&
                                (s.SelectToken("book_type_cv").Equals(bookType)) &&
                                (s.SelectToken("scheduling_dt").Equals(dateTime))).FirstOrDefault();

                    if (result != null)
                    {
                        //Found Matched
                        Console.WriteLine($"---record tally---");
                        Console.WriteLine($"Set Matched for booking {tankNo} -- {bookType} -- Date {dateTime}");
                        Console.WriteLine($"Set Matched for scheduling {result.SelectToken("tank_no")} -- {item.SelectToken("book_type_cv")} -- Date {item.SelectToken("scheduling_dt")}");
                        bookingMatchedGuid.Add(item.SelectToken("guid").ToString());
                        schedulingMatchedGuid.Add(result.SelectToken("guid").ToString());
                        schedulingSOTList.Add(result);
                    }
                    else
                    {
                        //Not Tally found
                        Console.WriteLine($"---record not tally---");
                        Console.WriteLine($"Record in booking {tankNo} -- {bookType} -- Date {dateTime}");

                        JObject checkItem = (JObject)item;
                        checkItem.Remove("guid");
                        checkItem.Remove("scheduling_dt");

                        var sch = schedulingCommonList.Where(obj => ContainsPartial((JObject)obj, checkItem)).FirstOrDefault();
                        Console.WriteLine($"Record in scheduling {sch.SelectToken("tank_no")} -- {sch.SelectToken("book_type_cv")} -- Date {sch.SelectToken("scheduling_dt")}");
                        string notification_uid = $"cc-scheduling-{tankNo}";
                        Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-scheduling", $"scheduling record for {tankNo} not tally with booking", notification_uid);

                        string notification_uid_bk = $"cc-booking-{tankNo}";
                        Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-booking", $"booking record for {tankNo} not tally with scheduling", notification_uid_bk);
                    }
                }

                if (bookingMatchedGuid.Count > 0)
                    UpdateRecord(bookingMatchedGuid, "booking");

                if (schedulingSOTList.Count > 0)
                    UpdateRecordSchedulingSOT(schedulingSOTList, "scheduling_sot");

                //List<string> schedulingMatchedGuid = new List<string>();
                //foreach (var item in schedulingCommonList)
                //{
                //    var tankNo = item.SelectToken("tank_no");
                //    var sotGuid = item.SelectToken("sot_guid");
                //    var bookType = item.SelectToken("book_type_cv");
                //    var dateTime = item.SelectToken("scheduling_dt");

                //    var result = bookingCommonList.Where(s => s.SelectToken("sot_guid").Equals(sotGuid) &&
                //                (s.SelectToken("book_type_cv").Equals(bookType)) &&
                //                (s.SelectToken("scheduling_dt").Equals(dateTime))).FirstOrDefault();

                //    if (result != null)
                //    {
                //        //Found Matched
                //        Console.WriteLine($"---record tally---");
                //        Console.WriteLine($"Set Matched for scheduling {tankNo} -- {bookType} -- Date{dateTime}");
                //        //Console.WriteLine($"Set Matched for scheduling {result.SelectToken("tank_no")} -- {item.SelectToken("book_type_cv")} -- Date{item.SelectToken("scheduling_dt")}");
                //        schedulingMatchedGuid.Add(result.SelectToken("guid").ToString());
                //    }
                //    else
                //    {
                //        //Not Tally found
                //        Console.WriteLine($"---record not tally---");
                //        //Console.WriteLine($"booking record for {tankNo} not tally with scheduling");
                //        Console.WriteLine($"scheduling record for {tankNo} not tally with booking");

                //        string notification_uid = $"cc-scheduling-{tankNo}";
                //        //Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-scheduling", $"scheduling record for {tankNo} not tally with booking", notification_uid);

                //        //string notification_uid_bk = $"cc-booking-{tankNo}";
                //        //Utils.AddAndTriggerStaffNotification(url, 3, "cross-check-booking", $"booking record for {tankNo} not tally with scheduling", notification_uid_bk);
                //    }
                //}
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static void UpdateRecord(List<string> guids, string tableName)
        {
            try
            {
                string idsList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));
                string MATCHED_STATUS = "MATCH";
                string USER = "system";
                DateTimeOffset now = DateTimeOffset.UtcNow;
                // Get the epoch time
                long currentDateTime = now.ToUnixTimeSeconds();

                string sql = $"UPDATE {tableName} SET status_cv = '{MATCHED_STATUS}', update_dt = {currentDateTime}, update_by = '{USER}' WHERE guid in ({idsList})";
                var conn = new MySqlConnection(dbConnection);
                conn.Open();

                using (var cmd = new MySqlCommand(sql, conn))
                {
                    var res = cmd.ExecuteNonQuery();
                }
                conn.Close();
            }
            catch (Exception ex) 
            {
                //conn?.Close();
                throw ex;
            }

        }


        private async static void UpdateRecordSchedulingSOT(List<JToken> items, string tableName)
        {
            try 
            {
                List<JToken> schedulingSot = new List<JToken>();
             
                var conn = new MySqlConnection(dbConnection);
                await conn.OpenAsync();

                var schGuids = items.Select(i => i.SelectToken("guid")).DistinctBy(i => i.SelectToken("guid")).ToList();

                foreach(JToken itm in schGuids)
                {
                    string sqlSelect = $"SELECT * FROM scheduling_sot WHERE scheduling_guid = '{itm?.ToString()}' AND (delete_dt is null OR delete_dt = 0)";
                    using (var cmd = new MySqlCommand(sqlSelect, conn))
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
                                schedulingSot.Add(row);
                                //bookDupList.Add(row.DeepClone());
                            }
                        }
                    }

                    int count = 0;
                    List<string> guidToBeUpdated = new List<string>();
                    foreach (JToken item in items)
                    {
                        var guid = item.SelectToken("guid").ToString();
                        var sot_guid = item.SelectToken("sot_guid").ToString();
                        var res = schedulingSot.Where(s => s.SelectToken("sot_guid").ToString() == sot_guid & s.SelectToken("scheduling_guid").ToString() == guid).FirstOrDefault();
                        if (res != null)
                        {
                            count++;
                            guidToBeUpdated.Add(res.SelectToken("guid").ToString());
                        }
                    }

                    string MATCHED_STATUS = "MATCH";
                    string USER = "system";
                    DateTimeOffset now = DateTimeOffset.UtcNow;
                    long currentDateTime = now.ToUnixTimeSeconds();
                    if (guidToBeUpdated.Count > 0)
                    {
                        string idsList = string.Join(", ", guidToBeUpdated.ConvertAll(id => $"'{id}'"));
                        string sql = $"UPDATE scheduling_sot SET status_cv = '{MATCHED_STATUS}', update_dt = {currentDateTime}, update_by = '{USER}' WHERE guid in ({idsList})";
                        using (var cmd = new MySqlCommand(sql, conn))
                        {
                            var res = cmd.ExecuteNonQuery();
                        }
                    }

                    if (count == schedulingSot.Count)
                    {
                        //All member of the same scheduling guid group have been matched
                        string sql = $"UPDATE scheduling_sot SET status_cv = '{MATCHED_STATUS}', update_dt = {currentDateTime}, update_by = '{USER}' WHERE guid = '{itm?.ToString()}'";
                        using (var cmd = new MySqlCommand(sql, conn))
                        {
                            var res = cmd.ExecuteNonQuery();
                        }
                    }
                }

   
                
            
                //string MATCHED_STATUS = "MATCHED";
                //string USER = "system";
                //DateTimeOffset now = DateTimeOffset.UtcNow;
                //// Get the epoch time
                //long currentDateTime = now.ToUnixTimeSeconds();

                //string sql = $"UPDATE {tableName} SET status_cv = '{MATCHED_STATUS}', update_dt = {currentDateTime}, update_by = '{USER}' WHERE guid in ({idsList})";
                //conn = new MySqlConnection(dbConnection);
                //conn.Open();

                //using (var cmd = new MySqlCommand(sql, conn))
                //{
                //    var res = cmd.ExecuteNonQuery();
                //}
            }
            catch (Exception ex)
            {
                //conn?.Close();
                throw ex;
            }

        }



    }
}
