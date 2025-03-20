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
using IDMS.Models.Shared;


namespace IDMS.Billing.GqlTypes
{
    //[ExtendObjectType(typeof(BillingQuery))]
    //public class ManagementReportQuery
    //{
    //    #region Performance Report

    //    [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
    //    [UseProjection]
    //    [UseFiltering]
    //    [UseSorting]
    //    public async Task<List<CleanerPerformance>?> QueryCleanerPerformanceTest(ApplicationBillingDBContext context, [Service] IConfiguration config,
    //      [Service] IHttpContextAccessor httpContextAccessor, CleanerPerformanceRequest cleanerPerformanceRequest)
    //    {

    //        try
    //        {
    //            GqlUtils.IsAuthorize(config, httpContextAccessor);

    //            string completedStatus = "COMPLETED";

    //            long sDate = cleanerPerformanceRequest.start_date;
    //            long eDate = cleanerPerformanceRequest.end_date;

    //            var query = (from r in context.cleaning
    //                         join sot in context.storing_order_tank on r.sot_guid equals sot.guid
    //                         join so in context.storing_order on sot.so_guid equals so.guid
    //                         join cc in context.customer_company on so.customer_company_guid equals cc.guid
    //                         join ig in context.in_gate on r.sot_guid equals ig.so_tank_guid
    //                         join tc in context.Set<tariff_cleaning>() on sot.last_cargo_guid equals tc.guid
    //                         join cm in context.Set<cleaning_method>() on tc.cleaning_method_guid equals cm.guid
    //                         join jo in context.job_order on r.job_order_guid equals jo.guid
    //                         join t in context.team on jo.team_guid equals t.guid
    //                         where r.status_cv == completedStatus && r.delete_dt == null &&
    //                         r.complete_dt >= sDate && r.complete_dt <= eDate
    //                         select new CleanerPerformance
    //                         {
    //                             eir_no = ig.eir_no,
    //                             tank_no = sot.tank_no,
    //                             customer_code = cc.code,
    //                             eir_dt = ig.eir_dt,
    //                             last_cargo = tc.cargo,
    //                             complete_dt = r.complete_dt,
    //                             cost = r.cleaning_cost,
    //                             cleaner_name = r.complete_by,
    //                             method = cm.name,
    //                             bay = t.description
    //                         }).AsQueryable();

    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.customer_code))
    //            {
    //                query = query.Where(tr => tr.customer_code.Contains(cleanerPerformanceRequest.customer_code));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.eir_no))
    //            {
    //                query = query.Where(tr => tr.eir_no.Contains(cleanerPerformanceRequest.eir_no));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.tank_no))
    //            {
    //                query = query.Where(tr => tr.tank_no.Contains(cleanerPerformanceRequest.tank_no));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.last_cargo))
    //            {
    //                query = query.Where(tr => tr.last_cargo.Contains(cleanerPerformanceRequest.last_cargo));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.method_name))
    //            {
    //                query = query.Where(tr => tr.method.Contains(cleanerPerformanceRequest.method_name));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.cleaning_bay))
    //            {
    //                query = query.Where(tr => tr.bay.Contains(cleanerPerformanceRequest.cleaning_bay));
    //            }
    //            if (!string.IsNullOrEmpty(cleanerPerformanceRequest.cleaner_name))
    //            {
    //                query = query.Where(tr => tr.cleaner_name.Contains(cleanerPerformanceRequest.cleaner_name));
    //            }

    //            var resultList = await query.OrderBy(tr => tr.tank_no).ToListAsync();
    //            return resultList;
    //        }
    //        catch (Exception ex)
    //        {
    //            throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
    //        }
    //    }

    //    #endregion

    //    private async Task<List<SteamingTempResult>> GetSteamingTempResults(ApplicationBillingDBContext context, List<string> jobOrderGuids)
    //    {
    //        var results = await context.Set<steaming_temp>()
    //            .Where(s => jobOrderGuids.Contains(s.job_order_guid))
    //            .GroupBy(s => s.job_order_guid)
    //            .Select(g => new SteamingTempResult
    //            {
    //                JobOrderGuid = g.Key,
    //                FirstMeterTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
    //                FirstTopTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
    //                FirstBottomTemp = g.Where(s => s.report_dt == g.Min(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault(),
    //                LastMeterTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.meter_temp).FirstOrDefault(),
    //                LastTopTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.top_temp).FirstOrDefault(),
    //                LastBottomTemp = g.Where(s => s.report_dt == g.Max(x => x.report_dt)).Select(s => (double?)s.bottom_temp).FirstOrDefault()
    //            })
    //            .ToListAsync();

    //        return results;
    //    }

    //    private async Task<List<SteamingTempResult>> GetSteamingTempResults1(ApplicationBillingDBContext context, List<string> jobOrderGuids)
    //    {
    //        // Subquery to get the first report date for each job_order_guid
    //        var firstReportDt = context.Set<steaming_temp>()
    //            .Where(s => jobOrderGuids.Contains(s.job_order_guid))
    //            .GroupBy(s => s.job_order_guid)
    //            .Select(g => new
    //            {
    //                JobOrderGuid = g.Key,
    //                MinReportDt = g.Min(s => s.report_dt)
    //            });

    //        // Subquery to get the last report date for each job_order_guid
    //        var lastReportDt = context.Set<steaming_temp>()
    //            .Where(s => jobOrderGuids.Contains(s.job_order_guid))
    //            .GroupBy(s => s.job_order_guid)
    //            .Select(g => new
    //            {
    //                JobOrderGuid = g.Key,
    //                MaxReportDt = g.Max(s => s.report_dt)
    //            });

    //        // Main query to join the steaming temperature data with the first and last report dates
    //        var query = context.Set<steaming_temp>()
    //            .Join(firstReportDt, s => s.job_order_guid, fr => fr.JobOrderGuid, (s, fr) => new { s, fr })
    //            .Join(lastReportDt, combined => combined.s.job_order_guid, lr => lr.JobOrderGuid, (combined, lr) => new { combined.s, combined.fr, lr })
    //            .Where(x => jobOrderGuids.Contains(x.s.job_order_guid))
    //            .GroupBy(x => x.s.job_order_guid)
    //            .Select(g => new SteamingTempResult
    //            {
    //                JobOrderGuid = g.Key,
    //                FirstMeterTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.meter_temp),
    //                FirstTopTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.top_temp),
    //                FirstBottomTemp = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (double?)s.s.bottom_temp),
    //                FirstRecordTime = g.Where(s => s.s.report_dt == s.fr.MinReportDt).Min(s => (long?)s.s.report_dt),
    //                LastMeterTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.meter_temp),
    //                LastTopTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.top_temp),
    //                LastBottomTemp = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (double?)s.s.bottom_temp),
    //                LastRecordTime = g.Where(s => s.s.report_dt == s.lr.MaxReportDt).Max(s => (long?)s.s.report_dt)
    //            })
    //            .ToList();

    //        return query;
    //    }

    //    private string ConvertIntoDuration(long datetime)
    //    {
    //        TimeSpan timeSpan = TimeSpan.FromSeconds(datetime);

    //        // Calculate days, hours, and minutes
    //        int days = (int)timeSpan.TotalDays;
    //        int hours = timeSpan.Hours;
    //        int minutes = timeSpan.Minutes;

    //        // Build the result based on non-zero values
    //        string result = "";

    //        if (days > 0)
    //        {
    //            result += $"{days}d:";
    //        }

    //        if (hours > 0 || days > 0) // Only show hours if there are days or if hours are non-zero
    //        {
    //            result += $"{hours:D2}h:";
    //        }

    //        if (minutes > 0 || hours > 0 || days > 0) // Only show minutes if there are hours or days or minutes are non-zero
    //        {
    //            result += $"{minutes:D2}m";
    //        }

    //        return result;
    //    }
    //}
}
