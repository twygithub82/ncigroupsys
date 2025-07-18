﻿using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Inventory.GqlTypes.LocalModel;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Notification;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MySqlConnector;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Data.Entity;
using System.Net;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;


namespace IDMS.Inventory.GqlTypes
{
    public class GqlUtils
    {

        public static async void PingThread(IServiceScope scope, int duration)
        {
            Thread t = new Thread(async () =>
            {
                using (scope)
                {
                    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationInventoryDBContext>>();

                    // Create a new instance of ApplicationPackageDBContext
                    using (var dbContext = await contextFactory.CreateDbContextAsync())
                    {
                        while (true)
                        {
                            await dbContext.Database.OpenConnectionAsync();
                            //await dbContext.code_values.Where(c => c.guid == "1").Select(c => c.code_val).FirstOrDefaultAsync();
                            await dbContext.currency.Where(c => c.currency_code == "SGD").Select(c => c.guid).FirstOrDefaultAsync();
                            await dbContext.Database.CloseConnectionAsync();
                            Thread.Sleep(1000 * 60 * duration);
                        }
                    }
                }
            });
            t.Start();
        }

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

        public static string IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string? uid = "";
            try
            {
                var isCheckAuthorization = Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";

                var authUser = httpContextAccessor.HttpContext.User;

                uid = authUser.FindFirst(ClaimTypes.Name)?.Value;
                if (uid == null)
                    uid = authUser.FindFirst("name").Value;

                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value;
                if (primarygroupSid == null)
                    primarygroupSid = authUser.FindFirst("groupsid")?.Value;

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

        public static async Task<string> IsAuthorize_R1([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string? uid = "";
            try
            {
                var isCheckAuthorization = Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";


                var authUser = httpContextAccessor.HttpContext.User;

                
                var sessionId = $"{authUser.FindFirst("sessionid")?.Value}";

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
                else
                {
                    var dbSessionId=await GetCurrentSessionId(config, uid);
                    if (sessionId != dbSessionId)
                    {
                        throw new GraphQLException(new Error("Unauthorized", "401"));
                    }
                }
                
              
            }
            catch
            {
                throw;
            }
            return uid;
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

        public static async Task SendGlobalNotification1([Service] IConfiguration config,
                        string topic, string eventId, string eventName, int count, string jsonString)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    //string jsonString = JsonConvert.SerializeObject(jobNotification);
                    var message = new
                    {
                        topic = topic,
                        count = 1,
                        event_id = string.IsNullOrEmpty(eventId) ? Util.GenerateGUID() : eventId,
                        event_name = eventName,
                        event_dt = DateTime.Now.ToEpochTime(),
                        payload = jsonString
                    };

                    var graphqlQuery = new
                    {
                        query = @"
                        query SendMessage($message: Message_r1Input!) {
                          sendMessage_r1(message: $message)
                        }",
                        variables = new
                        {
                            message
                        }
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(graphqlQuery);
                    //string jsonPayload = JObject.FromObject(requestPayload).ToString(Newtonsoft.Json.Formatting.None);

                    HttpClient _httpClient = new();
                    //string queryStatement = Newtonsoft.Json.JsonConvert.SerializeObject(query);
                    var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    var data = await _httpClient.PostAsync(httpURL, content);
                    Console.WriteLine(data);
                }
            }
            catch (Exception ex)
            { }
        }

        public static async Task AddAndTriggerStaffNotification([Service] IConfiguration config, int id, string module_cv, string message, string notification_uid)
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
                            notification_uid = notification_uid
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

        public static async Task SendPurposeChangeNotification([Service] IConfiguration config, PurposeNotification purposeChangeNotification)
        {
            try
            {
                string httpURL = $"{config["GlobalNotificationURL"]}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var query = @"query sendPurposeChangeNotification($purposeNotification: PurposeNotificationInput!) 
                                    {sendPurposeChangeNotification(purposeNotification: $purposeNotification)}";

                    //// Define the variables for the query
                    // Variables for the query
                    var variables = new
                    {
                        purposeNotification = purposeChangeNotification,
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

        public static async Task<int> AddCleaning1(ApplicationInventoryDBContext context, IConfiguration config,
            string user, long currentDateTime, storing_order_tank sot, long? ingate_date, string tariffBufferGuid, string newJob_no)
        {
            int retval = 0;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    if (TankMovementStatus.validTankStatus.Contains(sot?.tank_status_cv))
                    {
                        var cleaning = await context.cleaning.Where(c => c.sot_guid == sot.guid && c.delete_dt == null).FirstOrDefaultAsync();
                        if (cleaning == null)
                        {
                            var ingateCleaning = new cleaning();
                            ingateCleaning.guid = Util.GenerateGUID();
                            ingateCleaning.create_by = "system";
                            ingateCleaning.create_dt = currentDateTime;
                            ingateCleaning.update_by = "system";
                            ingateCleaning.update_dt = currentDateTime;
                            ingateCleaning.sot_guid = sot.guid;
                            ingateCleaning.approve_dt = currentDateTime; //Change to this after daniel request //ingate_date;
                            ingateCleaning.approve_by = "system";
                            ingateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                            ingateCleaning.job_no = newJob_no; //sot?.job_no;
                            var customerGuid = sot?.storing_order?.customer_company_guid;
                            ingateCleaning.bill_to_guid = customerGuid;

                            var categoryGuid = sot?.tariff_cleaning?.cleaning_category_guid;
                            var adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                                           .Select(c => c.adjusted_price).FirstOrDefaultAsync() ?? 0;
                            ingateCleaning.cleaning_cost = adjustedPrice;

                            var bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == tariffBufferGuid)
                                                               .Select(b => b.cost).FirstOrDefaultAsync() ?? 0;
                            ingateCleaning.buffer_cost = bufferPrice;
                            ingateCleaning.est_buffer_cost = bufferPrice;
                            ingateCleaning.est_cleaning_cost = adjustedPrice;

                            await context.AddAsync(ingateCleaning);
                        }
                        else
                        {
                            cleaning.status_cv = CurrentServiceStatus.APPROVED;
                            cleaning.update_by = user;
                            cleaning.update_dt = currentDateTime;
                        }
                        retval = await context.SaveChangesAsync();
                    }

                    //Tank handling
                    string curTankStatus;
                    var tank = new storing_order_tank() { guid = sot.guid };
                    context.storing_order_tank.Attach(tank);
                    tank.update_by = user;
                    tank.update_dt = currentDateTime;
                    tank.cleaning_remarks = sot.cleaning_remarks;
                    tank.purpose_cleaning = true;
                    //if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                    //{
                    //    tank.tank_status_cv = TankMovementStatus.CLEANING;
                    //    curTankStatus = tank.tank_status_cv;
                    //}
                    //else
                    //    curTankStatus = sot.tank_status_cv;
                    curTankStatus = await TankMovementConditionCheck(context, tank);
                    retval = retval + await context.SaveChangesAsync();

                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();

                    await NotificationHandling(config, PurposeType.CLEAN, sot.guid, curTankStatus);
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();

                    throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
                }
            }
            return retval;
        }

        public static async Task<int> AddSteaming1(ApplicationInventoryDBContext context, IConfiguration config,
            string user, long currentDateTime, storing_order_tank sot, long? ingate_date, string newJob_no)
        {
            int retval = 0;

            try
            {
                if (TankMovementStatus.validTankStatus.Contains(sot?.tank_status_cv))
                {
                    var customerGuid = sot?.storing_order?.customer_company_guid;
                    var last_cargo_guid = sot?.last_cargo_guid;
                    var last_cargo = await context.Set<tariff_cleaning>().Where(x => x.guid == last_cargo_guid).Select(x => x.cargo).FirstOrDefaultAsync();
                    var description = $"Steaming/Heating cost of ({last_cargo})";
                    var repTemp = sot?.required_temp;

                    //Added for later use
                    var unit_type_guid = sot?.unit_type_guid;
                    var isFlatRate = await context.Set<tank>().Where(t => t.guid == unit_type_guid).Select(t => t.flat_rate).FirstOrDefaultAsync();

                    bool isExclusive = false;
                    bool isNew = true;
                    string steamingGuid = "";

                    //First check whether have exclusive package cost
                    var result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                           .Join(context.Set<steaming_exclusive>(), p => p.steaming_exclusive_guid, t => t.guid, (p, t) => new { p, t })
                           .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp && joined.t.tariff_cleaning_guid == last_cargo_guid)
                           .Select(joined => new SteamingPackageResult
                           {
                               cost = joined.p.cost,  // Selecting cost
                               labour = joined.p.labour, // Selecting labour
                               steaming_guid = joined.p.steaming_exclusive_guid
                           })
                           .FirstOrDefaultAsync();

                    //If no exclusive found
                    if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                    {
                        //we check the general package cost
                        result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                               .Join(context.Set<tariff_steaming>(), p => p.tariff_steaming_guid, t => t.guid, (p, t) => new { p, t })
                               .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp)
                               .Select(joined => new SteamingPackageResult
                               {
                                   cost = joined.p.cost,  // Selecting cost
                                   labour = joined.p.labour, // Selecting labour
                                   steaming_guid = joined.p.tariff_steaming_guid
                               })
                               .FirstOrDefaultAsync();
                    }
                    else //the customer have exclusive package cost
                        isExclusive = true;

                    if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                        throw new GraphQLException(new Error($"Package steaming not found", "ERROR"));

                    var defQty = 1;
                    //var totalCost = defQty * (result?.cost ?? 0) + (result?.labour ?? 0);

                    double rate = 0.0;
                    double cost = 0.0;
                    double? est_hour = 1.0;
                    double? total_hour = null;

                    if (isFlatRate ?? false)
                    {
                        rate = cost = result?.cost ?? 0.0;
                        total_hour = 1.0;
                    }
                    else
                    {
                        rate = cost = result?.labour ?? 0.0;
                        // totalHour might be updated later
                    }

                    var curSteaming = await context.steaming.Where(s => s.sot_guid == sot.guid && (s.delete_dt == null || s.delete_dt == 0)).FirstOrDefaultAsync();
                    if (curSteaming == null)
                    {
                        //steaming handling
                        var newSteam = new steaming();
                        newSteam.guid = Util.GenerateGUID();
                        newSteam.create_by = "system";
                        newSteam.create_dt = currentDateTime;
                        newSteam.update_by = "system";
                        newSteam.update_dt = currentDateTime;
                        newSteam.sot_guid = sot.guid;
                        newSteam.status_cv = CurrentServiceStatus.APPROVED;
                        newSteam.job_no = newJob_no; //sot?.job_no;
                        newSteam.bill_to_guid = customerGuid;

                        newSteam.rate = rate;
                        newSteam.est_cost = cost;
                        newSteam.total_cost = cost;
                        newSteam.flat_rate = isFlatRate;

                        newSteam.approve_dt = currentDateTime;//Change to this after daniel request //ingate_date;
                        newSteam.approve_by = "system";
                        newSteam.estimate_by = "system";
                        newSteam.estimate_dt = ingate_date;
                        await context.AddAsync(newSteam);
                        steamingGuid = newSteam.guid;
                    }
                    else
                    {
                        curSteaming.status_cv = CurrentServiceStatus.APPROVED;
                        curSteaming.update_by = user;
                        curSteaming.update_dt = currentDateTime;

                        curSteaming.rate = rate;
                        curSteaming.est_cost = cost;
                        curSteaming.total_cost = cost;
                        curSteaming.flat_rate = isFlatRate;
                        isNew = false;
                        steamingGuid = curSteaming.guid;
                    }


                    //steaming_part handling
                    var steamingPart = new steaming_part();
                    steamingPart.guid = Util.GenerateGUID();
                    steamingPart.create_by = "system";
                    steamingPart.create_dt = currentDateTime;
                    steamingPart.update_by = "system";
                    steamingPart.update_dt = currentDateTime;
                    //if (isNew)
                    //  steamingPart.steaming_guid = newSteamingGuid;
                    steamingPart.steaming_guid = steamingGuid;

                    if (isExclusive)
                        steamingPart.steaming_exclusive_guid = result?.steaming_guid;
                    else
                        steamingPart.tariff_steaming_guid = result?.steaming_guid;
                    steamingPart.description = description;
                    steamingPart.quantity = defQty;
                    steamingPart.labour = result?.labour;
                    steamingPart.cost = result?.cost;
                    steamingPart.approve_qty = defQty;
                    steamingPart.approve_part = true;
                    steamingPart.approve_cost = result?.cost;
                    steamingPart.approve_labour = result?.labour;
                    await context.AddAsync(steamingPart);
                }

                //Tank handling
                string curTankStatus;
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.required_temp = sot.required_temp;
                tank.steaming_remarks = sot.steaming_remarks;
                tank.purpose_steam = true;
                if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    tank.tank_status_cv = TankMovementStatus.STEAM;
                    curTankStatus = tank.tank_status_cv;
                }
                else
                    curTankStatus = sot.tank_status_cv;

