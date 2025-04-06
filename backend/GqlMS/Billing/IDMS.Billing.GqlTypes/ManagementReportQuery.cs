using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Billing.Application;
using IDMS.Billing.GqlTypes.BillingResult;
using IDMS.Billing.GqlTypes.LocalModel;
using IDMS.Models;
using IDMS.Models.Billing;
using IDMS.Models.DB;
using IDMS.Models.Inventory;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Globalization;

namespace IDMS.Billing.GqlTypes
{
    [ExtendObjectType(typeof(BillingQuery))]
    public class ManagementReportQuery
    {
        #region InventoryReport
        public async Task<YearlyInventoryResult?> QueryYearlyInventory(ApplicationBillingDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, YearlyInventoryRequest yearlyInventoryRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";
                string reportFormat = "yearly";

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

                DateTime startMonthLastDay = new DateTime(year, start_month, DateTime.DaysInMonth(year, start_month));
                long startMonthLastDayEpoch = ((DateTimeOffset)startMonthLastDay).ToUnixTimeSeconds();

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

                foreach(var item in yearlyInventoryRequest.inventory_type)
                {
                    if (item.EqualsIgnore("repair") || item.EqualsIgnore("all"))
                    {
                        var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "repair", startEpoch, endEpoch, reportFormat);

                        var approveResultPerMonth = await GetInventoryPerMonth(approvedResult, startOfMonth, endOfMonth);
                        var total_count = approveResultPerMonth.Sum(g => g.count);
                        var average_count = total_count / 12;
                        //var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);
                        //var repairResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                        var repairInventory = approveResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();

                        // Handle repairResult as needed
                        YearlyInventory yearlyInventory = new YearlyInventory();
                        yearlyInventory.inventory_per_month = repairInventory;
                        yearlyInventory.total_count = total_count;
                        yearlyInventory.average_count = average_count;
                        yearlyInventoryResult.repair_yearly_inventory = yearlyInventory;
                    }

                    if (item.EqualsIgnore("steaming") || item.EqualsIgnore("all"))
                    {
                        var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "steaming", startEpoch, endEpoch, reportFormat);

                        var approveResultPerMonth = await GetInventoryPerMonth(approvedResult, startOfMonth, endOfMonth);
                        //var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);
                        var total_count = approveResultPerMonth.Sum(g => g.count);
                        var average_count = total_count / 12;

                        //var steamingResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                        // Handle steamingResult as needed
                        var steamingInventory = approveResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();

                        // Handle repairResult as needed
                        YearlyInventory yearlyInventory = new YearlyInventory();
                        yearlyInventory.inventory_per_month = steamingInventory;
                        yearlyInventory.total_count = total_count;
                        yearlyInventory.average_count = average_count;
                        yearlyInventoryResult.steaming_yearly_inventory = yearlyInventory;
                    }

                    if (item.EqualsIgnore("cleaning") || item.EqualsIgnore("all"))
                    {
                        var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);
                        var approveResultPerMonth = await GetInventoryPerMonth(approvedResult, startOfMonth, endOfMonth);
                        //var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);
                        var total_count = approveResultPerMonth.Sum(g => g.count);
                        var average_count = total_count / 12;

                        //var cleaningResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                        // Handle cleaningResult as needed
                        var cleaningInventory = approveResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();

                        YearlyInventory yearlyInventory = new YearlyInventory();
                        yearlyInventory.inventory_per_month = cleaningInventory;
                        yearlyInventory.total_count = total_count;
                        yearlyInventory.average_count = average_count;
                        yearlyInventoryResult.cleaning_yearly_inventory = yearlyInventory;
                    }

