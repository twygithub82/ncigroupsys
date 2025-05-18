using AutoMapper;
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
using System.Net;
using System.Security.Claims;
using System.Text;


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
                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value; //authUser.FindFirstValue(ClaimTypes.GroupSid);
                uid = authUser.FindFirst(ClaimTypes.Name)?.Value;//authUser.FindFirstValue(ClaimTypes.Name);
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
                    curTankStatus = await TankMovementConditionCheck1(context, tank);
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
                    bool isExclusive = false;
                    bool isNew = true;
                    string newSteamingGuid = "";
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
                    var totalCost = defQty * (result?.cost ?? 0) + (result?.labour ?? 0);

                    var curSteaming = await context.steaming.Where(s => s.sot_guid == sot.guid && s.delete_dt == null).FirstOrDefaultAsync();
                    if (curSteaming == null)
                    {
                        //steaming handling
                        var newSteam = new steaming();
                        newSteam.guid = Util.GenerateGUID();
                        newSteam.create_by = "system";
                        newSteam.create_dt = currentDateTime;
                        newSteam.sot_guid = sot.guid;
                        newSteam.status_cv = CurrentServiceStatus.APPROVED;
                        newSteam.job_no = newJob_no; //sot?.job_no;
                        newSteam.bill_to_guid = customerGuid;
                        newSteam.est_cost = totalCost;
                        newSteam.total_cost = totalCost;
                        newSteam.approve_dt = currentDateTime;//Change to this after daniel request //ingate_date;
                        newSteam.approve_by = "system";
                        newSteam.estimate_by = "system";
                        newSteam.estimate_dt = ingate_date;
                        await context.AddAsync(newSteam);

                        newSteamingGuid = newSteam.guid;
                    }
                    else
                    {
                        curSteaming.status_cv = CurrentServiceStatus.APPROVED;
                        curSteaming.update_by = user;
                        curSteaming.update_dt = currentDateTime;
                        curSteaming.est_cost = totalCost;
                        curSteaming.total_cost = totalCost;
                        isNew = false;
                    }


                    //steaming_part handling
                    var steamingPart = new steaming_part();
                    steamingPart.guid = Util.GenerateGUID();
                    steamingPart.create_by = "system";
                    steamingPart.create_dt = currentDateTime;
                    if (isNew)
                        steamingPart.steaming_guid = newSteamingGuid;
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

        [Obsolete]
        public static async Task<string> TankMovementConditionCheck(ApplicationInventoryDBContext context, IConfiguration config, string user, long currentDateTime, string sotGuid, string processType, string remark)
        {
            try
            {
                //first check tank purpose
                var tank = await context.storing_order_tank.Where(t => t.guid == sotGuid & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
                tank.update_by = user;
                tank.update_dt = currentDateTime;

                if (processType.EqualsIgnore(PurposeType.STEAM))
                {
                    tank.purpose_steam = false;
                    tank.steaming_remarks = remark;
                }

                else if (processType.EqualsIgnore(PurposeType.CLEAN) || (processType.EqualsIgnore(PurposeType.RESIDUE)))
                    tank.cleaning_remarks = remark;
                else if (processType.EqualsIgnore(PurposeType.REPAIR))
                    tank.repair_remarks = remark;
                else if (processType.EqualsIgnore(PurposeType.STORAGE))
                    tank.storage_remarks = remark;



                if (tank != null)
                {
                    var completedStatuses = new[] { CurrentServiceStatus.COMPLETED, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };
                    var qcCompletedStatuses = new[] { CurrentServiceStatus.QC, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };

                    //check if tank have any steaming purpose
                    if (tank.purpose_steam ?? false)
                    {
                        var res = await context.steaming.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                        if (res.Any())
                        {
                            if (res.Any(t =>
                                        (t.approve_by == "system" && !qcCompletedStatuses.Contains(t.status_cv)) ||
                                        (t.approve_by != "system" && !completedStatuses.Contains(t.status_cv)))
                                        )
                            {
                                tank.tank_status_cv = TankMovementStatus.STEAM;
                                goto ProceesUpdate;
                            }
                        }
                        else
                        {
                            tank.tank_status_cv = TankMovementStatus.STEAM;
                            goto ProceesUpdate;
                        }
                    }

                    //check if tank have any cleaning purpose
                    if (tank.purpose_cleaning ?? false)
                    {
                        var res = await context.cleaning.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                        if (res.Any())
                        {
                            if (res.Any(t =>
                                        (t.approve_by == "system" && !qcCompletedStatuses.Contains(t.status_cv)) ||
                                        (t.approve_by != "system" && !completedStatuses.Contains(t.status_cv)))
                                        )
                            {
                                tank.tank_status_cv = TankMovementStatus.CLEANING;
                                goto ProceesUpdate;
                            }
                            else
                            {
                                //Else, check if tank have any residue estimate already created but pending
                                //res.Clear();
                                var resd = await context.residue.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                                if (resd.Any())
                                {
                                    if (resd.Any(t =>
                                                (t.approve_by == "system" && !qcCompletedStatuses.Contains(t.status_cv)) ||
                                                (t.approve_by != "system" && !completedStatuses.Contains(t.status_cv)))
                                                )
                                    {
                                        tank.tank_status_cv = TankMovementStatus.CLEANING;
                                        goto ProceesUpdate;
                                    }
                                }
                                else
                                {
                                    tank.tank_status_cv = TankMovementStatus.CLEANING;
                                    goto ProceesUpdate;
                                }
                            }
                        }
                        else
                        {
                            tank.tank_status_cv = TankMovementStatus.CLEANING;
                            goto ProceesUpdate;
                        }
                    }

                    //check if tank have any repair purpose
                    if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                    {
                        var res = await context.repair.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                        if (res.Any())
                        {
                            if (res.Any(t => !qcCompletedStatuses.Contains(t.status_cv)))
                            {
                                tank.tank_status_cv = TankMovementStatus.REPAIR;
                                goto ProceesUpdate;
                            }
                        }
                        else
                        {
                            tank.tank_status_cv = TankMovementStatus.REPAIR;
                            goto ProceesUpdate;
                        }
                    }

                    if (tank.purpose_storage ?? false)
                    {
                        tank.status_cv = TankMovementStatus.STORAGE;
                    }

                ProceesUpdate:
                    var ret = await context.SaveChangesAsync();

                    await NotificationHandling(config, processType, sotGuid, tank.status_cv);

                    return tank.status_cv;
                }
                return "";
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public static async Task<string> TankMovementConditionCheck1(ApplicationInventoryDBContext context, storing_order_tank tank, bool pendingJob = false)
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

        public static async Task<int> UpdateTankInfo(IMapper mapper, ApplicationInventoryDBContext context, string user, long currentDateTime, tank_info tankInfo)
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

        //private static bool AnyJobInProgress(ApplicationInventoryDBContext context, string processGuid)
        //{
        //    string sqlQuery = $@"SELECT * FROM job_order WHERE delete_dt IS NULL AND guid IN (
        //                                SELECT distinct job_order_guid FROM repair_part 
        //                                WHERE repair_guid = '{processGuid}' AND approve_part = 1 AND delete_dt IS NULL);";

        //    var jobOrderList = context.job_order.FromSqlRaw(sqlQuery).AsNoTracking().ToList();
        //    if (jobOrderList?.Any() == true & !jobOrderList.Any(j => j == null))
        //    {
        //        bool pendingJob = false;
        //        pendingJob = jobOrderList.Any(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));

        //        return pendingJob;
        //    }
        //    return false;
        //}
    }
}
