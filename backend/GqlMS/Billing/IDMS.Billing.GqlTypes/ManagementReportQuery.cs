using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Billing.Application;
using IDMS.Billing.GqlTypes.BillingResult;
using IDMS.Billing.GqlTypes.LocalModel;
using IDMS.Models;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace IDMS.Billing.GqlTypes
{
    [ExtendObjectType(typeof(BillingQuery))]
    public class ManagementReportQuery
    {
        //#region Performance Report

        public async Task<YearlyInventoryResult?> QueryYearlyInventory(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, YearlyInventoryRequest yearlyInventoryRequest)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";

                int year = yearlyInventoryRequest.year;
                int start_month = yearlyInventoryRequest.start_month;
                int end_month = yearlyInventoryRequest.end_month;

                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, start_month, 1);
                int daysInMonth = DateTime.DaysInMonth(year, end_month);
                DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Get the end date of the month (last day of the month)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();// Get the start date of the month (1st of the month)

                var query = (from sot in context.storing_order_tank
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             where string.IsNullOrEmpty(yearlyInventoryRequest.customer_code) || cc.code == yearlyInventoryRequest.customer_code
                             select new TempInventoryResult
                             {
                                 sot_guid = sot.guid,
                                 code = cc.code,
                             })
                            .AsQueryable();

                var yearlyInventoryResult = new YearlyInventoryResult();

                if (yearlyInventoryRequest.inventory_type.EqualsIgnore("repair") || yearlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "repair", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerMonth = await GetResultPerMonth(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);

                    var repairResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                    // Handle repairResult as needed
                    var repairInventoryResult = repairResult.Select(result => new YearlyRepairInventory
                    {
                        month = result.month,
                        approved_hour = result.appv_cost,
                        completed_hour = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    yearlyInventoryResult.repair_inventory = repairInventoryResult;
                }

                if (yearlyInventoryRequest.inventory_type.EqualsIgnore("steaming") || yearlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "steaming", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerMonth = await GetResultPerMonth(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);

                    var steamingResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                    // Handle steamingResult as needed
                    var steamingInventoryResult = steamingResult.Select(result => new YearlySteamingInventory
                    {
                        month = result.month,
                        approved_cost = result.appv_cost,
                        completed_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    yearlyInventoryResult.steaming_inventory = steamingInventoryResult;
                }

                if (yearlyInventoryRequest.inventory_type.EqualsIgnore("cleaning") || yearlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "cleaning", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerMonth = await GetResultPerMonth(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);

                    var cleaningResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                    // Handle cleaningResult as needed
                    var cleaningInventoryResult = cleaningResult.Select(result => new YearlyCleaningInventory
                    {
                        month = result.month,
                        approved_cost = result.appv_cost,
                        completed_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    yearlyInventoryResult.cleaning_inventory = cleaningInventoryResult;
                }

                if (yearlyInventoryRequest.inventory_type.EqualsIgnore("in-out") || yearlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    var gateInOutInventoryResult = new YearlyGateInOutInventory();

                    var (l_OffResult, l_OnResult) = await ProcessInventoryResults(context, query, "lolo", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var l_OffResultPerMonth = await GetResultPerMonth(l_OffResult, startOfMonth, endOfMonth);
                    var l_OnResultPerMonth = await GetResultPerMonth(l_OnResult, startOfMonth, endOfMonth);
                    var loloResult = await MergeYearlyList(l_OffResultPerMonth, l_OnResultPerMonth);
                    // Handle cleaningResult as needed
                    var loloInventoryResult = loloResult.Select(result => new YearlyLoloInventory
                    {
                        month = result.month,
                        lift_off_cost = result.appv_cost,
                        lift_on_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();

                    gateInOutInventoryResult.lolo_inventory = loloInventoryResult;
                    //monthlyInventoryResult.lolo_inventory = loloInventoryResult;

                    var (gateInResult, gateOutResult) = await ProcessInventoryResults(context, query, "gate", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var gateInResultPerMonth = await GetResultPerMonth(gateInResult, startOfMonth, endOfMonth);
                    var gateOutResultPerMonth = await GetResultPerMonth(gateOutResult, startOfMonth, endOfMonth);
                    var gateInOutResult = await MergeYearlyList(gateInResultPerMonth, gateOutResultPerMonth);
                    // Handle cleaningResult as needed
                    var gateInventoryResult = gateInOutResult.Select(result => new YearlyGateInventory
                    {
                        month = result.month,
                        gate_in_cost = result.appv_cost,
                        gate_out_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    gateInOutInventoryResult.gate_inventory = gateInventoryResult;

                    yearlyInventoryResult.gate_in_out_inventory = gateInOutInventoryResult;
                }

                return yearlyInventoryResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<MonthlyInventoryResult>? QueryMonthlyInventory(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, MonthlyInventoryRequest monthlyInventoryRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                int year = monthlyInventoryRequest.year;
                int month = monthlyInventoryRequest.month;
                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";

                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, month, 1);
                // Get the end date of the month (last day of the month)
                DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();


                var query = (from sot in context.storing_order_tank
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             where string.IsNullOrEmpty(monthlyInventoryRequest.customer_code) || cc.code == monthlyInventoryRequest.customer_code
                             select new TempInventoryResult
                             {
                                 sot_guid = sot.guid,
                                 code = cc.code,
                             })
                            .AsQueryable();

                var monthlyInventoryResult = new MonthlyInventoryResult();

                if (monthlyInventoryRequest.inventory_type.EqualsIgnore("repair") || monthlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "repair", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerDay = await GetResultPerDay(completedResult, startOfMonth, endOfMonth);

                    var repairResult = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);

                    // Handle repairResult as needed
                    var repairInventoryResult = repairResult.Select(result => new MonthlyRepairInventory
                    {
                        date = result.date,
                        day = result.day,
                        approved_hour = result.appv_cost,
                        completed_hour = result.complete_cost
                    }).ToList();
                    monthlyInventoryResult.repair_inventory = repairInventoryResult;
                }

                if (monthlyInventoryRequest.inventory_type.EqualsIgnore("steaming") || monthlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "steaming", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerDay = await GetResultPerDay(completedResult, startOfMonth, endOfMonth);

                    var steamingResult = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);
                    // Handle steamingResult as needed
                    var steamingInventoryResult = steamingResult.Select(result => new MonthlySteamingInventory
                    {
                        date = result.date,
                        day = result.day,
                        approved_cost = result.appv_cost,
                        completed_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    monthlyInventoryResult.steaming_inventory = steamingInventoryResult;
                }

                if (monthlyInventoryRequest.inventory_type.EqualsIgnore("cleaning") || monthlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "cleaning", startEpoch, endEpoch, startOfMonth, endOfMonth);

                    var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
                    var completeResultPerDay = await GetResultPerDay(completedResult, startOfMonth, endOfMonth);

                    var cleaningResult = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);
                    // Handle cleaningResult as needed
                    var cleaningInventoryResult = cleaningResult.Select(result => new MonthlyCleaningInventory
                    {
                        date = result.date,
                        day = result.day,
                        approved_cost = result.appv_cost,
                        completed_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    monthlyInventoryResult.cleaning_inventory = cleaningInventoryResult;
                }

                if (monthlyInventoryRequest.inventory_type.EqualsIgnore("in-out") || monthlyInventoryRequest.inventory_type.EqualsIgnore("all"))
                {
                    var gateInOutInventoryResult = new MonthlyGateInOutInventory();

                    (var l_OffResult, var l_OnResult) = await ProcessInventoryResults(context, query, "lolo", startEpoch, endEpoch, startOfMonth, endOfMonth);
                    var l_OffResultPerDay = await GetResultPerDay(l_OffResult, startOfMonth, endOfMonth);
                    var l_OnResultPerDay = await GetResultPerDay(l_OnResult, startOfMonth, endOfMonth);

                    var loloResult = await MergeMonthlyList(l_OffResultPerDay, l_OnResultPerDay);

                    // Handle cleaningResult as needed
                    var loloInventoryResult = loloResult.Select(result => new MonthlyLoloInventory
                    {
                        date = result.date,
                        day = result.day,
                        lift_off_cost = result.appv_cost,
                        lift_on_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    gateInOutInventoryResult.lolo_inventory = loloInventoryResult;
                    //monthlyInventoryResult.lolo_inventory = loloInventoryResult;

                    (var gateInResult, var gateOutResult) = await ProcessInventoryResults(context, query, "gate", startEpoch, endEpoch, startOfMonth, endOfMonth);
                    var gateInResultPerDay = await GetResultPerDay(gateInResult, startOfMonth, endOfMonth);
                    var gateOutResultPerDay = await GetResultPerDay(gateOutResult, startOfMonth, endOfMonth);

                    var gateInOutResult = await MergeMonthlyList(gateInResultPerDay, gateOutResultPerDay);

                    // Handle cleaningResult as needed
                    var gateInventoryResult = gateInOutResult.Select(result => new MonthlyGateInventory
                    {
                        date = result.date,
                        day = result.day,
                        gate_in_cost = result.appv_cost,
                        gate_out_cost = result.complete_cost // You can combine the costs or map as needed
                    }).ToList();
                    gateInOutInventoryResult.gate_inventory = gateInventoryResult;

                    monthlyInventoryResult.gate_in_out_inventory = gateInOutInventoryResult;
                }

                return monthlyInventoryResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<(List<TempInventoryResult>?, List<TempInventoryResult>?)> ProcessInventoryResults(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType,
                long startEpoch, long endEpoch, DateTime startOfMonth, DateTime endOfMonth)
        {

            if (inventoryType.EqualsIgnore("lolo"))
            {
                var newQuery = GetInventoryQuery(context, query, "lift-off", startEpoch, endEpoch);
                var gateInResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var newQuery1 = GetInventoryQuery(context, query, "lift-on", startEpoch, endEpoch);
                var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (gateInResult, gateOutResult);
                //var gateInResultPerDay = await GetResultPerDay(gateInResult, startOfMonth, endOfMonth);
                //var gateOutResultPerDay = await GetResultPerDay(gateOutResult, startOfMonth, endOfMonth);

                //var result = await MergeMonthlyList(gateInResultPerDay, gateOutResultPerDay);
                //return result;
            }
            else if (inventoryType.EqualsIgnore("gate"))
            {
                var newQuery = GetInventoryQuery(context, query, "gate-in", startEpoch, endEpoch);
                var gateInResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var newQuery1 = GetInventoryQuery(context, query, "gate-out", startEpoch, endEpoch);
                var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (gateInResult, gateOutResult);

                //var gateInResultPerDay = await GetResultPerDay(gateInResult, startOfMonth, endOfMonth);
                //var gateOutResultPerDay = await GetResultPerDay(gateOutResult, startOfMonth, endOfMonth);

                //var result = await MergeMonthlyList(gateInResultPerDay, gateOutResultPerDay);
                //return result;
            }
            else
            {
                string completedStatus = "COMPLETED";
                var newQuery = GetInventoryQuery(context, query, inventoryType, startEpoch, endEpoch);
                var queryResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var approvedResult = queryResult.Where(s => !StatusCondition.BeforeApprove.Contains(s.status)).ToList();
                var completeResult = queryResult.Where(s => s.status.Equals(completedStatus) && s.complete_date != null).ToList();

                return (approvedResult, completeResult);
                //var approveResultPerDay = await GetResultPerDay(approvedResult, startOfMonth, endOfMonth);
                //var completeResultPerDay = await GetResultPerDay(completeResult, startOfMonth, endOfMonth);

                //var result = await MergeMonthlyList(approveResultPerDay, completeResultPerDay);
                //return result;

            }
        }

        private IQueryable<TempInventoryResult> GetInventoryQuery(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType, long startEpoch, long endEpoch)
        {
            string yetSurvey = "YET_TO_SURVEY";
            string published = "PUBLISHED";

            switch (inventoryType.ToLower())
            {
                case "repair":
                    return from result in query
                           join s in context.repair on result.sot_guid equals s.sot_guid
                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.total_hour ?? 0.0,
                               appv_date = (long)s.approve_dt,
                               complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };

                case "steaming":
                    return from result in query
                           join s in context.steaming on result.sot_guid equals s.sot_guid
                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.total_cost ?? 0.0,
                               appv_date = (long)s.approve_dt,
                               complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };

                case "cleaning":
                    return from result in query
                           join s in context.cleaning on result.sot_guid equals s.sot_guid
                           where s.delete_dt == null && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.buffer_cost ?? 0.0 + s.cleaning_cost ?? 0.0,
                               appv_date = (long)s.approve_dt,
                               complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };
                case "lift-off":
                    return from result in query
                           join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
                           where s.lift_off == true && ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
                               && s.delete_dt == null
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = (s.lift_off == true ? 1.0 : 0.0) * s.lift_off_cost ?? 0.0,
                               appv_date = (long)ig.eir_dt,
                           };
                case "gate-in":
                    return from result in query
                           join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
                           where ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
                           //&& s.delete_dt == null
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.gate_in_cost ?? 0.0,
                               appv_date = (long)ig.eir_dt,
                           };
                case "lift-on":
                    return from result in query
                           join ig in context.out_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
                           where s.lift_on == true && ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
                           //&& s.delete_dt == null
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = (s.lift_on == true ? 1.0 : 0.0) * s.lift_on_cost ?? 0.0,
                               appv_date = (long)ig.eir_dt,
                           };
                case "gate-out":
                    return from result in query
                           join ig in context.out_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on ig.so_tank_guid equals s.sot_guid
                           where ig.delete_dt == null && ig.eir_dt >= startEpoch && ig.eir_dt <= endEpoch
                           //&& s.delete_dt == null
                           select new TempInventoryResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.gate_in_cost ?? 0.0,
                               appv_date = (long)ig.eir_dt,
                           };
                default:
                    return Enumerable.Empty<TempInventoryResult>().AsQueryable();
            }
        }
        private async Task<List<ResultPerDay>> GetResultPerDay(List<TempInventoryResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
        {
            foreach (var item in resultList)
            {
                // Convert epoch timestamp to DateTimeOffset (local time zone)
                DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds((long)item.appv_date).ToLocalTime();
                // Format the date as yyyy-MM-dd and replace the code with date
                item.date = dateTimeOffset.ToString("dd/MM/yyyy");
            }
            // Group nodes by FormattedDate and count the number of SotGuids for each group
            var groupedNodes = resultList
                .GroupBy(n => n.date)  // Group by formatted date
                .Select(g => new
                {
                    FormattedDate = g.Key,
                    //Count = g.Count(),
                    Cost = g.Select(n => n.cost).Sum() // Get distinct SotGuids
                })
                .OrderBy(g => g.FormattedDate) // Sort by date
                .ToList();

            List<string> allDatesInMonth = new List<string>();
            for (DateTime date = startOfMonth; date <= endOfMonth; date = date.AddDays(1))
            {
                allDatesInMonth.Add(date.ToString("dd/MM/yyyy"));
            }

            // Fill missing dates with count = 0 if not present
            var completeGroupedNodes = allDatesInMonth
                .Select(date => new ResultPerDay
                {
                    date = date,
                    day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
                    //count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0,
                    cost = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Cost ?? 0.0
                })
                .OrderBy(g => g.date) // Sort by date
                .ToList();

            return completeGroupedNodes;
        }
        private async Task<List<ResultPerMonth>> GetResultPerMonth(List<TempInventoryResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
        {
            foreach (var item in resultList)
            {
                // Convert epoch timestamp to DateTimeOffset (local time zone)
                DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds((long)item.appv_date).ToLocalTime();
                // Format the date as yyyy-MM-dd and replace the code with date
                item.date = dateTimeOffset.ToString("MMMM");
            }
            // Group nodes by FormattedDate and count the number of SotGuids for each group
            var groupedNodes = resultList
                .GroupBy(n => n.date)  // Group by formatted date
                .Select(g => new
                {
                    FormattedDate = g.Key,
                    //Count = g.Count(),
                    Cost = g.Select(n => n.cost).Sum() // Get distinct SotGuids
                })
                //.OrderBy(g => g.FormattedDate) // Sort by date
                .ToList();

            List<string> allMonthInYear = new List<string>();
            for (DateTime date = startOfMonth; date <= endOfMonth; date = date.AddMonths(1))
            {
                allMonthInYear.Add(date.ToString("MMMM"));
            }

            // Fill missing dates with count = 0 if not present
            var completeGroupedNodes = allMonthInYear
                .Select(date => new ResultPerMonth
                {
                    month = date,
                    //day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
                    //count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0,
                    cost = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Cost ?? 0.0
                })
                //.OrderBy(g => g.date) // Sort by date
                .ToList();

            return completeGroupedNodes;
        }
        private async Task<IEnumerable<MergedMonthlyResult>> MergeMonthlyList(List<ResultPerDay> list1, List<ResultPerDay> list2)
        {
            // Join the results based on Date and Day
            var mergedResults = from approve in list1
                                join complete in list2
                                on new { approve.date, approve.day } equals new { complete.date, complete.day } into resultGroup
                                from complete in resultGroup.DefaultIfEmpty()
                                select new MergedMonthlyResult
                                {
                                    date = approve.date,
                                    day = approve.day,
                                    appv_cost = approve.cost,
                                    complete_cost = complete?.cost ?? 0 // Use 0 if null
                                };

            return mergedResults.ToList();
        }
        private async Task<IEnumerable<MergedYearlyResult>> MergeYearlyList(List<ResultPerMonth> list1, List<ResultPerMonth> list2)
        {
            // Join the results based on Date and Day
            var mergedResults = from approve in list1
                                join complete in list2
                                on new { approve.month } equals new { complete.month } into resultGroup
                                from complete in resultGroup.DefaultIfEmpty()
                                select new MergedYearlyResult
                                {
                                    month = approve.month,
                                    appv_cost = approve.cost,
                                    complete_cost = complete?.cost ?? 0 // Use 0 if null
                                };

            return mergedResults.ToList();
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<List<OrderTrackingResult>?> QueryOrderTracking(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, OrderTrackingRequest orderTrackingRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                long sDate = orderTrackingRequest.start_date;
                long eDate = orderTrackingRequest.end_date;

                IQueryable<OrderTrackingResult> query;

                if (orderTrackingRequest.order_type.EqualsIgnore("ro"))
                {
                    query = (from ro in context.Set<release_order>()
                             join ros in context.Set<release_order_sot>() on ro.guid equals ros.ro_guid
                             join sot in context.storing_order_tank on ros.sot_guid equals sot.guid
                             join so in context.Set<storing_order>() on sot.so_guid equals so.guid
                             join cc in context.customer_company on ro.customer_company_guid equals cc.guid
                             join ig in context.out_gate on sot.guid equals ig.so_tank_guid
                             join tc in context.Set<tariff_cleaning>() on sot.last_cargo_guid equals tc.guid
                             where ro.create_dt >= sDate && ro.create_dt <= eDate &&
                             (string.IsNullOrEmpty(orderTrackingRequest.job_no) || sot.job_no.Contains(orderTrackingRequest.job_no)) &&
                             (string.IsNullOrEmpty(orderTrackingRequest.ro_no) || ro.ro_no.Contains(orderTrackingRequest.ro_no))
                             select new OrderTrackingResult
                             {
                                 tank_no = sot.tank_no,
                                 eir_no = ig.eir_no,
                                 eir_date = ig.eir_dt,
                                 release_date = ro.release_dt,
                                 customer_code = cc.code,
                                 customer_name = cc.name,
                                 last_cargo = tc.cargo,
                                 order_no = ro.ro_no,
                                 order_date = ro.create_dt,
                                 cancel_date = ro.delete_dt,
                                 cancel_remarks = ro.remarks,
                                 status = sot.status_cv,
                                 purpose_cleaning = sot.purpose_cleaning,
                                 purpose_steaming = sot.purpose_steam,
                                 purpose_repair = sot.purpose_repair_cv,
                                 purpose_storage = sot.purpose_storage
                             }).AsQueryable();
                }
                else
                {
                    query = (from so in context.storing_order
                             join sot in context.storing_order_tank on so.guid equals sot.so_guid
                             join ros in context.Set<release_order_sot>() on sot.guid equals ros.sot_guid
                             join ro in context.Set<release_order>() on ros.ro_guid equals ro.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             join ig in context.in_gate on sot.guid equals ig.so_tank_guid
                             join tc in context.Set<tariff_cleaning>() on sot.last_cargo_guid equals tc.guid
                             where so.create_dt >= sDate && so.create_dt <= eDate &&
                             (string.IsNullOrEmpty(orderTrackingRequest.job_no) || sot.job_no.Contains(orderTrackingRequest.job_no)) &&
                             (string.IsNullOrEmpty(orderTrackingRequest.so_no) || so.so_no.Contains(orderTrackingRequest.so_no))
                             select new OrderTrackingResult
                             {
                                 tank_no = sot.tank_no,
                                 eir_no = ig.eir_no,
                                 eir_date = ig.eir_dt,
                                 release_date = ro.release_dt,
                                 customer_code = cc.code,
                                 customer_name = cc.name,
                                 last_cargo = tc.cargo,
                                 order_no = so.so_no,
                                 order_date = so.create_dt,
                                 cancel_date = so.delete_dt,
                                 cancel_remarks = so.remarks,
                                 status = sot.status_cv,
                                 purpose_cleaning = sot.purpose_cleaning,
                                 purpose_steaming = sot.purpose_steam,
                                 purpose_repair = sot.purpose_repair_cv,
                                 purpose_storage = sot.purpose_storage
                             }).AsQueryable();
                }
                   

                if (!string.IsNullOrEmpty(orderTrackingRequest.customer_code))
                {
                    query = query.Where(tr => tr.customer_code.Contains(orderTrackingRequest.customer_code));
                }
                if (!string.IsNullOrEmpty(orderTrackingRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(orderTrackingRequest.eir_no));
                }
                if (!string.IsNullOrEmpty(orderTrackingRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(orderTrackingRequest.tank_no));
                }
                if (!string.IsNullOrEmpty(orderTrackingRequest.last_cargo))
                {
                    query = query.Where(tr => tr.last_cargo.Contains(orderTrackingRequest.last_cargo));
                }
                if (orderTrackingRequest.status != null && orderTrackingRequest.status.Any())
                {
                    query = query.Where(tr => orderTrackingRequest.status.Contains(tr.status));
                }

                var resultList = await query.OrderBy(tr => tr.order_date).ToListAsync();
                resultList.ForEach(result => result.CompileFinalPurpose());
                return resultList;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }



        ////[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        ////[UseProjection]
        ////[UseFiltering]
        ////[UseSorting]
        //public async Task<SurveyorPerformanceSummary?> QuerySurveyorPerformanceSummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //        [Service] IHttpContextAccessor httpContextAccessor, SurveyorPerformanceSummaryRequest surveyorPerfSummaryRequest)
        //{

        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);

        //        //string completedStatus = "COMPLETED";
        //        //long sDate = surveyorPerfSummaryRequest.start_date;
        //        //long eDate = surveyorPerfSummaryRequest.end_date;

        //        int year = surveyorPerfSummaryRequest.year;
        //        int start_month = surveyorPerfSummaryRequest.start_month;
        //        int end_month = surveyorPerfSummaryRequest.end_month;

        //        // Get the start date of the month (1st of the month)
        //        DateTime startOfMonth = new DateTime(year, start_month, 1);
        //        // Get the end date of the month (last day of the month)
        //        // Get the number of days in the specified month
        //        int daysInMonth = DateTime.DaysInMonth(year, end_month);
        //        DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
        //        // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
        //        long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
        //        long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

        //        var query = (from r in context.repair
        //                         //join rp in context.Set<repair_part>() on r.guid equals rp.repair_guid
        //                     join sot in context.storing_order_tank on r.sot_guid equals sot.guid
        //                     join so in context.storing_order on sot.so_guid equals so.guid
        //                     join cc in context.customer_company on so.customer_company_guid equals cc.guid
        //                     join us in context.Set<aspnetusers>() on r.aspnetusers_guid equals us.Id
        //                     where r.delete_dt == null && r.create_dt != null && r.create_dt >= startEpoch && r.create_dt <= endEpoch
        //                     orderby r.create_dt
        //                     select new TempSurveyorPerformance
        //                     {
        //                         date = (long)r.create_dt,
        //                         customer_code = cc.code,
        //                         surveyor_name = us.UserName,
        //                         est_cost = r.est_cost,
        //                         appv_cost = r.total_cost,
        //                         diff_cost = r.est_cost ?? 0.0 - r.total_cost,
        //                         repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

        //                     }).AsQueryable();


        //        if (!string.IsNullOrEmpty(surveyorPerfSummaryRequest.customer_code))
        //        {
        //            query = query.Where(tr => tr.customer_code.Contains(surveyorPerfSummaryRequest.customer_code));
        //        }
        //        if (surveyorPerfSummaryRequest.repair_type != null && surveyorPerfSummaryRequest.repair_type.Any())
        //        {
        //            query = query.Where(tr => surveyorPerfSummaryRequest.repair_type.Contains(tr.repair_type));
        //        }
        //        if (surveyorPerfSummaryRequest.surveyor_name != null && surveyorPerfSummaryRequest.surveyor_name.Any())
        //        {
        //            query = query.Where(tr => surveyorPerfSummaryRequest.surveyor_name.Contains(tr.surveyor_name));
        //        }

        //        var resultList = await query.ToListAsync();

        //        //This to make sure the result list have data
        //        if (!resultList.Any())
        //            return null;

        //        // Convert epoch timestamp to local date (yyyy-MM-dd)
        //        foreach (var item in resultList)
        //        {
        //            // Convert epoch timestamp to DateTimeOffset (local time zone)
        //            DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(item.date).ToLocalTime();
        //            // Format the date as yyyy-MM-dd and replace the code with date
        //            item.month = dateTimeOffset.ToString("MMMM");
        //        }
        //        var groupedNodes = resultList
        //               .GroupBy(n => new { n.month, n.surveyor_name })  // Group by formatted date
        //               .Select(g => new
        //               {
        //                   Month = g.Key.month,
        //                   Surveyor = g.Key.surveyor_name,
        //                   Count = g.Count(),
        //                   Est_Cost = g.Select(n => n.est_cost).Sum(), // Get distinct SotGuids
        //                   Appr_Cost = g.Select(n => n.appv_cost).Sum(),
        //                   Diff_Cost = g.Select(n => n.diff_cost).Sum(),

        //               })
        //               .GroupBy(x => x.Month) // Further group by Month
        //               .Select(g => new MonthlySummary
        //               {
        //                   month = g.Key,
        //                   SurveyorList = g.Select(x => new SurveyorList
        //                   {
        //                       surveyor_name = x.Surveyor,        // Just keep Surveyor, no Month here
        //                       est_count = x.Count,
        //                       est_cost = x.Est_Cost,
        //                       appv_cost = x.Appr_Cost,
        //                       diff_cost = x.Diff_Cost,
        //                       average = x.Appr_Cost / x.Count,
        //                       rejected = x.Diff_Cost < 0 ? 0 : x.Diff_Cost / x.Est_Cost
        //                   }).ToList(),
        //                   monthly_total_est_count = g.Sum(x => x.Count),
        //                   monthly_total_est_cost = g.Sum(x => x.Est_Cost),
        //                   monthly_total_appv_cost = g.Sum(x => x.Appr_Cost),
        //                   monthly_total_diff_cost = g.Sum(x => x.Diff_Cost),
        //                   monthly_total_average = g.Sum(x => x.Appr_Cost) / g.Sum(x => x.Count),
        //                   //monthly_total_rejected = g.Sum(x => x.Diff_Cost < 0 ? 0 : x.Diff_Cost) / g.Sum(x => x.Est_Cost)
        //                   monthly_total_rejected = (g.Sum(x => x.Diff_Cost)) < 0 ? 0 : g.Sum(x => x.Diff_Cost) / g.Sum(x => x.Est_Cost)
        //               })
        //               .ToList();

        //        SurveyorPerformanceSummary surveyorPerformanceResult = new SurveyorPerformanceSummary();
        //        surveyorPerformanceResult.monthly_summary = groupedNodes;
        //        surveyorPerformanceResult.grand_total_est_count = groupedNodes.Sum(g => g.monthly_total_est_count);
        //        surveyorPerformanceResult.grand_total_est_cost = groupedNodes.Sum(g => g.monthly_total_est_cost);
        //        surveyorPerformanceResult.grand_total_appv_cost = groupedNodes.Sum(g => g.monthly_total_appv_cost);
        //        surveyorPerformanceResult.grand_total_diff_cost = groupedNodes.Sum(g => g.monthly_total_diff_cost);
        //        surveyorPerformanceResult.grand_total_average = surveyorPerformanceResult.grand_total_appv_cost < 0 ? 0 : surveyorPerformanceResult.grand_total_appv_cost
        //                                                        / surveyorPerformanceResult.grand_total_est_count;
        //        surveyorPerformanceResult.grand_total_rejected = surveyorPerformanceResult.grand_total_diff_cost < 0 ? 0 : surveyorPerformanceResult.grand_total_diff_cost
        //                                                        / surveyorPerformanceResult.grand_total_est_cost;


        //        return surveyorPerformanceResult;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}


        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public async Task<List<SurveyorPerformanceDetail>?> QuerySurveyorPerformanceDetail(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //[Service] IHttpContextAccessor httpContextAccessor, SurveyorPerformanceDetailRequest surveyorPerfDetailRequest)
        //{

        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);

        //        string estimateStatus = "CANCELED";
        //        long sDate = surveyorPerfDetailRequest.start_date;
        //        long eDate = surveyorPerfDetailRequest.end_date;

        //        //int year = surveyorPerfDetailRequest.year;
        //        //int start_month = surveyorPerfDetailRequest.start_month;
        //        //int end_month = surveyorPerfDetailRequest.end_month;

        //        //// Get the start date of the month (1st of the month)
        //        //DateTime startOfMonth = new DateTime(year, start_month, 1);
        //        //// Get the end date of the month (last day of the month)
        //        //// Get the number of days in the specified month
        //        //int daysInMonth = DateTime.DaysInMonth(year, end_month);
        //        //DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
        //        //// Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
        //        //long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
        //        //long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

        //        var query = (from r in context.repair
        //                         //join rp in context.Set<repair_part>() on r.guid equals rp.repair_guid
        //                     join sot in context.storing_order_tank on r.sot_guid equals sot.guid
        //                     join so in context.storing_order on sot.so_guid equals so.guid
        //                     join cc in context.customer_company on so.customer_company_guid equals cc.guid
        //                     join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
        //                     join us in context.Set<aspnetusers>() on r.aspnetusers_guid equals us.Id
        //                     where r.delete_dt == null && r.status_cv != estimateStatus && r.create_dt != null && r.create_dt >= sDate && r.create_dt <= eDate
        //                     orderby r.create_dt
        //                     select new TempSurveyorPerformanceDetail
        //                     {
        //                         tank_no = sot.tank_no,
        //                         eir_date = (long)ig.eir_dt,
        //                         eir_no = ig.eir_no,
        //                         est_no = r.estimate_no,
        //                         est_date = r.create_dt,
        //                         appv_date = r.approve_dt,
        //                         est_cost = r.est_cost,
        //                         appv_cost = r.total_cost,
        //                         customer_code = cc.code,
        //                         surveyor_name = us.UserName,
        //                         est_status = r.status_cv,
        //                         est_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv
        //                     }).AsQueryable();


        //        if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.customer_code))
        //        {
        //            query = query.Where(tr => tr.customer_code.Contains(surveyorPerfDetailRequest.customer_code));
        //        }
        //        if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.tank_no))
        //        {
        //            query = query.Where(tr => tr.tank_no.Contains(surveyorPerfDetailRequest.tank_no));
        //        }
        //        if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.eir_no))
        //        {
        //            query = query.Where(tr => tr.eir_no.Contains(surveyorPerfDetailRequest.eir_no));
        //        }
        //        if (surveyorPerfDetailRequest.repair_type != null && surveyorPerfDetailRequest.repair_type.Any())
        //        {
        //            query = query.Where(tr => surveyorPerfDetailRequest.repair_type.Contains(tr.est_type));
        //        }
        //        if (surveyorPerfDetailRequest.surveyor_name != null && surveyorPerfDetailRequest.surveyor_name.Any())
        //        {
        //            query = query.Where(tr => surveyorPerfDetailRequest.surveyor_name.Contains(tr.surveyor_name));
        //        }
        //        if (surveyorPerfDetailRequest.estimate_status != null && surveyorPerfDetailRequest.estimate_status.Any())
        //        {
        //            query = query.Where(tr => surveyorPerfDetailRequest.estimate_status.Contains(tr.est_status));
        //        }

        //        var resultList = await query.ToListAsync();

        //        //This to make sure the result list have data
        //        if (!resultList.Any())
        //            return null;

        //        //// Convert epoch timestamp to local date (yyyy-MM-dd)
        //        //foreach (var item in resultList)
        //        //{
        //        //    // Convert epoch timestamp to DateTimeOffset (local time zone)
        //        //    DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds((long)item.eir_date).ToLocalTime();
        //        //    // Format the date as yyyy-MM-dd and replace the code with date
        //        //    item.month = dateTimeOffset.ToString("MMMM");
        //        //}

        //        var surveyorPerformanceDetail = resultList
        //               .GroupBy(n => new { n.surveyor_name })  // Group by formatted date
        //               .Select(g => new SurveyorPerformanceDetail
        //               {
        //                   surveyor = g.Key.surveyor_name,
        //                   surveyor_details = g.Select(x => new SurveyorDetail
        //                   {
        //                       tank_no = x.tank_no,
        //                       eir_no = x.eir_no,
        //                       eir_date = x.eir_date,
        //                       est_type = x.est_type,
        //                       est_no = x.est_no,
        //                       est_date = x.est_date,
        //                       est_cost = x.est_cost,
        //                       appv_date = x.appv_date,
        //                       appv_cost = x.appv_cost,
        //                       est_status = x.est_status
        //                   }).ToList(),
        //                   total_est_cost = g.Select(x => x.est_cost).Sum(), // Get distinct SotGuids
        //                   total_appv_cost = g.Select(x => x.appv_cost).Sum(),
        //               }).ToList();

        //        return surveyorPerformanceDetail; //surveyorPerformanceResult;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}


        //#endregion

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public async Task<List<DailyTeamRevenue>> QueryDailyTeamRevenue(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //  [Service] IHttpContextAccessor httpContextAccessor, DailyTeamRevenuRequest dailyTeamRevenueRequest)
        //{
        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        List<DailyTeamRevenue> result = new List<DailyTeamRevenue>();

        //        //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
        //        //string surveryorCodeValType = "TEST_CLASS";
        //        string repairStatus = "QC_COMPLETED";

        //        //long sDate = dailyTeamRevenueRequest.start_date;
        //        //long eDate = dailyTeamRevenueRequest.end_date;

        //        var query = (from r in context.repair
        //                     join rp in context.repair_part on r.guid equals rp.repair_guid
        //                     join jo in context.job_order on rp.job_order_guid equals jo.guid
        //                     join t in context.team on jo.team_guid equals t.guid
        //                     join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
        //                     join so in context.storing_order on sot.so_guid equals so.guid into soGroup
        //                     from so in soGroup.DefaultIfEmpty()
        //                     join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
        //                     from cc in ccGroup.DefaultIfEmpty()
        //                     join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
        //                     where r.delete_dt == null && r.status_cv == repairStatus && !string.IsNullOrEmpty(sot.purpose_repair_cv)
        //                     select new DailyTeamRevenue
        //                     {
        //                         estimate_no = r.estimate_no,
        //                         tank_no = sot.tank_no,
        //                         code = cc.code,
        //                         estimate_date = r.create_dt,
        //                         approved_date = r.approve_dt,
        //                         allocation_date = r.allocate_dt,
        //                         qc_by = jo.qc_by,
        //                         qc_date = jo.qc_dt,
        //                         eir_no = ig.eir_no,
        //                         repair_cost = r.total_cost,
        //                         team = t.description,
        //                         repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

        //                     }).AsQueryable();

        //        if (dailyTeamRevenueRequest.qc_start_date != null && dailyTeamRevenueRequest.qc_end_date != null)
        //        {
        //            query = query.Where(tr => tr.qc_date >= dailyTeamRevenueRequest.qc_start_date && tr.qc_date <= dailyTeamRevenueRequest.qc_end_date);
        //        }

        //        if (dailyTeamRevenueRequest.approved_start_date != null && dailyTeamRevenueRequest.approved_end_date != null)
        //        {
        //            query = query.Where(tr => tr.approved_date >= dailyTeamRevenueRequest.approved_start_date && tr.approved_date <= dailyTeamRevenueRequest.approved_end_date);
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.customer_code))
        //        {
        //            query = query.Where(tr => String.Equals(tr.code, dailyTeamRevenueRequest.customer_code, StringComparison.OrdinalIgnoreCase));
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.tank_no))
        //        {
        //            query = query.Where(tr => tr.tank_no.Contains(dailyTeamRevenueRequest.tank_no));
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.eir_no))
        //        {
        //            query = query.Where(tr => tr.eir_no.Contains(dailyTeamRevenueRequest.eir_no));
        //        }

        //        if (dailyTeamRevenueRequest.repair_type != null && dailyTeamRevenueRequest.repair_type.Any())
        //        {
        //            query = query.Where(tr => dailyTeamRevenueRequest.repair_type.Contains(tr.repair_type));
        //        }

        //        if (dailyTeamRevenueRequest.estimate_start_date != null && dailyTeamRevenueRequest.estimate_end_date != null)
        //        {
        //            query = query.Where(tr => tr.estimate_date >= dailyTeamRevenueRequest.estimate_start_date && tr.estimate_date <= dailyTeamRevenueRequest.estimate_end_date);
        //        }

        //        if (dailyTeamRevenueRequest.allocation_start_date != null && dailyTeamRevenueRequest.allocation_end_date != null)
        //        {
        //            query = query.Where(tr => tr.allocation_date >= dailyTeamRevenueRequest.allocation_start_date && tr.allocation_date <= dailyTeamRevenueRequest.allocation_end_date);
        //        }

        //        if (dailyTeamRevenueRequest.team != null && dailyTeamRevenueRequest.team.Any())
        //        {
        //            query = query.Where(tr => dailyTeamRevenueRequest.team.Contains(tr.team));
        //        }

        //        return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.approved_date).ToListAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public async Task<List<DailyTeamApproval>> QueryDailyTeamApproval(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //  [Service] IHttpContextAccessor httpContextAccessor, DailyTeamApprovalRequest dailyTeamApprovalRequest)
        //{
        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        List<DailyTeamApproval> result = new List<DailyTeamApproval>();

        //        //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
        //        //string surveryorCodeValType = "TEST_CLASS";
        //        //string repairStatus = "QC_COMPLETED";

        //        //long sDate = dailyTeamRevenueRequest.start_date;
        //        //long eDate = dailyTeamRevenueRequest.end_date;

        //        var query = (from r in context.repair
        //                     join rp in context.repair_part on r.guid equals rp.repair_guid
        //                     join jo in context.job_order on rp.job_order_guid equals jo.guid
        //                     join t in context.team on jo.team_guid equals t.guid
        //                     join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
        //                     join so in context.storing_order on sot.so_guid equals so.guid into soGroup
        //                     from so in soGroup.DefaultIfEmpty()
        //                     join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
        //                     from cc in ccGroup.DefaultIfEmpty()
        //                     join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
        //                     where r.delete_dt == null && !StatusCondition.BeforeApprove.Contains(r.status_cv) && r.approve_dt != null
        //                     && !string.IsNullOrEmpty(sot.purpose_repair_cv)
        //                     select new DailyTeamApproval
        //                     {
        //                         estimate_no = r.estimate_no,
        //                         tank_no = sot.tank_no,
        //                         code = cc.code,
        //                         estimate_date = r.create_dt,
        //                         approved_date = r.approve_dt,
        //                         allocation_date = r.allocate_dt,
        //                         qc_date = jo.qc_dt,
        //                         eir_no = ig.eir_no,
        //                         repair_cost = r.total_cost,
        //                         team = t.description,
        //                         status = r.status_cv,
        //                         repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

        //                     }).AsQueryable();

        //        if (dailyTeamApprovalRequest.approved_start_date != null && dailyTeamApprovalRequest.approved_end_date != null)
        //        {
        //            query = query.Where(tr => tr.approved_date >= dailyTeamApprovalRequest.approved_start_date && tr.approved_date <= dailyTeamApprovalRequest.approved_end_date);
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.customer_code))
        //        {
        //            query = query.Where(tr => String.Equals(tr.code, dailyTeamApprovalRequest.customer_code, StringComparison.OrdinalIgnoreCase));
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.tank_no))
        //        {
        //            query = query.Where(tr => tr.tank_no.Contains(dailyTeamApprovalRequest.tank_no));
        //        }

        //        if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.eir_no))
        //        {
        //            query = query.Where(tr => tr.eir_no.Contains(dailyTeamApprovalRequest.eir_no));
        //        }

        //        if (dailyTeamApprovalRequest.repair_type != null && dailyTeamApprovalRequest.repair_type.Any())
        //        {
        //            query = query.Where(tr => dailyTeamApprovalRequest.repair_type.Contains(tr.repair_type));
        //        }

        //        if (dailyTeamApprovalRequest.estimate_start_date != null && dailyTeamApprovalRequest.estimate_end_date != null)
        //        {
        //            query = query.Where(tr => tr.estimate_date >= dailyTeamApprovalRequest.estimate_start_date && tr.estimate_date <= dailyTeamApprovalRequest.estimate_end_date);
        //        }

        //        if (dailyTeamApprovalRequest.allocation_start_date != null && dailyTeamApprovalRequest.allocation_end_date != null)
        //        {
        //            query = query.Where(tr => tr.allocation_date >= dailyTeamApprovalRequest.allocation_start_date && tr.allocation_date <= dailyTeamApprovalRequest.allocation_end_date);
        //        }

        //        if (dailyTeamApprovalRequest.qc_start_date != null && dailyTeamApprovalRequest.qc_end_date != null)
        //        {
        //            query = query.Where(tr => tr.qc_date >= dailyTeamApprovalRequest.qc_start_date && tr.qc_date <= dailyTeamApprovalRequest.qc_end_date);
        //        }

        //        if (dailyTeamApprovalRequest.team != null && dailyTeamApprovalRequest.team.Any())
        //        {
        //            query = query.Where(tr => dailyTeamApprovalRequest.team.Contains(tr.team));
        //        }

        //        return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.approved_date).ToListAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public async Task<List<DailyQCDetail>> QueryDailyQCDetail(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //  [Service] IHttpContextAccessor httpContextAccessor, DailyQCDetailRequest dailyQCDetailRequest)
        //{
        //    try
        //    {
        //        ///Havent complete --- labour cost, material cost   
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        List<DailyTeamApproval> result = new List<DailyTeamApproval>();

        //        //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
        //        //string surveryorCodeValType = "TEST_CLASS";
        //        string repairStatus = "QC_COMPLETED";

        //        //long sDate = dailyTeamRevenueRequest.start_date;
        //        //long eDate = dailyTeamRevenueRequest.end_date;

        //        var query = (from r in context.repair
        //                     join rp in context.repair_part on r.guid equals rp.repair_guid
        //                     join jo in context.job_order on rp.job_order_guid equals jo.guid
        //                     join t in context.team on jo.team_guid equals t.guid
        //                     join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
        //                     join so in context.storing_order on sot.so_guid equals so.guid into soGroup
        //                     from so in soGroup.DefaultIfEmpty()
        //                     join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
        //                     from cc in ccGroup.DefaultIfEmpty()
        //                     join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
        //                     where r.delete_dt == null && r.status_cv == repairStatus && !string.IsNullOrEmpty(sot.purpose_repair_cv)
        //                     select new DailyQCDetail
        //                     {
        //                         estimate_no = r.estimate_no,
        //                         tank_no = sot.tank_no,
        //                         code = cc.code,
        //                         estimate_date = r.create_dt,
        //                         approved_date = r.approve_dt,
        //                         allocation_date = r.allocate_dt,
        //                         qc_date = jo.qc_dt,
        //                         eir_no = ig.eir_no,
        //                         repair_cost = r.total_cost,
        //                         //team = t.description,
        //                         appv_hour = 1, // need to change 
        //                         appv_material_cost = 100 - r.material_cost_discount, //need to change
        //                         repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

        //                     }).AsQueryable();

        //        if (dailyQCDetailRequest.qc_start_date != null && dailyQCDetailRequest.qc_end_date != null)
        //        {
        //            query = query.Where(tr => tr.qc_date >= dailyQCDetailRequest.qc_start_date && tr.qc_date <= dailyQCDetailRequest.qc_end_date);
        //        }

        //        if (dailyQCDetailRequest.approved_start_date != null && dailyQCDetailRequest.approved_end_date != null)
        //        {
        //            query = query.Where(tr => tr.approved_date >= dailyQCDetailRequest.approved_start_date && tr.approved_date <= dailyQCDetailRequest.approved_end_date);
        //        }

        //        if (!string.IsNullOrEmpty(dailyQCDetailRequest.customer_code))
        //        {
        //            query = query.Where(tr => String.Equals(tr.code, dailyQCDetailRequest.customer_code, StringComparison.OrdinalIgnoreCase));
        //        }

        //        if (!string.IsNullOrEmpty(dailyQCDetailRequest.tank_no))
        //        {
        //            query = query.Where(tr => tr.tank_no.Contains(dailyQCDetailRequest.tank_no));
        //        }

        //        if (!string.IsNullOrEmpty(dailyQCDetailRequest.eir_no))
        //        {
        //            query = query.Where(tr => tr.eir_no.Contains(dailyQCDetailRequest.eir_no));
        //        }

        //        if (dailyQCDetailRequest.repair_type != null && dailyQCDetailRequest.repair_type.Any())
        //        {
        //            query = query.Where(tr => dailyQCDetailRequest.repair_type.Contains(tr.repair_type));
        //        }

        //        if (dailyQCDetailRequest.estimate_start_date != null && dailyQCDetailRequest.estimate_end_date != null)
        //        {
        //            query = query.Where(tr => tr.estimate_date >= dailyQCDetailRequest.estimate_start_date && tr.estimate_date <= dailyQCDetailRequest.estimate_end_date);
        //        }

        //        if (dailyQCDetailRequest.allocation_start_date != null && dailyQCDetailRequest.allocation_end_date != null)
        //        {
        //            query = query.Where(tr => tr.allocation_date >= dailyQCDetailRequest.allocation_start_date && tr.allocation_date <= dailyQCDetailRequest.allocation_end_date);
        //        }
        //        //if (dailyQCDetailRequest.team != null && dailyQCDetailRequest.team.Any())
        //        //{
        //        //    query = query.Where(tr => dailyQCDetailRequest.team.Contains(tr.team));
        //        //}

        //        return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.qc_date).ToListAsync();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

        //private async Task<List<SteamingTempResult>> GetSteamingTempResults(ApplicationBillingDBContext context, List<string> jobOrderGuids)
        //{
        //    var results = await context.Set<steaming_temp>()
        //        .Where(s => jobOrderGuids.Contains(s.job_order_guid))
        //        .GroupBy(s => s.job_order_guid)
        //        .Select(g => new SteamingTempResult
        //        {
        //            JobOrderGuid = g.Key,
        //            FirstMeterTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
        //            FirstTopTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
        //            FirstBottomTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault(),
        //            LastMeterTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
        //            LastTopTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
        //            LastBottomTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault()
        //        })
        //        .ToListAsync();

        //    return results;
        //}

        //private async Task<List<SteamingTempResult>> GetSteamingTempResults1(ApplicationBillingDBContext context, List<string> jobOrderGuids)
        //{
        //    // Subquery to get the first report date for each job_order_guid
        //    var firstReportDt = context.Set<steaming_temp>()
        //        .Where(s => jobOrderGuids.Contains(s.job_order_guid))
        //        .GroupBy(s => s.job_order_guid)
        //        .Select(g => new
        //        {
        //            JobOrderGuid = g.Key,
        //            MinReportDt = g.Min(s => s.report_dt)
        //        });

        //    // Subquery to get the last report date for each job_order_guid
        //    var lastReportDt = context.Set<steaming_temp>()
        //        .Where(s => jobOrderGuids.Contains(s.job_order_guid))
        //        .GroupBy(s => s.job_order_guid)
        //        .Select(g => new
        //        {
        //            JobOrderGuid = g.Key,
        //            MaxReportDt = g.Max(s => s.report_dt)
        //        });

        //    // Main query to join the steaming temperature data with the first and last report dates
        //    var query = context.Set<steaming_temp>()
        //        .Join(firstReportDt, s => s.job_order_guid, fr => fr.JobOrderGuid, (s, fr) => new { s, fr })
        //        .Join(lastReportDt, combined => combined.s.job_order_guid, lr => lr.JobOrderGuid, (combined, lr) => new { combined.s, combined.fr, lr })
        //        .Where(x => jobOrderGuids.Contains(x.s.job_order_guid))
        //        .GroupBy(x => x.s.job_order_guid)
        //        .Select(g => new SteamingTempResult
        //        {
        //            JobOrderGuid = g.Key,
        //            FirstMeterTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.meter_temp),
        //            FirstTopTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.top_temp),
        //            FirstBottomTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.bottom_temp),
        //            FirstRecordTime = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (long?)s.s.report_dt),
        //            LastMeterTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.meter_temp),
        //            LastTopTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.top_temp),
        //            LastBottomTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.bottom_temp),
        //            LastRecordTime = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (long?)s.s.report_dt)
        //        })
        //        .ToList();

        //    return query;
        //}

        //private string ConvertIntoDuration(long datetime)
        //{
        //    TimeSpan timeSpan = TimeSpan.FromSeconds(datetime);

        //    // Calculate days, hours, and minutes
        //    int days = (int)timeSpan.TotalDays;
        //    int hours = timeSpan.Hours;
        //    int minutes = timeSpan.Minutes;

        //    // Build the result based on non-zero values
        //    string result = "";

        //    if (days > 0)
        //    {
        //        result += $"{days}d:";
        //    }

        //    if (hours > 0 || days > 0) // Only show hours if there are days or if hours are non-zero
        //    {
        //        result += $"{hours:D2}h:";
        //    }

        //    if (minutes > 0 || hours > 0 || days > 0) // Only show minutes if there are hours or days or minutes are non-zero
        //    {
        //        result += $"{minutes:D2}m";
        //    }

        //    return result;
        //}


    }
}