                    if (item.EqualsIgnore("depot") || item.EqualsIgnore("all"))
                    {
                        var (approvedResult, completedResult) = await ProcessInventoryResults(context, query, "depot", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                        var approveResultPerMonth = await GetInventoryPerMonth(approvedResult, startOfMonth, endOfMonth);
                        //var completeResultPerMonth = await GetResultPerMonth(completedResult, startOfMonth, endOfMonth);
                        var total_count = approveResultPerMonth.Sum(g => g.count);
                        var average_count = total_count / 12;

                        //var cleaningResult = await MergeYearlyList(approveResultPerMonth, completeResultPerMonth);

                        // Handle cleaningResult as needed
                        var depotInventory = approveResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            //percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();

                        YearlyInventory yearlyInventory = new YearlyInventory();
                        yearlyInventory.inventory_per_month = depotInventory;
                        yearlyInventory.total_count = total_count;
                        yearlyInventory.average_count = average_count;
                        yearlyInventoryResult.depot_yearly_inventory = yearlyInventory;
                    }

                    if (item.EqualsIgnore("in_out") || item.EqualsIgnore("all"))
                    {
                        var (gateInResult, gateOutResult) = await ProcessInventoryResults(context, query, "gate", startEpoch, endEpoch, reportFormat);
                        var gateInResultPerMonth = await GetInventoryPerMonth(gateInResult, startOfMonth, endOfMonth);
                        var total_count = gateInResultPerMonth.Sum(g => g.count);
                        var average_count = total_count / 12;
                        var gInInventoryResult = gateInResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();

                        YearlyInventory yearlyGateInInventory = new YearlyInventory();
                        yearlyGateInInventory.inventory_per_month = gInInventoryResult;
                        yearlyGateInInventory.total_count = total_count;
                        yearlyGateInInventory.average_count = average_count;
                        yearlyInventoryResult.gate_in_inventory = yearlyGateInInventory;

                        var gateOutResultPerMonth = await GetInventoryPerMonth(gateOutResult, startOfMonth, endOfMonth);
                        total_count = gateOutResultPerMonth.Sum(g => g.count);
                        average_count = total_count / 12;
                        var gOutInventoryResult = gateInResultPerMonth.Select(g => new InventoryPerMonth
                        {
                            month = g.month,
                            count = g.count,
                            percentage = CalculatePercentage(g.count, total_count)
                        }).ToList();
                        YearlyInventory yearlyGateOutInventory = new YearlyInventory();
                        yearlyGateOutInventory.inventory_per_month = gOutInventoryResult;
                        yearlyGateOutInventory.total_count = total_count;
                        yearlyGateOutInventory.average_count = average_count;
                        yearlyInventoryResult.gate_in_inventory = yearlyGateOutInventory;
                    }
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

                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";
                string reportFormat = "monthly";

                int year = monthlyInventoryRequest.year;
                int month = monthlyInventoryRequest.month;
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

                foreach(var item in monthlyInventoryRequest.inventory_type)
                {
                    if (item.EqualsIgnore("repair") || item.EqualsIgnore("all"))
                    {
                        (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "repair", startEpoch, endEpoch, reportFormat);

                        var approveResultPerDay = await GetInventoryPerDay(approvedResult, startOfMonth, endOfMonth);
                        var completeResultPerDay = await GetInventoryPerDay(completedResult, startOfMonth, endOfMonth);

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

                    if (item.EqualsIgnore("steaming") || item.EqualsIgnore("all"))
                    {
                        (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "steaming", startEpoch, endEpoch, reportFormat);

                        var approveResultPerDay = await GetInventoryPerDay(approvedResult, startOfMonth, endOfMonth);
                        var completeResultPerDay = await GetInventoryPerDay(completedResult, startOfMonth, endOfMonth);

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

                    if (item.EqualsIgnore("cleaning") || item.EqualsIgnore("all"))
                    {
                        (var approvedResult, var completedResult) = await ProcessInventoryResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);

                        var approveResultPerDay = await GetInventoryPerDay(approvedResult, startOfMonth, endOfMonth);
                        var completeResultPerDay = await GetInventoryPerDay(completedResult, startOfMonth, endOfMonth);

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

                    if (item.EqualsIgnore("in_out") || item.EqualsIgnore("all"))
                    {
                        var gateInOutInventoryResult = new MonthlyGateInOutInventory();

                        (var l_OffResult, var l_OnResult) = await ProcessInventoryResults(context, query, "lolo", startEpoch, endEpoch, reportFormat);
                        var l_OffResultPerDay = await GetInventoryPerDay(l_OffResult, startOfMonth, endOfMonth);
                        var l_OnResultPerDay = await GetInventoryPerDay(l_OnResult, startOfMonth, endOfMonth);

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

                        (var gateInResult, var gateOutResult) = await ProcessInventoryResults(context, query, "gate", startEpoch, endEpoch, reportFormat);
                        var gateInResultPerDay = await GetInventoryPerDay(gateInResult, startOfMonth, endOfMonth);
                        var gateOutResultPerDay = await GetInventoryPerDay(gateOutResult, startOfMonth, endOfMonth);

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
                }
                return monthlyInventoryResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<(List<TempInventoryResult>?, List<TempInventoryResult>?)> ProcessInventoryResults(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType,
                long startEpoch, long endEpoch, string reportFormat, long? startMonthLastDayEpoch = null)
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

            }
            else if (inventoryType.EqualsIgnore("depot"))
            {
                //Only for yearly report type
                var newQuery = GetInventoryQuery(context, query, "depot", startEpoch, endEpoch, startMonthLastDayEpoch);
                var depotResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                //var newQuery1 = GetInventoryQuery(context, query, "depot", startEpoch, endEpoch);
                //var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (depotResult, null);
            }
            else
            {
                string completedStatus = "COMPLETED";
                var newQuery = GetInventoryQuery(context, query, inventoryType, startEpoch, endEpoch);
                var queryResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var approvedResult = queryResult.Where(s => !StatusCondition.BeforeEstimateApprove.Contains(s.status)).ToList();

                List<TempInventoryResult?> completeResult = new List<TempInventoryResult?>();
                if (reportFormat.EqualsIgnore("monthly"))
                {
                    completeResult = queryResult.Where(s => s.status.Equals(completedStatus) && s.complete_date != null).ToList();
                }
                return (approvedResult, completeResult);
            }
        }
        private IQueryable<TempInventoryResult> GetInventoryQuery(ApplicationBillingDBContext context, IQueryable<TempInventoryResult> query, string inventoryType, long startEpoch, long endEpoch, long? startMonthLastDay = null)
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
                case "depot":
                    return from result in query
                           join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                           join og in context.out_gate on result.sot_guid equals og.so_tank_guid
                           where (ig.delete_dt == null && ig.eir_dt <= endEpoch) && (og.delete_dt == null && og.eir_dt > startMonthLastDay)
                           select new TempInventoryResult
                           {
                               sot_guid = ig.so_tank_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = 0.0,
                               appv_date = (long)ig.eir_dt,
                           };
                default:
                    return Enumerable.Empty<TempInventoryResult>().AsQueryable();
            }
        }
        private async Task<List<ResultPerDay>> GetInventoryPerDay(List<TempInventoryResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
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
        private async Task<List<InventoryPerMonth>> GetInventoryPerMonth(List<TempInventoryResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
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
                    Count = g.Count(),
                    //Cost = g.Select(n => n.cost).Sum() // Get distinct SotGuids
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
                .Select(date => new InventoryPerMonth
                {
                    month = date,
                    //day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
                    count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0,
                    //cost = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Cost ?? 0.0
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

        #endregion

        private double CalculatePercentage(int count, int totalCount)
        {

            var result = Math.Ceiling(((float)count / (float)totalCount) * 100);
            return result;
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

                string CANCELED = "CANCELED";
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
                                 cancel_date = ro.status_cv.Equals(CANCELED) ? ro.update_dt : null,
                                 cancel_remarks = ro.status_cv.Equals(CANCELED) ? ro.remarks : "",
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
                                 cancel_date = so.status_cv.Equals(CANCELED) ? so.update_dt : null,
                                 cancel_remarks = so.status_cv.Equals(CANCELED) ? so.remarks : "",
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


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<List<DepotPerformanceResult>?> QueryDepotPerformance(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, DepotPerformanceRequest depotPerformanceRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                int year = depotPerformanceRequest.year;
                int month = depotPerformanceRequest.month;
                string completedStatus = "COMPLETED";
                string cleanType = "cleaning";
                string repairType = "repair";
                string inGateType = "ingate";
                string outGateType = "outgate";
                string depotType = "inyard";

                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, month, 1);
                // Get the end date of the month (last day of the month)
                DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

                var cleaningQuery = await (from s in context.cleaning
                                           join sot in context.storing_order_tank on s.sot_guid equals sot.guid
                                           join so in context.storing_order on sot.so_guid equals so.guid
                                           join cc in context.customer_company on so.customer_company_guid equals cc.guid
                                           where s.complete_dt >= startEpoch && s.complete_dt <= endEpoch && s.status_cv.Equals(completedStatus) && s.delete_dt == null
                                           && (string.IsNullOrEmpty(depotPerformanceRequest.customer_code) || cc.code.Contains(depotPerformanceRequest.customer_code))
                                           select new TempWeeklyData
                                           {
                                               guid = s.sot_guid,
                                               date = s.complete_dt,
                                               type = cleanType
                                           }).Union
                                    (from s in context.repair
                                     join sot in context.storing_order_tank on s.sot_guid equals sot.guid
                                     join so in context.storing_order on sot.so_guid equals so.guid
                                     join cc in context.customer_company on so.customer_company_guid equals cc.guid
                                     where s.approve_dt >= startEpoch && s.approve_dt <= endEpoch && !StatusCondition.BeforeEstimateApprove.Contains(s.status_cv) && s.delete_dt == null
                                     && (string.IsNullOrEmpty(depotPerformanceRequest.customer_code) || cc.code.Contains(depotPerformanceRequest.customer_code))
                                     select new TempWeeklyData
                                     {
                                         guid = s.sot_guid,
                                         date = s.approve_dt,
                                         type = repairType
                                     }).ToListAsync();  //AsQueryable();

                var resClean = cleaningQuery.Where(s => s.type.Equals(cleanType)).OrderBy(s => s.date).ToList();
                var resultCleaning = GetResultInNoOfWeek(resClean);

                var resRepair = cleaningQuery.Where(s => s.type.Equals(repairType)).OrderBy(s => s.date).ToList();
                var resultRepair = GetResultInNoOfWeek(resRepair);

                //gate in gate out
                var gateQuery = await (from s in context.in_gate
                                       join sot in context.storing_order_tank on s.so_tank_guid equals sot.guid
                                       join so in context.storing_order on sot.so_guid equals so.guid
                                       join cc in context.customer_company on so.customer_company_guid equals cc.guid
                                       where s.delete_dt == null && s.eir_dt >= startEpoch && s.eir_dt <= endEpoch
                                       && StatusCondition.InYard.Contains(sot.tank_status_cv)
                                       && (string.IsNullOrEmpty(depotPerformanceRequest.customer_code) || cc.code.Contains(depotPerformanceRequest.customer_code))
                                       select new TempWeeklyData
                                       {
                                           guid = s.so_tank_guid,
                                           date = s.eir_dt,
                                           type = inGateType
                                       }).Union
                              (from s in context.out_gate
                               join sot in context.storing_order_tank on s.so_tank_guid equals sot.guid
                               join so in context.storing_order on sot.so_guid equals so.guid
                               join cc in context.customer_company on so.customer_company_guid equals cc.guid
                               where s.delete_dt == null && s.eir_dt >= startEpoch && s.eir_dt <= endEpoch
                               && StatusCondition.NotInYard.Contains(sot.tank_status_cv)
                               && (string.IsNullOrEmpty(depotPerformanceRequest.customer_code) || cc.code.Contains(depotPerformanceRequest.customer_code))
                               select new TempWeeklyData
                               {
                                   guid = s.so_tank_guid,
                                   date = s.eir_dt,
                                   type = outGateType
                               }).ToListAsync();  //AsQueryable();

                var resInGate = gateQuery.Where(s => s.type.Equals(inGateType)).OrderBy(s => s.date).ToList();
                var resultInGate = GetResultInNoOfWeek(resInGate);

                var resOutGate = gateQuery.Where(s => s.type.Equals(outGateType)).OrderBy(s => s.date).ToList();
                var resultOutGate = GetResultInNoOfWeek(resOutGate);


                var depotQuery = await (from s in context.in_gate
                                     join o in context.Set<out_gate>() on s.so_tank_guid equals o.so_tank_guid
                                     join sot in context.storing_order_tank on s.so_tank_guid equals sot.guid
                                     join so in context.storing_order on sot.so_guid equals so.guid
                                     join cc in context.customer_company on so.customer_company_guid equals cc.guid
                                     where (s.delete_dt == null && s.eir_dt <= endEpoch) && (o.delete_dt == null && o.eir_dt > endEpoch)
                                     && (string.IsNullOrEmpty(depotPerformanceRequest.customer_code) || cc.code.Contains(depotPerformanceRequest.customer_code))
                                     select new TempWeeklyData
                                     {
                                         guid = s.so_tank_guid,
                                         date = s.eir_dt,
                                         type = depotType
                                     }).ToArrayAsync();

                var resDepot = cleaningQuery.OrderBy(s => s.date).ToList();
                var resultDepot = GetResultInNoOfWeek(resDepot);

                var allWeeks = resultCleaning
                        .Concat(resultRepair)
                        .Concat(resultInGate)   
                        .Concat(resultOutGate)
                        .Concat(resultDepot)
                        .Select(r => r.Week_Of_year)
                        .Distinct()
                        .OrderBy(week => week)
                        .ToList();

                // Join the lists and aggregate the counts by week
                var result = allWeeks.Select(week => new
                {
                    weekOfYear = week,
                    c_count = resultCleaning.FirstOrDefault(c => c.Week_Of_year == week)?.count ?? 0,
                    r_count = resultRepair.FirstOrDefault(r => r.Week_Of_year == week)?.count ?? 0,
                    in_count = resultInGate.FirstOrDefault(g => g.Week_Of_year == week)?.count ?? 0,
                    out_count = resultOutGate.FirstOrDefault(g => g.Week_Of_year == week)?.count ?? 0,
                    depot_count = resultDepot.FirstOrDefault(g => g.Week_Of_year == week)?.count ?? 0,
                }).Select(item => new DepotPerformanceResult
                {
                    week_of_year = item.weekOfYear,
                    cleaning_count = item.c_count,
                    repair_count = item.r_count,
                    gate_in_count = item.in_count,
                    gate_out_count = item.out_count,
                    depot_count = item.depot_count,
                    total_gate_count = item.in_count + item.out_count, // Calculate the total count here
                    average_gate_count = (item.in_count + item.out_count) / 2// Calculate the average count here
                })
                .ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private List<ResultPerWeek?> GetResultInNoOfWeek(List<TempWeeklyData> resultList)
        {
            var result = (from s in resultList
                          let dateTime = DateTimeOffset.FromUnixTimeSeconds((long)s.date).ToLocalTime().DateTime
                          let weekOfYear = CultureInfo.CurrentCulture.Calendar.GetWeekOfYear(dateTime, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday)
                          group s by weekOfYear into g
                          select new ResultPerWeek
                          {
                              Week_Of_year = g.Key,
                              count = g.Count()
                          }).ToList();

            return result;
        }

        public async Task<MonthlyRevenueResult?> QueryMonthlyRevenue(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, MonthlyRevenueRequest monthlyRevenueRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";
                string reportFormat = "monthly";

                int year = monthlyRevenueRequest.year;
                int month = monthlyRevenueRequest.month;
                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, month, 1);
                // Get the end date of the month (last day of the month)
                DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

                //DateTime startMonthLastDay = new DateTime(year, start_month, DateTime.DaysInMonth(year, start_month));
                //long startMonthLastDayEpoch = ((DateTimeOffset)startMonthLastDay).ToUnixTimeSeconds();

                var query = (from sot in context.storing_order_tank
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             where string.IsNullOrEmpty(monthlyRevenueRequest.customer_code) || cc.code == monthlyRevenueRequest.customer_code
                             select new TempRevenueResult
                             {
                                 sot_guid = sot.guid,
                                 code = cc.code,
                             })
                            .AsQueryable();

                var monthlyRevenueResult = new MonthlyRevenueResult();

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("repair") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "repair", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "repair", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.repair_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("steaming") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "steaming", startEpoch, endEpoch, reportFormat);

                    var revenueQuery = GetRevenueQuery(context, query, "steaming", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.steam_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("cleaning") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "cleaning", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.cleaning_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("residue") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "residue", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.residue_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("lolo") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "lolo", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.lolo_monthly_revenue = monthlyRevenue;
                }


                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("gate") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "gate", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.gate_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("preinspection") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "preinspection", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.preinspection_monthly_revenue = monthlyRevenue;
                }

                if (monthlyRevenueRequest.revenue_type.EqualsIgnore("storage") || monthlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "storage", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerDay(approvedResult, startOfMonth, endOfMonth);
                    var monthlyRevenue = await GetMonthlyRevenue(approveResultPerMonth);
                    monthlyRevenueResult.storage_monthly_revenue = monthlyRevenue;
                }

                return monthlyRevenueResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<YearlyRevenueResult?> QueryYearlyRevenue(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, YearlyRevenueRequest yearlyRevenueRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";
                string reportFormat = "yearly";

                int year = yearlyRevenueRequest.year;
                int start_month = yearlyRevenueRequest.start_month;
                int end_month = yearlyRevenueRequest.end_month;

                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, start_month, 1);
                int daysInMonth = DateTime.DaysInMonth(year, end_month);
                DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Get the end date of the month (last day of the month)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();// Get the start date of the month (1st of the month)

                DateTime startMonthLastDay = new DateTime(year, start_month, DateTime.DaysInMonth(year, start_month));
                long startMonthLastDayEpoch = ((DateTimeOffset)startMonthLastDay).ToUnixTimeSeconds();

                var query = (from sot in context.storing_order_tank
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             where string.IsNullOrEmpty(yearlyRevenueRequest.customer_code) || cc.code == yearlyRevenueRequest.customer_code
                             select new TempRevenueResult
                             {
                                 sot_guid = sot.guid,
                                 code = cc.code,
                             })
                            .AsQueryable();

                var yearlyRevenueResult = new YearlyRevenueResult();

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("repair") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "repair", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "repair", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.repair_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("steaming") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "steaming", startEpoch, endEpoch, reportFormat);

                    var revenueQuery = GetRevenueQuery(context, query, "steaming", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.steam_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("cleaning") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "cleaning", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.cleaning_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("residue") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "cleaning", startEpoch, endEpoch, reportFormat);
                    var revenueQuery = GetRevenueQuery(context, query, "residue", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.residue_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("lolo") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "lolo", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.lolo_yearly_revenue = yearlyRevenue;
                }


                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("gate") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "gate", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.gate_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("preinspection") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "preinspection", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.preinspection_yearly_revenue = yearlyRevenue;
                }

                if (yearlyRevenueRequest.revenue_type.EqualsIgnore("storage") || yearlyRevenueRequest.revenue_type.EqualsIgnore("all"))
                {
                    //var (approvedResult, completedResult) = await ProcessRevenueResults(context, query, "lolo", startEpoch, endEpoch, reportFormat, startMonthLastDayEpoch);
                    var revenueQuery = GetRevenueQuery(context, query, "storage", startEpoch, endEpoch);
                    var approvedResult = await revenueQuery.OrderBy(c => c.appv_date).ToListAsync();

                    var approveResultPerMonth = await GetRevenuePerMonth(approvedResult, startOfMonth, endOfMonth);
                    var yearlyRevenue = await GetYearlyRevenue(approveResultPerMonth);
                    yearlyRevenueResult.storage_yearly_revenue = yearlyRevenue;
                }

                return yearlyRevenueResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }
        private async Task<(List<TempRevenueResult>?, List<TempRevenueResult>?)> ProcessRevenueResults(ApplicationBillingDBContext context, IQueryable<TempRevenueResult> query, string inventoryType,
        long startEpoch, long endEpoch, string reportFormat, long? startMonthLastDayEpoch = null)
        {

            if (inventoryType.EqualsIgnore("lolo"))
            {
                var newQuery = GetRevenueQuery(context, query, "lift-off", startEpoch, endEpoch);
                var gateInResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var newQuery1 = GetRevenueQuery(context, query, "lift-on", startEpoch, endEpoch);
                var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (gateInResult, gateOutResult);
            }
            else if (inventoryType.EqualsIgnore("gate"))
            {
                var newQuery = GetRevenueQuery(context, query, "gate-in", startEpoch, endEpoch);
                var gateInResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var newQuery1 = GetRevenueQuery(context, query, "gate-out", startEpoch, endEpoch);
                var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (gateInResult, gateOutResult);

            }
            else if (inventoryType.EqualsIgnore("depot"))
            {
                //Only for yearly report type
                var newQuery = GetRevenueQuery(context, query, "depot", startEpoch, endEpoch, startMonthLastDayEpoch);
                var depotResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                //var newQuery1 = GetRevenueQuery(context, query, "depot", startEpoch, endEpoch);
                //var gateOutResult = await newQuery1.OrderBy(c => c.appv_date).ToListAsync();

                return (depotResult, null);
            }
            else
            {
                string completedStatus = "COMPLETED";
                var newQuery = GetRevenueQuery(context, query, inventoryType, startEpoch, endEpoch);
                var queryResult = await newQuery.OrderBy(c => c.appv_date).ToListAsync();

                var approvedResult = queryResult.Where(s => !StatusCondition.BeforeEstimateApprove.Contains(s.status)).ToList();

                List<TempRevenueResult?> completeResult = new List<TempRevenueResult?>();
                if (reportFormat.EqualsIgnore("monthly"))
                {
                    completeResult = queryResult.Where(s => s.status.Equals(completedStatus) && s.complete_date != null).ToList();
                }
                return (approvedResult, completeResult);
            }
        }