                retval = await context.SaveChangesAsync();
                await NotificationHandling(config, PurposeType.STEAM, sot.guid, curTankStatus);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public static async Task<int> AddRepair(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, storing_order_tank sot)
        {
            int retval = 0;
            try
            {
                //Tank handling
                string curTankStatus;
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.repair_remarks = sot.repair_remarks;
                tank.purpose_repair_cv = sot.purpose_repair_cv;

                if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    tank.tank_status_cv = TankMovementStatus.REPAIR;
                    curTankStatus = tank.tank_status_cv;
                }
                else
                    curTankStatus = sot.tank_status_cv;

                retval = await context.SaveChangesAsync();
                await NotificationHandling(config, sot.purpose_repair_cv, sot.guid, curTankStatus);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public static async Task<int> AddStorage(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, storing_order_tank sot)
        {
            int retval = 0;
            try
            {
                //Tank handling
                string curTankStatus;
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.storage_remarks = sot.storage_remarks;
                tank.purpose_storage = true;

                retval = await context.SaveChangesAsync();
                await NotificationHandling(config, PurposeType.STORAGE, sot.guid, sot.tank_status_cv);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public static async Task<string> TankMovementConditionCheck(ApplicationInventoryDBContext context, storing_order_tank tank, bool pendingJob = false)
        {
            try
            {
                var currentTankStatus = tank.tank_status_cv;

                var completedStatuses = new[] { CurrentServiceStatus.COMPLETED, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };
                var qcCompletedStatuses = new[] { CurrentServiceStatus.QC, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };

                //check if tank have any steaming purpose
                if (tank.purpose_steam ?? false)
                {
                    var res = await context.steaming.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    if (res.Any())
                    {
                        if (res.Any(t => !completedStatuses.Contains(t.status_cv)))
                        {
                            //tank.tank_status_cv = TankMovementStatus.STEAM;
                            currentTankStatus = TankMovementStatus.STEAM;
                            goto ProceesUpdate;
                        }
                    }
                }

                //check if tank have any cleaning purpose
                if (tank.purpose_cleaning ?? false)
                {

                    var cleaningTasks = await context.cleaning.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    var residueTasks = await context.residue.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();

                    // Check if any cleaning or residue tasks exist and have pending statuses
                    bool hasPendingTasks = cleaningTasks.Any(t => !completedStatuses.Contains(t.status_cv))
                                            || residueTasks.Any(t => !completedStatuses.Contains(t.status_cv));
                    if (hasPendingTasks)
                    {
                        tank.tank_status_cv = TankMovementStatus.CLEANING;
                        goto ProceesUpdate;
                    }
                }

                //check if tank have any repair purpose
                if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                {
                    var res = await context.repair.Where(t => t.sot_guid == tank.guid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    if (res.Any())
                    {
                        if (res.Any(t => !qcCompletedStatuses.Contains(t.status_cv)))
                        {
                            //tank.tank_status_cv = TankMovementStatus.REPAIR;
                            currentTankStatus = TankMovementStatus.REPAIR;
                            goto ProceesUpdate;
                        }
                        else
                        {
                            if (pendingJob)
                            {
                                currentTankStatus = TankMovementStatus.REPAIR;
                                goto ProceesUpdate;
                            }
                        }
                    }
                    else
                    {
                        //tank.tank_status_cv = TankMovementStatus.REPAIR;
                        currentTankStatus = TankMovementStatus.REPAIR;
                        goto ProceesUpdate;
                    }
                }

                if (true) //(tank.purpose_storage ?? false)
                {
                    currentTankStatus = TankMovementStatus.STORAGE;
                }

            ProceesUpdate:
                //var ret = await context.SaveChangesAsync();

                //await NotificationHandling(config, processType, sotGuid, tank.status_cv);
                return currentTankStatus;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static async Task NotificationHandling(IConfiguration config, string purpose, string sotGuid, string tankStatus)
        {
            PurposeNotification purposeNotification = new PurposeNotification()
            {
                purpose = purpose,
                sot_guid = sotGuid,
                tank_status = tankStatus
            };
            await SendPurposeChangeNotification(config, purposeNotification);
        }

        public static async Task<int> TankInfoHandling(IMapper mapper, ApplicationInventoryDBContext context, string user, long currentDateTime, tank_info tankInfo)
        {
            try
            {
                var tf = await context.tank_info.Where(t => t.tank_no == tankInfo.tank_no && t.delete_dt == null).FirstOrDefaultAsync();
                if (tf == null)
                {
                    tf = tankInfo;
                    tf.guid = Util.GenerateGUID();
                    tf.create_by = user;
                    tf.create_dt = currentDateTime;
                    tf.update_by = user;
                    tf.update_dt = currentDateTime;
                    await context.AddAsync(tf);
                }
                else
                {
                    //tf.storing_order_tank = null;
                    mapper.Map(tankInfo, tf);
                    //already ignore the guid, created_by, created_dt in program.config
                    tf.update_by = user;
                    tf.update_dt = currentDateTime;
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        public static async Task<double> GetPackageBufferCostAsync(ApplicationInventoryDBContext context, string customerGuid, string tariffBufferGuid)
        {
            double bufferPrice = 0;
            try
            {
                bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == tariffBufferGuid)
                                    .Select(b => b.cost).FirstOrDefaultAsync() ?? 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return bufferPrice;
        }

        public static async Task<double> GetPackageLabourCostAsync(ApplicationInventoryDBContext context, string customerGuid, string tariffLabourGuid)
        {
            double cost = 0;
            try
            {
                if (!string.IsNullOrEmpty(customerGuid))
                    cost = await context.Set<package_labour>().Where(b => b.customer_company_guid == customerGuid && b.tariff_labour_guid == tariffLabourGuid)
                                        .Select(b => b.cost).FirstOrDefaultAsync() ?? 0;
                else
                    cost = await context.Set<package_labour>().Where(b => b.customer_company_guid == customerGuid)
                                        .Select(b => b.cost).FirstOrDefaultAsync() ?? 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return cost;
        }

        public static async Task<double> GetPackageCleaningCostAsync(ApplicationInventoryDBContext context, string customerGuid, string categoryGuid)
        {
            double adjustedPrice = 0;
            try
            {
                adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                                        .Select(c => c.adjusted_price).FirstOrDefaultAsync() ?? 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return adjustedPrice;
        }

        public static async Task<double> GetPackageResidueCostAsync(ApplicationInventoryDBContext context, string customerGuid, string tariffResidueGuid)
        {
            double cost = 0;
            try
            {
                cost = await context.Set<package_residue>().Where(c => c.customer_company_guid == customerGuid && c.tariff_residue_guid == tariffResidueGuid)
                                        .Select(c => c.cost).FirstOrDefaultAsync() ?? 0;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            return cost;
        }

        public static async Task<RepairPackageResult> GetPackageRepairCostAsync(ApplicationInventoryDBContext context, string customerGuid, string tariffRepairGuid)
        {

            try
            {
                var result = await context.Set<package_repair>().Where(c => c.customer_company_guid == customerGuid && c.tariff_repair_guid == tariffRepairGuid)
                                        .Select(c => new RepairPackageResult
                                        {
                                            cost = c.material_cost,
                                            labour_hour = c.labour_hour,
                                        })
                                       .FirstOrDefaultAsync();
                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task<(SteamingPackageResult?, bool)> GetTankPackageSteamingAsync(ApplicationInventoryDBContext context, string customerGuid, float reqTemp, string lastCargoGuid)
        {
            try
            {
                bool isExclusive = false;
                //First check whether is exclusive or not
                var result = await GetPackageSteamingExclusiveAsync(context, customerGuid, reqTemp, lastCargoGuid);
                if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                {
                    result = await GetPackageSteamingAsync(context, customerGuid, reqTemp, lastCargoGuid);

                    if (result == null || string.IsNullOrEmpty(result.steaming_guid))
                        throw new GraphQLException(new Error($"Package steaming not found", "ERROR"));
                }
                else
                    isExclusive = true;

                return (result, isExclusive);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<SteamingPackageResult?> GetPackageSteamingExclusiveAsync(ApplicationInventoryDBContext context, string customerGuid, float reqTemp, string lastCargoGuid)
        {
            try
            {
                //First check whether is exclusive or not
                var result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                              .Join(context.Set<steaming_exclusive>(), p => p.steaming_exclusive_guid, t => t.guid, (p, t) => new { p, t })
                              .Where(joined => joined.t.temp_min <= reqTemp && joined.t.temp_max >= reqTemp && joined.t.tariff_cleaning_guid == lastCargoGuid)
                              .Select(joined => new SteamingPackageResult
                              {
                                  cost = joined.p.cost,  // Selecting cost
                                  labour = joined.p.labour, // Selecting labour
                                  steaming_guid = joined.p.steaming_exclusive_guid
                              })
                              .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<SteamingPackageResult?> GetPackageSteamingAsync(ApplicationInventoryDBContext context, string customerGuid, float repTemp, string last_cargo_guid)
        {
            try
            {
                var result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                              .Join(context.Set<tariff_steaming>(), p => p.tariff_steaming_guid, t => t.guid, (p, t) => new { p, t })
                              .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp)
                              .Select(joined => new SteamingPackageResult
                              {
                                  cost = joined.p.cost,  // Selecting cost
                                  labour = joined.p.labour, // Selecting labour
                                  steaming_guid = joined.p.tariff_steaming_guid
                              })
                              .FirstOrDefaultAsync();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public static async Task<string> GetCurrentSessionId([Service] IConfiguration config, string userId)
        {
            try
            {
                string connectionString = config.GetConnectionString("default"); // Use your Identity DB connection string

                using (var connection = new MySqlConnection(connectionString))
                {
                    await connection.OpenAsync();

                    var query = "SELECT CurrentSessionId FROM AspNetUsers WHERE UserName = @userId LIMIT 1";

                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        cmd.Parameters.AddWithValue("@userId", userId);

                        var result = await cmd.ExecuteScalarAsync();
                        return result?.ToString() ?? string.Empty;
                    }
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"Failed to get session ID: {ex.Message}", "SESSION_ERROR"));
            }
        }


        public static async Task<int> GetWaitingSOTCount(ApplicationInventoryDBContext context)
        {
            try
            {
                var sotCount = context.storing_order_tank.Where(s => s.status_cv == SOTankStatus.WAITING &&
                                                   (s.delete_dt == null || s.delete_dt == 0)).Select(s => s.guid).Count();
                return sotCount;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }



        public static async Task<int> GetPendingSurveyCount(ApplicationInventoryDBContext context, string gate)
        {
            try
            {
                if (gate.EqualsIgnore("IN")) 
                {
                    var count = context.in_gate.Where(ig => ig.eir_status_cv == EirStatus.YET_TO_SURVEY && (ig.delete_dt == null || ig.delete_dt == 0))
                              .Select(ig => ig.guid)
                              .Distinct()
                              .Count();
                    return count;
                }
                else
                {
                    var count = context.in_gate.Where(ig => ig.eir_status_cv == EirStatus.YET_TO_SURVEY && (ig.delete_dt == null || ig.delete_dt == 0))
                      .Select(ig => ig.guid)
                      .Distinct()
                      .Count();
                    return count;
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task<PendingProcessCount> GetSOTPendingProcessCount(ApplicationInventoryDBContext context)
        {
            try
            {
                var SOT = context.storing_order_tank
                         .Where(s => s.status_cv == SOTankStatus.ACCEPTED && (s.delete_dt == null || s.delete_dt == 0))
                         .AsQueryable();

                var cleanCount = await GetPendingCleaningCount(SOT);
                var steamCount = await GetPendingSteamingCount(SOT);
                var residueCount = await GetPendingResidueCount(SOT);
                var repairCount = await GetPendingRepairCount(SOT);

                PendingProcessCount counts = new PendingProcessCount()
                {
                    Pending_Cleaning_Count = cleanCount,
                    Pending_Residue_Count = residueCount,
                    Pending_Steaming_Count = steamCount,
                    Pending_Estimate_Count = repairCount,
                };

                return counts;
            }
            catch (Exception)
            {
                throw;
            }
        }

        private static async Task<int> GetPendingCleaningCount(IQueryable<storing_order_tank>? SOT)
        {
            try
            {
                var count = SOT.Where(s => s.purpose_cleaning == true && s.tank_status_cv.ToUpper() == TankMovementStatus.CLEANING &&
                              s.cleaning.Any(c => c.status_cv.ToUpper() == CurrentServiceStatus.APPROVED
                                || c.status_cv.ToUpper() == CurrentServiceStatus.JOB_IN_PROGRESS
                                && (c.delete_dt == null || c.delete_dt == 0)))
                              .Select(s => s.guid)
                              .Distinct()
                              .Count();
                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<int> GetPendingSteamingCount(IQueryable<storing_order_tank>? SOT)
        {
            try
            {
                var count = SOT.Where(s => s.purpose_steam == true && s.tank_status_cv.ToUpper() == TankMovementStatus.STEAM &&
                              s.steaming.Any(c => c.status_cv.ToUpper() == CurrentServiceStatus.APPROVED
                                || c.status_cv.ToUpper() == CurrentServiceStatus.JOB_IN_PROGRESS
                                && (c.delete_dt == null || c.delete_dt == 0)))
                              .Select(s => s.guid)
                              .Distinct()
                              .Count();
                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<int> GetPendingResidueCount(IQueryable<storing_order_tank>? SOT)
        {
            try
            {
                var count = SOT.Where(s => s.purpose_cleaning == true && s.tank_status_cv.ToUpper() == TankMovementStatus.CLEANING &&
                              s.residue.Any(c => c.status_cv.ToUpper() == CurrentServiceStatus.APPROVED
                                || c.status_cv.ToUpper() == CurrentServiceStatus.JOB_IN_PROGRESS
                                && (c.delete_dt == null || c.delete_dt == 0)))
                              .Select(s => s.guid)
                              .Distinct()
                              .Count();
                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private static async Task<int> GetPendingRepairCount(IQueryable<storing_order_tank>? SOT)
        {
            try
            {
                var repairPurpose = new List<string> { "OFFHIRE", "REPAIR" };
                var count = SOT.Where(s => repairPurpose.Contains(s.purpose_repair_cv) && s.tank_status_cv.ToUpper() == TankMovementStatus.REPAIR)
                               .Where(s => !s.repair.Any() || s.repair.All(r => r.status_cv.ToUpper() == CurrentServiceStatus.CANCELED))
                               .Select(s => s.guid)
                               .Distinct()
                               .Count();

                return count;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task<int> GetGateCountOfDay(ApplicationInventoryDBContext context, string gate)
        {

            try
            {
                long sDate = GetStartOfDayEpoch(DateTime.Now);
                long eDate = GetEndOfDayEpochSeconds(DateTime.Now);

                if (gate.EqualsIgnore("IN"))
                {
                    var count = context.storing_order_tank.Where(s => s.delete_dt == null || s.delete_dt == 0)
                                                           .Where(s => s.in_gate.Any(ig => ig.delete_dt == null &&
                                                                       ig.eir_status_cv.ToUpper() == EirStatus.PUBLISHED &&
                                                                       ig.eir_dt >= sDate &&
                                                                       ig.eir_dt <= eDate))
                                                           .Select(s => s.guid)
                                                           .Distinct()
                                                           .Count();
                    return count;
                }
                else
                {
                    var count = context.storing_order_tank.Where(s => s.tank_status_cv.ToUpper() == TankMovementStatus.RELEASED && (s.delete_dt == null || s.delete_dt == 0))
                                                           .Where(s => s.out_gate.Any(ig => ig.delete_dt == null &&
                                                                       ig.eir_dt >= sDate &&
                                                                       ig.eir_dt <= eDate))
                                                           .Select(s => s.guid)
                                                           .Distinct()
                                                           .Count();
                    return count;
                }
            }
            catch (Exception)
            {
                throw;
            }
        }

        public static long GetStartOfDayEpoch(DateTime date)
        {
            var startOfDay = date.Date; // sets time to 00:00:00
            var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            var utcStartOfDay = startOfDay.ToUniversalTime(); // convert to UTC
            return (long)(utcStartOfDay - unixEpoch).TotalSeconds;
        }

        public static long GetEndOfDayEpochSeconds(DateTime date)
        {
            // Get end of day: 23:59:59.999
            var endOfDay = date.Date.AddDays(1).AddMilliseconds(-1);
            // Treat as UTC to calculate epoch time
            var endOfDayUtc = endOfDay.ToUniversalTime();
            var unixEpoch = new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc);
            return (long)(endOfDayUtc - unixEpoch).TotalSeconds;
        }
    }
}
