using HotChocolate.Types;
using HotChocolate;
using IDMS.Billing.Application;
using IDMS.Models.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Billing.GqlTypes.BillingResult;
using IDMS.Billing.GqlTypes.LocalModel;
using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Service;
using IDMS.Models.Parameter;
using Newtonsoft.Json.Linq;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using static IDMS.Billing.GqlTypes.BillingResult.SurveyorPerformanceDetail;


namespace IDMS.Billing.GqlTypes
{
    [ExtendObjectType(typeof(BillingQuery))]
    public class AdminReportQuery
    {
        #region Performance Report

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<List<CleanerPerformance>?> QueryCleanerPerformance(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, CleanerPerformanceRequest cleanerPerformanceRequest)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";

                long sDate = cleanerPerformanceRequest.start_date;
                long eDate = cleanerPerformanceRequest.end_date;

                var query = (from r in context.cleaning
                             join sot in context.storing_order_tank on r.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             join tc in context.Set<tariff_cleaning>() on sot.last_cargo_guid equals tc.guid
                             join cm in context.Set<cleaning_method>() on tc.cleaning_method_guid equals cm.guid
                             join jo in context.job_order on r.job_order_guid equals jo.guid
                             join t in context.team on jo.team_guid equals t.guid
                             where r.status_cv == completedStatus && r.delete_dt == null &&
                             r.complete_dt >= sDate && r.complete_dt <= eDate
                             select new CleanerPerformance
                             {
                                 eir_no = ig.eir_no,
                                 tank_no = sot.tank_no,
                                 customer_code = cc.code,
                                 eir_dt = ig.eir_dt,
                                 last_cargo = tc.cargo,
                                 complete_dt = r.complete_dt,
                                 cost = r.cleaning_cost,
                                 cleaner_name = r.complete_by,
                                 method = cm.name,
                                 bay = t.description
                             }).AsQueryable();

                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.customer_code))
                {
                    query = query.Where(tr => tr.customer_code.Contains(cleanerPerformanceRequest.customer_code));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(cleanerPerformanceRequest.eir_no));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(cleanerPerformanceRequest.tank_no));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.last_cargo))
                {
                    query = query.Where(tr => tr.last_cargo.Contains(cleanerPerformanceRequest.last_cargo));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.method_name))
                {
                    query = query.Where(tr => tr.method.Contains(cleanerPerformanceRequest.method_name));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.cleaning_bay))
                {
                    query = query.Where(tr => tr.bay.Contains(cleanerPerformanceRequest.cleaning_bay));
                }
                if (!string.IsNullOrEmpty(cleanerPerformanceRequest.cleaner_name))
                {
                    query = query.Where(tr => tr.cleaner_name.Contains(cleanerPerformanceRequest.cleaner_name));
                }

                var resultList = await query.OrderBy(tr => tr.tank_no).ToListAsync();
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
        public async Task<List<SteamPerformance>?> QuerySteamPerformance(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, SteamPerformanceRequest steamPerformanceRequest)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string completedStatus = "COMPLETED";

                long sDate = steamPerformanceRequest.start_date;
                long eDate = steamPerformanceRequest.end_date;

                var query = (from r in context.steaming
                             join sot in context.storing_order_tank on r.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             join tc in context.Set<tariff_cleaning>() on sot.last_cargo_guid equals tc.guid
                             join sp in context.Set<steaming_part>() on r.guid equals sp.steaming_guid
                             join jo in context.job_order on sp.job_order_guid equals jo.guid
                             join t in context.team on jo.team_guid equals t.guid
                             where r.estimate_no.StartsWith("SE") && r.status_cv.Equals(completedStatus)
                             && r.delete_dt == null && sp.delete_dt == null && r.complete_dt >= sDate && r.complete_dt <= eDate
                             select new SteamPerformance
                             {
                                 job_order_guid = jo.guid,
                                 tank_no = sot.tank_no,
                                 require_temp = sot.required_temp,
                                 complete_dt = r.complete_dt,
                                 eir_no = ig.eir_no,
                                 eir_dt = ig.eir_dt,
                                 yard = ig.yard_cv,
                                 customer_code = cc.code,
                                 last_cargo = tc.cargo,
                                 cost = r.total_cost,
                                 bay = t.description
                             }).AsQueryable();

                if (!string.IsNullOrEmpty(steamPerformanceRequest.customer_code))
                {
                    query = query.Where(tr => tr.customer_code.Contains(steamPerformanceRequest.customer_code));
                }
                if (!string.IsNullOrEmpty(steamPerformanceRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(steamPerformanceRequest.eir_no));
                }
                if (!string.IsNullOrEmpty(steamPerformanceRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(steamPerformanceRequest.tank_no));
                }
                if (!string.IsNullOrEmpty(steamPerformanceRequest.last_cargo))
                {
                    query = query.Where(tr => tr.last_cargo.Contains(steamPerformanceRequest.last_cargo));
                }
                if (steamPerformanceRequest.steaming_point != null)
                {
                    query = query.Where(tr => steamPerformanceRequest.steaming_point.Contains(tr.bay));
                }
                if (!string.IsNullOrEmpty(steamPerformanceRequest.yard))
                {
                    query = query.Where(tr => tr.yard.Contains(steamPerformanceRequest.yard));
                }

                var resultList = await query.OrderBy(tr => tr.job_order_guid).ToListAsync();

                //Get the diff temperature result set
                List<string> guids = resultList.Select(x => x.job_order_guid).ToList();
                var steamingTempResults = await GetSteamingTempResults1(context, guids);

                //Combine the main result set with temperature result set
                var joinedResults = resultList
                       .GroupJoin(steamingTempResults,
                                  r => r.job_order_guid,
                                  str => str.JobOrderGuid,
                                  (sp, strGroup) => new { SteamPerformance = sp, SteamingTempResults = strGroup })
                       .SelectMany(
                           temp => temp.SteamingTempResults.DefaultIfEmpty(),
                           (temp, str) =>
                           {
                               if (str != null)
                               {
                                   temp.SteamPerformance.themometer = new Themometer { begin_temp = str.FirstMeterTemp, close_temp = str.LastMeterTemp };
                                   temp.SteamPerformance.top = new Top { begin_temp = str.FirstTopTemp, close_temp = str.LastTopTemp };
                                   temp.SteamPerformance.bottom = new Bottom { begin_temp = str.FirstBottomTemp, close_temp = str.LastBottomTemp };
                                   temp.SteamPerformance.duration = ConvertIntoDuration((str.LastRecordTime - str.FirstRecordTime) ?? 0);
                               }
                               return temp.SteamPerformance;
                           })
                       .ToList();

                return joinedResults;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }



        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        public async Task<SurveyorPerformanceSummary?> QuerySurveyorPerformanceSummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, SurveyorPerformanceSummaryRequest surveyorPerfSummaryRequest)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                //string completedStatus = "COMPLETED";
                //long sDate = surveyorPerfSummaryRequest.start_date;
                //long eDate = surveyorPerfSummaryRequest.end_date;

                int year = surveyorPerfSummaryRequest.year;
                int start_month = surveyorPerfSummaryRequest.start_month;
                int end_month = surveyorPerfSummaryRequest.end_month;

                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, start_month, 1);
                // Get the end date of the month (last day of the month)
                // Get the number of days in the specified month
                int daysInMonth = DateTime.DaysInMonth(year, end_month);
                DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

                var query = (from r in context.repair
                                 //join rp in context.Set<repair_part>() on r.guid equals rp.repair_guid
                             join sot in context.storing_order_tank on r.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             join us in context.Set<aspnetusers>() on r.aspnetusers_guid equals us.Id
                             where r.delete_dt == null && r.create_dt != null && r.create_dt >= startEpoch && r.create_dt <= endEpoch
                             orderby r.create_dt
                             select new TempSurveyorPerformance
                             {
                                 date = (long)r.create_dt,
                                 customer_code = cc.code,
                                 surveyor_name = us.UserName,
                                 est_cost = r.est_cost,
                                 appv_cost = r.total_cost,
                                 diff_cost = r.est_cost ?? 0.0 - r.total_cost,
                                 repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

                             }).AsQueryable();


                if (!string.IsNullOrEmpty(surveyorPerfSummaryRequest.customer_code))
                {
                    query = query.Where(tr => tr.customer_code.Contains(surveyorPerfSummaryRequest.customer_code));
                }
                if (surveyorPerfSummaryRequest.repair_type != null && surveyorPerfSummaryRequest.repair_type.Any())
                {
                    query = query.Where(tr => surveyorPerfSummaryRequest.repair_type.Contains(tr.repair_type));
                }
                if (surveyorPerfSummaryRequest.surveyor_name != null && surveyorPerfSummaryRequest.surveyor_name.Any())
                {
                    query = query.Where(tr => surveyorPerfSummaryRequest.surveyor_name.Contains(tr.surveyor_name));
                }

                var resultList = await query.ToListAsync();

                //This to make sure the result list have data
                if (!resultList.Any())
                    return null;

                // Convert epoch timestamp to local date (yyyy-MM-dd)
                foreach (var item in resultList)
                {
                    // Convert epoch timestamp to DateTimeOffset (local time zone)
                    DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(item.date).ToLocalTime();
                    // Format the date as yyyy-MM-dd and replace the code with date
                    item.month = dateTimeOffset.ToString("MMMM");
                }
                var groupedNodes = resultList
                       .GroupBy(n => new { n.month, n.surveyor_name })  // Group by formatted date
                       .Select(g => new
                       {
                           Month = g.Key.month,
                           Surveyor = g.Key.surveyor_name,
                           Count = g.Count(),
                           Est_Cost = g.Select(n => n.est_cost).Sum(), // Get distinct SotGuids
                           Appr_Cost = g.Select(n => n.appv_cost).Sum(),
                           Diff_Cost = g.Select(n => n.diff_cost).Sum(),

                       })
                       .GroupBy(x => x.Month) // Further group by Month
                       .Select(g => new MonthlySummary
                       {
                           month = g.Key,
                           SurveyorList = g.Select(x => new SurveyorList
                           {
                               surveyor_name = x.Surveyor,        // Just keep Surveyor, no Month here
                               est_count = x.Count,
                               est_cost = x.Est_Cost,
                               appv_cost = x.Appr_Cost,
                               diff_cost = x.Diff_Cost,
                               average = x.Appr_Cost / x.Count,
                               rejected = x.Diff_Cost < 0 ? 0 : x.Diff_Cost / x.Est_Cost
                           }).ToList(),
                           monthly_total_est_count = g.Sum(x => x.Count),
                           monthly_total_est_cost = g.Sum(x => x.Est_Cost),
                           monthly_total_appv_cost = g.Sum(x => x.Appr_Cost),
                           monthly_total_diff_cost = g.Sum(x => x.Diff_Cost),
                           monthly_total_average = g.Sum(x => x.Appr_Cost) / g.Sum(x => x.Count),
                           //monthly_total_rejected = g.Sum(x => x.Diff_Cost < 0 ? 0 : x.Diff_Cost) / g.Sum(x => x.Est_Cost)
                           monthly_total_rejected = (g.Sum(x => x.Diff_Cost)) < 0 ? 0 : g.Sum(x => x.Diff_Cost) / g.Sum(x => x.Est_Cost)
                       })
                       .ToList();

                SurveyorPerformanceSummary surveyorPerformanceResult = new SurveyorPerformanceSummary();
                surveyorPerformanceResult.monthly_summary = groupedNodes;
                surveyorPerformanceResult.grand_total_est_count = groupedNodes.Sum(g => g.monthly_total_est_count);
                surveyorPerformanceResult.grand_total_est_cost = groupedNodes.Sum(g => g.monthly_total_est_cost);
                surveyorPerformanceResult.grand_total_appv_cost = groupedNodes.Sum(g => g.monthly_total_appv_cost);
                surveyorPerformanceResult.grand_total_diff_cost = groupedNodes.Sum(g => g.monthly_total_diff_cost);
                surveyorPerformanceResult.grand_total_average = surveyorPerformanceResult.grand_total_appv_cost < 0 ? 0 : surveyorPerformanceResult.grand_total_appv_cost
                                                                / surveyorPerformanceResult.grand_total_est_count;
                surveyorPerformanceResult.grand_total_rejected = surveyorPerformanceResult.grand_total_diff_cost < 0 ? 0 : surveyorPerformanceResult.grand_total_diff_cost
                                                                / surveyorPerformanceResult.grand_total_est_cost;


                return surveyorPerformanceResult;
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
        public async Task<List<SurveyorPerformanceDetail>?> QuerySurveyorPerformanceDetail(ApplicationBillingDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, SurveyorPerformanceDetailRequest surveyorPerfDetailRequest)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string estimateStatus = "CANCELED";
                long sDate = surveyorPerfDetailRequest.start_date;
                long eDate = surveyorPerfDetailRequest.end_date;

                //int year = surveyorPerfDetailRequest.year;
                //int start_month = surveyorPerfDetailRequest.start_month;
                //int end_month = surveyorPerfDetailRequest.end_month;

                //// Get the start date of the month (1st of the month)
                //DateTime startOfMonth = new DateTime(year, start_month, 1);
                //// Get the end date of the month (last day of the month)
                //// Get the number of days in the specified month
                //int daysInMonth = DateTime.DaysInMonth(year, end_month);
                //DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
                //// Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                //long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                //long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();

                var query = (from r in context.repair
                                 //join rp in context.Set<repair_part>() on r.guid equals rp.repair_guid
                             join sot in context.storing_order_tank on r.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             join us in context.Set<aspnetusers>() on r.aspnetusers_guid equals us.Id
                             where r.delete_dt == null && r.status_cv != estimateStatus && r.create_dt != null && r.create_dt >= sDate && r.create_dt <= eDate
                             orderby r.create_dt
                             select new TempSurveyorPerformanceDetail
                             {
                                 tank_no = sot.tank_no,
                                 eir_date = (long)ig.eir_dt,
                                 eir_no = ig.eir_no,
                                 est_no = r.estimate_no,
                                 est_date = r.create_dt,
                                 appv_date = r.approve_dt,
                                 est_cost = r.est_cost,
                                 appv_cost = r.total_cost,
                                 customer_code = cc.code,
                                 surveyor_name = us.UserName,
                                 est_status = r.status_cv,
                                 est_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv
                             }).AsQueryable();


                if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.customer_code))
                {
                    query = query.Where(tr => tr.customer_code.Contains(surveyorPerfDetailRequest.customer_code));
                }
                if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(surveyorPerfDetailRequest.tank_no));
                }
                if (!string.IsNullOrEmpty(surveyorPerfDetailRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(surveyorPerfDetailRequest.eir_no));
                }
                if (surveyorPerfDetailRequest.repair_type != null && surveyorPerfDetailRequest.repair_type.Any())
                {
                    query = query.Where(tr => surveyorPerfDetailRequest.repair_type.Contains(tr.est_type));
                }
                if (surveyorPerfDetailRequest.surveyor_name != null && surveyorPerfDetailRequest.surveyor_name.Any())
                {
                    query = query.Where(tr => surveyorPerfDetailRequest.surveyor_name.Contains(tr.surveyor_name));
                }
                if (surveyorPerfDetailRequest.estimate_status != null && surveyorPerfDetailRequest.estimate_status.Any())
                {
                    query = query.Where(tr => surveyorPerfDetailRequest.estimate_status.Contains(tr.est_status));
                }

                var resultList = await query.ToListAsync();

                //This to make sure the result list have data
                if (!resultList.Any())
                    return null;

                //// Convert epoch timestamp to local date (yyyy-MM-dd)
                //foreach (var item in resultList)
                //{
                //    // Convert epoch timestamp to DateTimeOffset (local time zone)
                //    DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds((long)item.eir_date).ToLocalTime();
                //    // Format the date as yyyy-MM-dd and replace the code with date
                //    item.month = dateTimeOffset.ToString("MMMM");
                //}

                var surveyorPerformanceDetail = resultList
                       .GroupBy(n => new { n.surveyor_name })  // Group by formatted date
                       .Select(g => new SurveyorPerformanceDetail
                       {
                           surveyor = g.Key.surveyor_name,
                           surveyor_details = g.Select(x => new SurveyorDetail
                           {
                               tank_no = x.tank_no,
                               eir_no = x.eir_no,
                               eir_date = x.eir_date,
                               est_type = x.est_type,
                               est_no = x.est_no,
                               est_date = x.est_date,
                               est_cost = x.est_cost,
                               appv_date = x.appv_date,
                               appv_cost = x.appv_cost,
                               est_status = x.est_status
                           }).ToList(),
                           total_est_cost = g.Select(x => x.est_cost).Sum(), // Get distinct SotGuids
                           total_appv_cost = g.Select(x => x.appv_cost).Sum(),
                       }).ToList();

                return surveyorPerformanceDetail; //surveyorPerformanceResult;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        #endregion

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<List<DailyTeamRevenue>> QueryDailyTeamRevenue(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, DailyTeamRevenuRequest dailyTeamRevenueRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<DailyTeamRevenue> result = new List<DailyTeamRevenue>();

                //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
                //string surveryorCodeValType = "TEST_CLASS";
                string repairStatus = "QC_COMPLETED";

                //long sDate = dailyTeamRevenueRequest.start_date;
                //long eDate = dailyTeamRevenueRequest.end_date;

                var query = (from r in context.repair
                             join rp in context.repair_part on r.guid equals rp.repair_guid
                             join jo in context.job_order on rp.job_order_guid equals jo.guid
                             join t in context.team on jo.team_guid equals t.guid
                             join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid into soGroup
                             from so in soGroup.DefaultIfEmpty()
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
                             from cc in ccGroup.DefaultIfEmpty()
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             where r.delete_dt == null && r.status_cv == repairStatus && !string.IsNullOrEmpty(sot.purpose_repair_cv)
                             select new DailyTeamRevenue
                             {
                                 estimate_no = r.estimate_no,
                                 tank_no = sot.tank_no,
                                 code = cc.code,
                                 estimate_date = r.create_dt,
                                 approved_date = r.approve_dt,
                                 allocation_date = r.allocate_dt,
                                 qc_by = jo.qc_by,
                                 qc_date = jo.qc_dt,
                                 eir_no = ig.eir_no,
                                 repair_cost = r.total_cost,
                                 team = t.description,
                                 repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

                             }).AsQueryable();

                if (dailyTeamRevenueRequest.qc_start_date != null && dailyTeamRevenueRequest.qc_end_date != null)
                {
                    query = query.Where(tr => tr.qc_date >= dailyTeamRevenueRequest.qc_start_date && tr.qc_date <= dailyTeamRevenueRequest.qc_end_date);
                }

                if (dailyTeamRevenueRequest.approved_start_date != null && dailyTeamRevenueRequest.approved_end_date != null)
                {
                    query = query.Where(tr => tr.approved_date >= dailyTeamRevenueRequest.approved_start_date && tr.approved_date <= dailyTeamRevenueRequest.approved_end_date);
                }

                if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.customer_code))
                {
                    query = query.Where(tr => String.Equals(tr.code, dailyTeamRevenueRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(dailyTeamRevenueRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(dailyTeamRevenueRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(dailyTeamRevenueRequest.eir_no));
                }

                if (dailyTeamRevenueRequest.repair_type != null && dailyTeamRevenueRequest.repair_type.Any())
                {
                    query = query.Where(tr => dailyTeamRevenueRequest.repair_type.Contains(tr.repair_type));
                }

                if (dailyTeamRevenueRequest.estimate_start_date != null && dailyTeamRevenueRequest.estimate_end_date != null)
                {
                    query = query.Where(tr => tr.estimate_date >= dailyTeamRevenueRequest.estimate_start_date && tr.estimate_date <= dailyTeamRevenueRequest.estimate_end_date);
                }

                if (dailyTeamRevenueRequest.allocation_start_date != null && dailyTeamRevenueRequest.allocation_end_date != null)
                {
                    query = query.Where(tr => tr.allocation_date >= dailyTeamRevenueRequest.allocation_start_date && tr.allocation_date <= dailyTeamRevenueRequest.allocation_end_date);
                }

                if (dailyTeamRevenueRequest.team != null && dailyTeamRevenueRequest.team.Any())
                {
                    query = query.Where(tr => dailyTeamRevenueRequest.team.Contains(tr.team));
                }

                return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.approved_date).ToListAsync();
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
        public async Task<List<DailyTeamApproval>> QueryDailyTeamApproval(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, DailyTeamApprovalRequest dailyTeamApprovalRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<DailyTeamApproval> result = new List<DailyTeamApproval>();

                //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
                //string surveryorCodeValType = "TEST_CLASS";
                //string repairStatus = "QC_COMPLETED";

                //long sDate = dailyTeamRevenueRequest.start_date;
                //long eDate = dailyTeamRevenueRequest.end_date;

                var query = (from r in context.repair
                             join rp in context.repair_part on r.guid equals rp.repair_guid
                             join jo in context.job_order on rp.job_order_guid equals jo.guid
                             join t in context.team on jo.team_guid equals t.guid
                             join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid into soGroup
                             from so in soGroup.DefaultIfEmpty()
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
                             from cc in ccGroup.DefaultIfEmpty()
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             where r.delete_dt == null && !StatusCondition.BeforeApprove.Contains(r.status_cv) && r.approve_dt != null
                             && !string.IsNullOrEmpty(sot.purpose_repair_cv)
                             select new DailyTeamApproval
                             {
                                 estimate_no = r.estimate_no,
                                 tank_no = sot.tank_no,
                                 code = cc.code,
                                 estimate_date = r.create_dt,
                                 approved_date = r.approve_dt,
                                 allocation_date = r.allocate_dt,
                                 qc_date = jo.qc_dt,
                                 eir_no = ig.eir_no,
                                 repair_cost = r.total_cost,
                                 team = t.description,
                                 status = r.status_cv,
                                 repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

                             }).AsQueryable();

                if (dailyTeamApprovalRequest.approved_start_date != null && dailyTeamApprovalRequest.approved_end_date != null)
                {
                    query = query.Where(tr => tr.approved_date >= dailyTeamApprovalRequest.approved_start_date && tr.approved_date <= dailyTeamApprovalRequest.approved_end_date);
                }

                if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.customer_code))
                {
                    query = query.Where(tr => String.Equals(tr.code, dailyTeamApprovalRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(dailyTeamApprovalRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(dailyTeamApprovalRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(dailyTeamApprovalRequest.eir_no));
                }

                if (dailyTeamApprovalRequest.repair_type != null && dailyTeamApprovalRequest.repair_type.Any())
                {
                    query = query.Where(tr => dailyTeamApprovalRequest.repair_type.Contains(tr.repair_type));
                }

                if (dailyTeamApprovalRequest.estimate_start_date != null && dailyTeamApprovalRequest.estimate_end_date != null)
                {
                    query = query.Where(tr => tr.estimate_date >= dailyTeamApprovalRequest.estimate_start_date && tr.estimate_date <= dailyTeamApprovalRequest.estimate_end_date);
                }

                if (dailyTeamApprovalRequest.allocation_start_date != null && dailyTeamApprovalRequest.allocation_end_date != null)
                {
                    query = query.Where(tr => tr.allocation_date >= dailyTeamApprovalRequest.allocation_start_date && tr.allocation_date <= dailyTeamApprovalRequest.allocation_end_date);
                }

                if (dailyTeamApprovalRequest.qc_start_date != null && dailyTeamApprovalRequest.qc_end_date != null)
                {
                    query = query.Where(tr => tr.qc_date >= dailyTeamApprovalRequest.qc_start_date && tr.qc_date <= dailyTeamApprovalRequest.qc_end_date);
                }

                if (dailyTeamApprovalRequest.team != null && dailyTeamApprovalRequest.team.Any())
                {
                    query = query.Where(tr => dailyTeamApprovalRequest.team.Contains(tr.team));
                }

                return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.approved_date).ToListAsync();
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
        public async Task<List<DailyQCDetail>> QueryDailyQCDetail(ApplicationBillingDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, DailyQCDetailRequest dailyQCDetailRequest)
        {
            try
            {
                ///Havent complete --- labour cost, material cost   
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<DailyTeamApproval> result = new List<DailyTeamApproval>();

                //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
                //string surveryorCodeValType = "TEST_CLASS";
                string repairStatus = "QC_COMPLETED";

                //long sDate = dailyTeamRevenueRequest.start_date;
                //long eDate = dailyTeamRevenueRequest.end_date;

                var query = (from r in context.repair
                             join rp in context.repair_part on r.guid equals rp.repair_guid
                             join jo in context.job_order on rp.job_order_guid equals jo.guid
                             join t in context.team on jo.team_guid equals t.guid
                             join sot in context.storing_order_tank on jo.sot_guid equals sot.guid
                             join so in context.storing_order on sot.so_guid equals so.guid into soGroup
                             from so in soGroup.DefaultIfEmpty()
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
                             from cc in ccGroup.DefaultIfEmpty()
                             join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
                             where r.delete_dt == null && r.status_cv == repairStatus && !string.IsNullOrEmpty(sot.purpose_repair_cv)
                             select new DailyQCDetail
                             {
                                 estimate_no = r.estimate_no,
                                 tank_no = sot.tank_no,
                                 code = cc.code,
                                 estimate_date = r.create_dt,
                                 approved_date = r.approve_dt,
                                 allocation_date = r.allocate_dt,
                                 qc_date = jo.qc_dt,
                                 eir_no = ig.eir_no,
                                 repair_cost = r.total_cost,
                                 //team = t.description,
                                 appv_hour = 1, // need to change 
                                 appv_material_cost = 100 - r.material_cost_discount, //need to change
                                 repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

                             }).AsQueryable();

                if (dailyQCDetailRequest.qc_start_date != null && dailyQCDetailRequest.qc_end_date != null)
                {
                    query = query.Where(tr => tr.qc_date >= dailyQCDetailRequest.qc_start_date && tr.qc_date <= dailyQCDetailRequest.qc_end_date);
                }

                if (dailyQCDetailRequest.approved_start_date != null && dailyQCDetailRequest.approved_end_date != null)
                {
                    query = query.Where(tr => tr.approved_date >= dailyQCDetailRequest.approved_start_date && tr.approved_date <= dailyQCDetailRequest.approved_end_date);
                }

                if (!string.IsNullOrEmpty(dailyQCDetailRequest.customer_code))
                {
                    query = query.Where(tr => String.Equals(tr.code, dailyQCDetailRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(dailyQCDetailRequest.tank_no))
                {
                    query = query.Where(tr => tr.tank_no.Contains(dailyQCDetailRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(dailyQCDetailRequest.eir_no))
                {
                    query = query.Where(tr => tr.eir_no.Contains(dailyQCDetailRequest.eir_no));
                }

                if (dailyQCDetailRequest.repair_type != null && dailyQCDetailRequest.repair_type.Any())
                {
                    query = query.Where(tr => dailyQCDetailRequest.repair_type.Contains(tr.repair_type));
                }

                if (dailyQCDetailRequest.estimate_start_date != null && dailyQCDetailRequest.estimate_end_date != null)
                {
                    query = query.Where(tr => tr.estimate_date >= dailyQCDetailRequest.estimate_start_date && tr.estimate_date <= dailyQCDetailRequest.estimate_end_date);
                }

                if (dailyQCDetailRequest.allocation_start_date != null && dailyQCDetailRequest.allocation_end_date != null)
                {
                    query = query.Where(tr => tr.allocation_date >= dailyQCDetailRequest.allocation_start_date && tr.allocation_date <= dailyQCDetailRequest.allocation_end_date);
                }
                //if (dailyQCDetailRequest.team != null && dailyQCDetailRequest.team.Any())
                //{
                //    query = query.Where(tr => dailyQCDetailRequest.team.Contains(tr.team));
                //}

                return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.qc_date).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<List<SteamingTempResult>> GetSteamingTempResults(ApplicationBillingDBContext context, List<string> jobOrderGuids)
        {
            var results = await context.Set<steaming_temp>()
                .Where(s => jobOrderGuids.Contains(s.job_order_guid))
                .GroupBy(s => s.job_order_guid)
                .Select(g => new SteamingTempResult
                {
                    JobOrderGuid = g.Key,
                    FirstMeterTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
                    FirstTopTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
                    FirstBottomTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault(),
                    LastMeterTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
                    LastTopTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
                    LastBottomTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault()
                })
                .ToListAsync();

            return results;
        }

        private async Task<List<SteamingTempResult>> GetSteamingTempResults1(ApplicationBillingDBContext context, List<string> jobOrderGuids)
        {
            // Subquery to get the first report date for each job_order_guid
            var firstReportDt = context.Set<steaming_temp>()
                .Where(s => jobOrderGuids.Contains(s.job_order_guid))
                .GroupBy(s => s.job_order_guid)
                .Select(g => new
                {
                    JobOrderGuid = g.Key,
                    MinReportDt = g.Min(s => s.report_dt)
                });

            // Subquery to get the last report date for each job_order_guid
            var lastReportDt = context.Set<steaming_temp>()
                .Where(s => jobOrderGuids.Contains(s.job_order_guid))
                .GroupBy(s => s.job_order_guid)
                .Select(g => new
                {
                    JobOrderGuid = g.Key,
                    MaxReportDt = g.Max(s => s.report_dt)
                });

            // Main query to join the steaming temperature data with the first and last report dates
            var query = context.Set<steaming_temp>()
                .Join(firstReportDt, s => s.job_order_guid, fr => fr.JobOrderGuid, (s, fr) => new { s, fr })
                .Join(lastReportDt, combined => combined.s.job_order_guid, lr => lr.JobOrderGuid, (combined, lr) => new { combined.s, combined.fr, lr })
                .Where(x => jobOrderGuids.Contains(x.s.job_order_guid))
                .GroupBy(x => x.s.job_order_guid)
                .Select(g => new SteamingTempResult
                {
                    JobOrderGuid = g.Key,
                    FirstMeterTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.meter_temp),
                    FirstTopTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.top_temp),
                    FirstBottomTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.bottom_temp),
                    FirstRecordTime = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (long?)s.s.report_dt),
                    LastMeterTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.meter_temp),
                    LastTopTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.top_temp),
                    LastBottomTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.bottom_temp),
                    LastRecordTime = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (long?)s.s.report_dt)
                })
                .ToList();

            return query;
        }

        private string ConvertIntoDuration(long datetime)
        {
            TimeSpan timeSpan = TimeSpan.FromSeconds(datetime);

            // Calculate days, hours, and minutes
            int days = (int)timeSpan.TotalDays;
            int hours = timeSpan.Hours;
            int minutes = timeSpan.Minutes;

            // Build the result based on non-zero values
            string result = "";

            if (days > 0)
            {
                result += $"{days}d:";
            }

            if (hours > 0 || days > 0) // Only show hours if there are days or if hours are non-zero
            {
                result += $"{hours:D2}h:";
            }

            if (minutes > 0 || hours > 0 || days > 0) // Only show minutes if there are hours or days or minutes are non-zero
            {
                result += $"{minutes:D2}m";
            }

            return result;
        }
    }
}
