using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Notification;
using IDMS.Models.Package;
using IDMS.Models.Service;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

//using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;

namespace IDMS.Inventory.GqlTypes
{
    public class GqlUtils
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
                var isCheckAuthorization =Convert.ToBoolean(config["JWT:CheckAuthorization"]);
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

        public static async Task<int> AddCleaning1(ApplicationInventoryDBContext context, [Service] IConfiguration config,  
            string user, long currentDateTime, storing_order_tank sot, long? ingate_date, string tariffBufferGuid, string newJob_no)
        {
            int retval = 0;
            try
            {
                var ingateCleaning = new cleaning();
                ingateCleaning.guid = Util.GenerateGUID();
                ingateCleaning.create_by = "system";
                ingateCleaning.create_dt = currentDateTime;
                ingateCleaning.sot_guid = sot.guid;
                ingateCleaning.approve_dt = ingate_date;
                ingateCleaning.approve_by = "system";
                ingateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                ingateCleaning.job_no = newJob_no; //sot?.job_no;
                var customerGuid = sot?.storing_order?.customer_company_guid;
                ingateCleaning.bill_to_guid = customerGuid;

                var categoryGuid = sot?.tariff_cleaning?.cleaning_category_guid;
                var adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                               .Select(c => c.adjusted_price).FirstOrDefaultAsync();
                ingateCleaning.cleaning_cost = adjustedPrice;

                var bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == tariffBufferGuid)
                                                   .Select(b => b.cost).FirstOrDefaultAsync();
                ingateCleaning.buffer_cost = bufferPrice;
                await context.AddAsync(ingateCleaning);

                //Tank handling
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.cleaning_remarks = sot.cleaning_remarks;
                if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    tank.tank_status_cv = TankMovementStatus.CLEANING;
                }

                PurposeNotification purposeNotification = new PurposeNotification()
                {
                    purpose = PurposeType.CLEAN,
                    sot_guid = sot.guid,
                    tank_status = tank.tank_status_cv
                };
                await SendPurposeChangeNotification(config, purposeNotification);
                
                retval = await context.SaveChangesAsync();  
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public static async Task<int> AddSteaming1(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            string user, long currentDateTime, storing_order_tank sot, long? ingate_date, string newJob_no)
        {
            int retval = 0;

            try
            {
                var customerGuid = sot?.storing_order?.customer_company_guid;
                var last_cargo_guid = sot?.last_cargo_guid;
                var last_cargo = await context.Set<tariff_cleaning>().Where(x => x.guid == last_cargo_guid).Select(x => x.cargo).FirstOrDefaultAsync();
                var description = $"Steaming/Heating cost of ({last_cargo})";


                var repTemp = sot?.required_temp;
                var result = await context.Set<package_steaming>().Where(p => p.customer_company_guid == customerGuid)
                            .Join(context.Set<tariff_steaming>(), p => p.tariff_steaming_guid, t => t.guid, (p, t) => new { p, t })
                            .Where(joined => joined.t.temp_min <= repTemp && joined.t.temp_max >= repTemp)
                            .Select(joined => new
                            {
                                joined.p.cost,  // Selecting cost
                                joined.p.labour, // Selecting labour
                                joined.p.tariff_steaming_guid
                            })
                            .FirstOrDefaultAsync();

                if (result == null || string.IsNullOrEmpty(result.tariff_steaming_guid))
                    throw new GraphQLException(new Error($"Package steaming not found", "ERROR"));

                var defQty = 1;
                var totalCost = defQty * (result?.cost ?? 0) + (result?.labour ?? 0);

                //steaming handling
                var newSteam = new steaming();
                newSteam.guid = Util.GenerateGUID();
                newSteam.create_by = "system";
                newSteam.create_dt = currentDateTime;
                newSteam.sot_guid = sot.guid;
                newSteam.status_cv = CurrentServiceStatus.APPROVED;
                newSteam.job_no = newJob_no; //sot?.job_no;
                newSteam.total_cost = totalCost;
                newSteam.approve_dt = ingate_date;
                newSteam.approve_by = "system";
                newSteam.estimate_by = "system";
                newSteam.estimate_dt = ingate_date;
                await context.AddAsync(newSteam);

                //steaming_part handling
                var steamingPart = new steaming_part();
                steamingPart.guid = Util.GenerateGUID();
                steamingPart.create_by = "system";
                steamingPart.create_dt = currentDateTime;
                steamingPart.steaming_guid = newSteam.guid;
                steamingPart.tariff_steaming_guid = result.tariff_steaming_guid;
                steamingPart.description = description;
                steamingPart.quantity = defQty;
                steamingPart.labour = result.labour;
                steamingPart.cost = result.cost;
                steamingPart.approve_part = true;
                steamingPart.approve_cost = result.cost;
                steamingPart.approve_labour = result.labour;
                await context.AddAsync(steamingPart);

                //Tank handling
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.steaming_remarks = sot.steaming_remarks;
                if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    tank.tank_status_cv = TankMovementStatus.STEAM;
                }

                PurposeNotification purposeNotification = new PurposeNotification()
                {
                    purpose = PurposeType.STEAM,
                    sot_guid = sot.guid,
                    tank_status = tank.tank_status_cv
                };
                await SendPurposeChangeNotification(config, purposeNotification);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public static async Task<int> AddRepair(ApplicationInventoryDBContext context, [Service] IConfiguration config, string user, long currentDateTime, storing_order_tank sot)
        {
            int retval = 0;
            try
            { 
                //Tank handling
                var tank = new storing_order_tank() { guid = sot.guid };
                context.storing_order_tank.Attach(tank);
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                tank.repair_remarks = sot.repair_remarks;
                tank.purpose_repair_cv = sot.purpose_repair_cv;
                if (sot.tank_status_cv.EqualsIgnore(TankMovementStatus.STORAGE))
                {
                    tank.tank_status_cv = TankMovementStatus.REPAIR;
                }

                PurposeNotification purposeNotification = new PurposeNotification()
                {
                    purpose = PurposeType.REPAIR,
                    sot_guid = sot.guid,
                    tank_status = tank.tank_status_cv
                };
                await SendPurposeChangeNotification(config, purposeNotification);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

    }
}