        private IQueryable<TempRevenueResult> GetRevenueQuery(ApplicationBillingDBContext context, IQueryable<TempRevenueResult> query, string inventoryType, long startEpoch, long endEpoch, long? startMonthLastDay = null)
        {
            string yetSurvey = "YET_TO_SURVEY";
            string published = "PUBLISHED";

            switch (inventoryType.ToLower())
            {
                case "repair":
                    return from result in query
                           join s in context.repair on result.sot_guid equals s.sot_guid
                           where context.Set<billing>().Any(b => b.guid == s.owner_billing_guid || b.guid == s.customer_billing_guid)
                           && s.delete_dt == null && (s.owner_billing_guid != null || s.customer_billing_guid != null)
                           && !StatusCondition.BeforeEstimateApprove.Contains(s.status_cv)
                           && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.total_hour ?? 0.0,
                               appv_date = (long)context.Set<billing>().FirstOrDefault().invoice_dt,
                               //complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };

                case "steaming":
                    return from result in query
                           join s in context.steaming on result.sot_guid equals s.sot_guid
                           where context.Set<billing>().Any(b => b.guid == s.owner_billing_guid || b.guid == s.customer_billing_guid)
                           && s.delete_dt == null && (s.owner_billing_guid != null || s.customer_billing_guid != null)
                           && !StatusCondition.BeforeEstimateApprove.Contains(s.status_cv)
                           && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.total_cost ?? 0.0,
                               appv_date = (long)context.Set<billing>().FirstOrDefault().invoice_dt,
                               //complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };

                case "residue":
                    return from result in query
                           join s in context.residue on result.sot_guid equals s.sot_guid
                           where context.Set<billing>().Any(b => b.guid == s.owner_billing_guid || b.guid == s.customer_billing_guid)
                           && s.delete_dt == null && (s.owner_billing_guid != null || s.customer_billing_guid != null)
                           && !StatusCondition.BeforeEstimateApprove.Contains(s.status_cv)
                           && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.total_cost ?? 0.0,
                               appv_date = (long)context.Set<billing>().FirstOrDefault().invoice_dt,
                               //complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };

                case "cleaning":
                    return from result in query
                           join s in context.cleaning on result.sot_guid equals s.sot_guid
                           where context.Set<billing>().Any(b => b.guid == s.owner_billing_guid || b.guid == s.customer_billing_guid)
                           && s.delete_dt == null && (s.owner_billing_guid != null || s.customer_billing_guid != null)
                           && !StatusCondition.BeforeEstimateApprove.Contains(s.status_cv)
                           && s.approve_dt >= startEpoch && s.approve_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = s.buffer_cost ?? 0.0 + s.cleaning_cost ?? 0.0,
                               appv_date = (long)context.Set<billing>().FirstOrDefault().invoice_dt,
                               //complete_date = (long)s.complete_dt,
                               status = s.status_cv
                           };
                case "preinspection":
                    //NEED CHECK
                    return from result in query
                           join s in context.billing_sot on result.sot_guid equals s.sot_guid
                           join b in context.Set<billing>() on s.preinsp_billing_guid equals b.guid
                           where s.preinspection == true && s.preinsp_billing_guid != null && s.delete_dt == null && b.delete_dt == null
                           && b.invoice_dt >= startEpoch && b.invoice_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               cost = s.preinspection_cost ?? 0.0,
                               code = result.code,
                               cc_name = result.cc_name,
                               appv_date = (long)b.invoice_dt
                           };

