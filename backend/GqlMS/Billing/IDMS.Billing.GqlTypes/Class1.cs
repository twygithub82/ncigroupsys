//using CommonUtil.Core.Service;
//using HotChocolate;
//using HotChocolate.Types;
//using IDMS.Billing.Application;
//using IDMS.Billing.GqlTypes.BillingResult;
//using IDMS.Billing.GqlTypes.LocalModel;
//using IDMS.Models.DB;
//using Microsoft.AspNetCore.Http;
//using Microsoft.EntityFrameworkCore;
//using Microsoft.Extensions.Configuration;


//namespace IDMS.Billing.GqlTypes
//{
//    //    // Assuming you have these models:
//    //    // MonthlyInventoryRequest, MonthlyInventoryResult, MonthlyRepairInventory, 
//    //    // MonthlySteamingInventory, MonthlyCleaningInventory, YourDbContext, 
//    //    // ProcessInventoryResults, GetResultPerDay, MergeMonthlyList, ResultPerDay


//    public class ManagementReportQuery1
//    {

//        public async Task ProcessMonthlyInventory(MonthlyInventoryRequest monthlyInventoryRequest, YourDbContext context, IQueryable<YourEntity> query, long startEpoch, long endEpoch, DateTime startOfMonth, DateTime endOfMonth)
//        {
//            var monthlyInventoryResult = new MonthlyInventoryResult();

//            // Define inventory types and their corresponding result types
//            var inventoryTypes = new Dictionary<string, Func<ResultPerDay, object>>
//                {
//                    { "repair", result => new MonthlyRepairInventory { date = result.date, day = result.day, approved_hour = result.appv_cost, completed_hour = result.complete_cost } },
//                    { "steaming", result => new MonthlySteamingInventory { date = result.date, day = result.day, approved_cost = result.appv_cost, completed_cost = result.complete_cost } },
//                    { "cleaning", result => new MonthlyCleaningInventory { date = result.date, day = result.day, approved_cost = result.appv_cost, completed_cost = result.complete_cost } }
//                };

//            // Process each inventory type based on the request
//            foreach (var inventoryType in inventoryTypes)
//            {
//                if (monthlyInventoryRequest.inventory_type.EqualsIgnore(inventoryType.Key) || monthlyInventoryRequest.inventory_type.EqualsIgnore("all"))
//                {
//                    (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, inventoryType.Key, startEpoch, endEpoch, startOfMonth, endOfMonth);

//                    var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
//                    var completeResultPerDay = await GetResultPerDay(completedResult, startOfMonth, endOfMonth);

//                    var mergedResult = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);

//                    // Map the merged result to the specific inventory result type
//                    var inventoryResult = mergedResult.Select(inventoryType.Value).ToList();

//                    // Set the inventory result to the corresponding property of monthlyInventoryResult
//                    SetInventoryResult(monthlyInventoryResult, inventoryType.Key, inventoryResult);
//                }
//            }

//            // Return or use monthlyInventoryResult as needed
//            // ...
//        }


//        private async Task<(List<TempInventoryResult>?, List<TempInventoryResult>?)> ProcessInventoryResults(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType,
//                long startEpoch, long endEpoch, DateTime startOfMonth, DateTime endOfMonth)
//        {

//            if (inventoryType.EqualsIgnore("lolo"))
//            {
//                var newQuery = GetInventoryQuery(context, query, "lift-off", startEpoch, endEpoch);
//                var gateInResult = await newQuery.ToListAsync();

//                var newQuery1 = GetInventoryQuery(context, query, "lift-on", startEpoch, endEpoch);
//                var gateOutResult = await newQuery1.ToListAsync();

//                return (gateInResult, gateOutResult);
//                //var gateInResultPerDay = await GetResultPerDay(gateInResult, startOfMonth, endOfMonth);
//                //var gateOutResultPerDay = await GetResultPerDay(gateOutResult, startOfMonth, endOfMonth);

//                //var result = await MergeMonthlyList(gateInResultPerDay, gateOutResultPerDay);
//                //return result;
//            }
//            else if (inventoryType.EqualsIgnore("gate"))
//            {
//                var newQuery = GetInventoryQuery(context, query, "gate-in", startEpoch, endEpoch);
//                var gateInResult = await newQuery.ToListAsync();

//                var newQuery1 = GetInventoryQuery(context, query, "gate-out", startEpoch, endEpoch);
//                var gateOutResult = await newQuery1.ToListAsync();

//                return (gateInResult, gateOutResult);

//                //var gateInResultPerDay = await GetResultPerDay(gateInResult, startOfMonth, endOfMonth);
//                //var gateOutResultPerDay = await GetResultPerDay(gateOutResult, startOfMonth, endOfMonth);

//                //var result = await MergeMonthlyList(gateInResultPerDay, gateOutResultPerDay);
//                //return result;
//            }
//            else
//            {
//                string completedStatus = "COMPLETED";
//                var newQuery = GetInventoryQuery(context, query, inventoryType, startEpoch, endEpoch);
//                var queryResult = await newQuery.ToListAsync();

//                var approvedResult = queryResult.Where(s => !StatusCondition.BeforeApprove.Contains(s.status)).ToList();
//                var completeResult = queryResult.Where(s => s.status.Equals(completedStatus) && s.complete_date != null).ToList();

//                return (approvedResult, completeResult);
//                //var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
//                //var completeResultPerDay = await GetResultPerDay(completeResult, startOfMonth, endOfMonth);

//                //var result = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);
//                //return result;

//            }
//        }
//        private IQueryable<TempInventoryResult> GetInventoryQuery(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType, long startEpoch, long endEpoch)
//        {
//            string yetSurvey = "YET_TO_SURVEY";
//            string published = "PUBLISHED";