                case "lolo":
                    return from result in query
                           //join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on result.sot_guid equals s.sot_guid
                           join b in context.Set<billing>() on s.lolo_billing_guid equals b.guid
                           where (s.lift_off == true || s.lift_on == true) && s.lolo_billing_guid != null && s.delete_dt == null && b.delete_dt == null
                           && b.invoice_dt >= startEpoch && b.invoice_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = (s.lift_off == true ? 1.0 : 0.0) * s.lift_off_cost ?? 0.0 + (s.lift_on == true ? 1.0 : 0.0) * s.lift_on_cost ?? 0.0,
                               appv_date = (long)b.invoice_dt,
                           };
                case "gate":
                    return from result in query
                           //join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                           join s in context.billing_sot on result.sot_guid equals s.sot_guid
                           join b in context.Set<billing>() on s.gateio_billing_guid equals b.guid
                           where (s.gate_in == true || s.gate_out == true) && s.gateio_billing_guid != null && s.delete_dt == null && b.delete_dt == null
                           && b.invoice_dt >= startEpoch && b.invoice_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = (s.gate_in == true ? 1.0 : 0.0) * s.gate_in_cost ?? 0.0 + (s.gate_out == true ? 1.0 : 0.0) * s.gate_out_cost ?? 0.0,
                               appv_date = (long)b.invoice_dt,
                           };
                case "storage":
                    return from result in query
                               //join ig in context.in_gate on result.sot_guid equals ig.so_tank_guid
                               //join og in context.out_gate on result.sot_guid equals og.so_tank_guid
                           join s in context.billing_sot on result.sot_guid equals s.sot_guid
                           join b in context.Set<billing>() on s.storage_billing_guid equals b.guid
                           where s.storage_cal_cv != null && s.storage_billing_guid != null && s.delete_dt == null && b.delete_dt == null
                           && b.invoice_dt >= startEpoch && b.invoice_dt <= endEpoch
                           select new TempRevenueResult
                           {
                               sot_guid = result.sot_guid,
                               code = result.code,
                               cc_name = result.cc_name,
                               cost = 0.0,
                               appv_date = (long)b.invoice_dt,
                           };
                default:
                    return Enumerable.Empty<TempRevenueResult>().AsQueryable();
            }
        }

        private async Task<List<ResultPerMonth>> GetRevenuePerMonth(List<TempRevenueResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
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
                    Count = g.Count(),
                    //Cost = g.Select(n => n.cost).Sum() // Get distinct SotGuids
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
                    count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0,
                    //cost = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Cost ?? 0.0
                })
                //.OrderBy(g => g.date) // Sort by date
                .ToList();

            return completeGroupedNodes;
        }

        private async Task<YearlySales> GetYearlyRevenue(List<ResultPerMonth?> approveResultPerMonth)
        {
            var total_count = approveResultPerMonth.Sum(g => g.count);
            var average_count = total_count / 12;
            var total_cost = approveResultPerMonth.Sum(g => g.cost);
            var average_cost = total_cost / 12;


            var yearlyRevenue = new YearlySales();
            yearlyRevenue.result_per_month = approveResultPerMonth;
            yearlyRevenue.total_count = total_count;
            yearlyRevenue.average_count = average_count;
            yearlyRevenue.total_cost = total_cost;
            yearlyRevenue.average_cost = average_cost;

            return yearlyRevenue;
        }

        private async Task<List<ResultPerDay>> GetRevenuePerDay(List<TempRevenueResult> resultList, DateTime startOfMonth, DateTime endOfMonth)
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

        private async Task<MonthlySales> GetMonthlyRevenue(List<ResultPerDay?> approveResultPerDay)
        {
            var total_count = approveResultPerDay.Sum(g => g.count);
            var total_cost = approveResultPerDay.Sum(g => g.cost);

            int daysWithCount = approveResultPerDay.Count(g => g.count > 0);
            int daysWithCost = approveResultPerDay.Count(g => g.cost > 0);

            // Calculate the average
            int average_count = daysWithCount > 0 ? total_count / daysWithCount : 0;
            // Calculate the average
            double average_cost = daysWithCost > 0 ? total_cost / daysWithCost : 0;

            var monthlyRevenue = new MonthlySales();
            monthlyRevenue.result_per_day = approveResultPerDay;
            monthlyRevenue.total_count = total_count;
            monthlyRevenue.average_count = average_count;
            monthlyRevenue.total_cost = total_cost;
            monthlyRevenue.average_cost = average_cost;

            return monthlyRevenue;
        }

        private void GetStorageCost()
        {
        }
    
    }
}