//            switch (inventoryType.ToLower())
//            {
//                case "repair":
//                    return from result in query
//                           join s in context.repair on result.sot_guid equals s.sot_guid
//                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = s.total_hour ?? 0.0,
//                               appv_date = (long)s.approve_dt,
//                               complete_date = (long)s.complete_dt,
//                               status = s.status_cv
//                           };

//                case "steaming":
//                    return from result in query
//                           join s in context.steaming on result.sot_guid equals s.sot_guid
//                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = s.total_cost ?? 0.0,
//                               appv_date = (long)s.approve_dt,
//                               complete_date = (long)s.complete_dt,
//                               status = s.status_cv
//                           };

//                case "cleaning":
//                    return from result in query
//                           join s in context.cleaning on result.sot_guid equals s.sot_guid
//                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = s.buffer_cost ?? 0.0 + s.cleaning_cost ?? 0.0,
//                               appv_date = (long)s.approve_dt,
//                               complete_date = (long)s.complete_dt,
//                               status = s.status_cv
//                           };
//                case "lift-off":
//                    return from result in query
//                           join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
//                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
//                           where s.lift_off == true && ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
//                               && s.delete_dt == null
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = (s.lift_off == true ? 1.0 : 0.0) * s.lift_off_cost ?? 0.0,
//                               appv_date = (long)ig.eir_dt,
//                           };
//                case "gate-in":
//                    return from result in query
//                           join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
//                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
//                           where ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
//                           //&& s.delete_dt == null
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = s.gate_in_cost ?? 0.0,
//                               appv_date = (long)ig.eir_dt,
//                           };
//                case "lift-on":
//                    return from result in query
//                           join ig in context.out_gate on result.sot_guid equals ig.so_tank_guid
//                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
//                           where s.lift_on == true && ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
//                           //&& s.delete_dt == null
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = (s.lift_on == true ? 1.0 : 0.0) * s.lift_on_cost ?? 0.0,
//                               appv_date = (long)ig.eir_dt,
//                           };
//                case "gate-out":
//                    return from result in query
//                           join ig in context.out_gate on result.sot_guid equals ig.so_tank_guid
//                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
//                           where ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
//                           //&& s.delete_dt == null
//                           select new TempInventoryResult
//                           {
//                               sot_guid = result.sot_guid,
//                               code = result.code,
//                               cc_name = result.cc_name,
//                               cost = s.gate_in_cost ?? 0.0,
//                               appv_date = (long)ig.eir_dt,
//                           };
//                default:
//                    return Enumerable.Empty<TempInventoryResult>().AsQueryable();
//            }
//        }



//        private async Task<List<ResultPerDay>> GetResultPerDay(List<TempInventoryResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
//        {
//            foreach (var item in resultList)
//            {
//                // Convert epoch timestamp to DateTimeOffset (local time zone)
//                DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds((long)item.appv_date).ToLocalTime();
//                // Format the date as yyyy-MM-dd and replace the code with date
//                item.date = dateTimeOffset.ToString("dd/MM/yyyy");
//            }
//            // Group nodes by FormattedDate and count the number of SotGuids for each group
//            var groupedNodes = resultList
//                .GroupBy(n => n.date)  // Group by formatted date
//                .Select(g => new
//                {
//                    FormattedDate = g.Key,
//                    //Count = g.Count(),
//                    Cost = g.Select(n => n.cost).Sum() // Get distinct SotGuids
//                })
//                .OrderBy(g => g.FormattedDate) // Sort by date
//                .ToList();

//            List<string> allDatesInMonth = new List<string>();
//            for (DateTime date = startOfMonth; date <= endOfMonth; date = date.AddDays(1))
//            {
//                allDatesInMonth.Add(date.ToString("dd/MM/yyyy"));
//            }

//            // Fill missing dates with count = 0 if not present
//            var completeGroupedNodes = allDatesInMonth
//                .Select(date => new ResultPerDay
//                {
//                    date = date,
//                    day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
//                    //count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0,
//                    cost = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Cost ?? 0.0
//                })
//                .OrderBy(g => g.date) // Sort by date
//                .ToList();

//            return completeGroupedNodes;
//        }

//        private async Task<IEnumerable<MergedMonthlyResult>> MergeMonthlyList(List<ResultPerDay> list1, List<ResultPerDay> list2)
//        {
//            // Join the results based on Date and Day
//            var mergedResults = from approve in list1
//                                join complete in list2
//                                on new { approve.date, approve.day } equals new { complete.date, complete.day } into resultGroup
//                                from complete in resultGroup.DefaultIfEmpty()
//                                select new MergedMonthlyResult
//                                {
//                                    date = approve.date,
//                                    day = approve.day,
//                                    appv_cost = approve.cost,
//                                    complete_cost = complete?.cost ?? 0 // Use 0 if null
//                                };

//            return mergedResults.ToList();
//        }


//        // Helper method to set the inventory result to the correct property
//        private void SetInventoryResult(MonthlyInventoryResult monthlyInventoryResult, string inventoryType, List<object> inventoryResult)
//        {
//            switch (inventoryType.ToLower())
//            {
//                case "repair":
//                    monthlyInventoryResult.repair_inventory = inventoryResult.Cast<MonthlyRepairInventory>().ToList();
//                    break;
//                case "steaming":
//                    monthlyInventoryResult.steaming_inventory = inventoryResult.Cast<MonthlySteamingInventory>().ToList();
//                    break;
//                case "cleaning":
//                    monthlyInventoryResult.cleaning_inventory = inventoryResult.Cast<MonthlyCleaningInventory>().ToList();
//                    break;
//            }
//        }
//    }
//}
