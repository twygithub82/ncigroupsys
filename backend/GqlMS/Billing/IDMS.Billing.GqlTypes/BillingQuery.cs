using HotChocolate.Types;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using IDMS.Models.DB;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Billing;
using IDMS.Billing.Application;
using IDMS.Models;
using IDMS.Billing.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using CommonUtil.Core.Service;
using System.Security.Cryptography;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion.Internal;

namespace IDMS.Billing.GqlTypes
{
    public class BillingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<billing> QueryBilling([Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<billing_sot> QueryBillingSOT([Service] IHttpContextAccessor httpContextAccessor,
               [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing_sot.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public async Task<List<CleaningInventorySummary>> QueryCleaningInventorySummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, CleaningInventoryRequest cleaningInventoryRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<CleaningInventorySummary> result = new List<CleaningInventorySummary>();

                long sDate = cleaningInventoryRequest.start_date; //StartDateExtract(cleaningInventoryRequest.start_date);
                long eDate = cleaningInventoryRequest.end_date;

                var query = context.storing_order_tank
                                .Where(sot => context.cleaning
                                .Where(c => (c.delete_dt == null || c.delete_dt == 0) && c.complete_dt >= sDate && c.complete_dt <= eDate)
                                .Select(c => c.sot_guid)
                                .Contains(sot.guid)).AsQueryable();

                if (!string.IsNullOrEmpty(cleaningInventoryRequest.customer_code))
                {
                    //query = query.Where(sot => sot.storing_order.customer_company.code == cleaningInventoryRequest.customer_code);
                    query = query.Where(sot => String.Equals(sot.storing_order.customer_company.code, cleaningInventoryRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(cleaningInventoryRequest.last_cargo))
                {
                    query = query.Where(sot => sot.tariff_cleaning.cargo.Contains(cleaningInventoryRequest.last_cargo));
                }

                if (!string.IsNullOrEmpty(cleaningInventoryRequest.un_no))
                {
                    query = query.Where(sot => sot.tariff_cleaning.un_no.Contains(cleaningInventoryRequest.un_no));
                }

                if (!string.IsNullOrEmpty(cleaningInventoryRequest.eir_no))
                {
                    query = query.Include(d => d.in_gate.Where(i => (i.delete_dt == null || i.delete_dt == 0)
                                            && i.eir_no.Equals(cleaningInventoryRequest.eir_no)));
                }

                if (!string.IsNullOrEmpty(cleaningInventoryRequest.tank_no))
                {
                    query = query.Where(sot => sot.tank_no.Contains(cleaningInventoryRequest.tank_no));
                }

                if (cleaningInventoryRequest.class_no != null && cleaningInventoryRequest.class_no.Any())
                {
                    query = query.Where(sot => cleaningInventoryRequest.class_no.Contains(sot.tariff_cleaning.class_cv));
                }

                // Apply filters conditionally
                if (cleaningInventoryRequest.report_type.EqualsIgnore(ReportType.CUSTOMER_WISE))
                {
                    var res = query.GroupBy(sot => new { sot.storing_order.customer_company.code, sot.storing_order.customer_company.name })
                                      .Select(g => new
                                      {
                                          NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
                                          Code = g.Key.code,
                                          Name = g.Key.name
                                      }).ToList();


                    return res.Select(x => new CleaningInventorySummary
                    {
                        code = x.Code,
                        name = x.Name,
                        count = x.NoOfTanks
                    }).ToList();
                }
                else if (cleaningInventoryRequest.report_type.EqualsIgnore(ReportType.CARGO_WISE))
                {
                    var res = query.GroupBy(sot => new { sot.tariff_cleaning.cargo })
                                      .Select(g => new
                                      {
                                          NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
                                          Cargo = g.Key.cargo
                                      }).ToList();


                    return res.Select(x => new CleaningInventorySummary
                    {
                        code = x.Cargo,
                        count = x.NoOfTanks
                    }).ToList();
                }
                else if (cleaningInventoryRequest.report_type.EqualsIgnore(ReportType.UN_WISE))
                {
                    var res = query.GroupBy(sot => new { sot.tariff_cleaning.un_no })
                                    .Select(g => new
                                    {
                                        NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
                                        UN = g.Key.un_no
                                    }).ToList();


                    return res.Select(x => new CleaningInventorySummary
                    {
                        code = x.UN,
                        count = x.NoOfTanks
                    }).ToList();
                }

                return result;
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
        public async Task<List<PeriodicTestDueSummary>> QueryPeriodicTestDueSummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, PeriodicTestDueRequest periodicTestDueRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<PeriodicTestDueSummary> result = new List<PeriodicTestDueSummary>();

                var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
                long currentDateTime = DateTime.Now.ToEpochTime();
                long nextTestThreshold = (long)(Math.Floor(2.5 * 365.25 * 86400));
                long secInDay = 86400;


                IQueryable<PeriodicTestDueSummary> query = from tf in context.tank_info
                                                           join sot in context.storing_order_tank on tf.tank_no equals sot.tank_no into sotGroup
                                                           from sot in sotGroup.DefaultIfEmpty()
                                                           join occ in context.customer_company on tf.owner_guid equals occ.guid into occGroup
                                                           from occ in occGroup.DefaultIfEmpty()
                                                           join so in context.storing_order on sot.so_guid equals so.guid into soGroup
                                                           from so in soGroup.DefaultIfEmpty()
                                                           join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccGroup
                                                           from cc in ccGroup.DefaultIfEmpty()
                                                           join i in context.in_gate on sot.guid equals i.so_tank_guid into iGroup
                                                           from i in iGroup.DefaultIfEmpty()
                                                           where tf.yard_cv != null
                                                                 && !excludeStatus.Contains(sot.tank_status_cv) && i.delete_dt == null
                                                           select (new PeriodicTestDueSummary
                                                           {
                                                               tank_no = tf.tank_no,
                                                               eir_dt = i.eir_dt,
                                                               eir_no = i.eir_no,
                                                               customer_code = cc.code,
                                                               owner_code = occ.code,
                                                               last_test_type = tf.last_test_cv == "2.5" ? "2.5 Year (Air)" :
                                                                            tf.next_test_cv == "5" ? "5 Year (Hydro)" : null,
                                                               class_cv = tf.test_class_cv,
                                                               test_dt = tf.test_dt,
                                                               next_test_type = tf.next_test_cv == "2.5" ? "2.5 Year (Air)" :
                                                                            tf.next_test_cv == "5" ? "5 Year (Hydro)" : null,
                                                               next_test_dt = tf.test_dt + nextTestThreshold,
                                                               due_type = (tf.test_dt + nextTestThreshold) < currentDateTime ? "Due" : "Normal",
                                                               due_days = (tf.test_dt + nextTestThreshold) < currentDateTime ?
                                                                           Math.Round((double)((currentDateTime - (tf.test_dt + nextTestThreshold)) / secInDay)).ToString() :
                                                                           ""
                                                           });

                if (!string.IsNullOrEmpty(periodicTestDueRequest.customer_code))
                {
                    query = query.Where(tf => String.Equals(tf.customer_code, periodicTestDueRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(periodicTestDueRequest.tank_no))
                {
                    query = query.Where(tf => tf.tank_no.Contains(periodicTestDueRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(periodicTestDueRequest.eir_no))
                {
                    query = query.Where(tf => tf.eir_no.Contains(periodicTestDueRequest.eir_no));
                }

                if (!string.IsNullOrEmpty(periodicTestDueRequest.next_test_due))
                {
                    if (periodicTestDueRequest.next_test_due == "2.5")
                        query = query.Where(tf => tf.next_test_type.Contains("2.5") && tf.next_test_type.Contains("Air"));
                    else if (periodicTestDueRequest.next_test_due == "5")
                        query = query.Where(tf => tf.next_test_type.Contains("5") && !tf.next_test_type.Contains("Air"));
                }


                result = await query.OrderBy(i => i.customer_code).ToListAsync();

                if (!string.IsNullOrEmpty(periodicTestDueRequest.due_type))
                {
                    result = result.Where(i => i.due_type.EqualsIgnore(periodicTestDueRequest.due_type)).ToList();
                }

                var groupedByCustomerCode = result
                    .GroupBy(test => test.customer_code)
                    .ToList();

                return result;
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
        public async Task<List<DailyTankSurveySummary>> QueryDailyTankSurveySummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, DailyTankSurveyRequest dailyTankSurveyRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                List<DailyTankSurveySummary> result = new List<DailyTankSurveySummary>();

                var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
                string surveryorCodeValType = "TEST_CLASS";
                string tankStatusCV = "ACCEPTED";

                long sDate = dailyTankSurveyRequest.start_date;
                long eDate = dailyTankSurveyRequest.end_date;

                IQueryable<DailyTankSurveySummary> query = from sot in context.storing_order_tank
                                                           join so in context.storing_order on sot.so_guid equals so.guid
                                                           join cc in context.customer_company on so.customer_company_guid equals cc.guid
                                                           join sd in context.survey_detail on sot.guid equals sd.sot_guid
                                                           join cv in context.code_values on sd.test_class_cv equals cv.code_val
                                                           join cl in context.cleaning on sot.guid equals cl.sot_guid into clGroup
                                                           from cl in clGroup.DefaultIfEmpty()
                                                           join i in context.in_gate on sot.guid equals i.so_tank_guid into iGroup
                                                           from i in iGroup.DefaultIfEmpty()
                                                           where sot.status_cv == tankStatusCV
                                                               && !excludeStatus.Contains(sot.tank_status_cv)
                                                               && sd.survey_dt >= sDate
                                                               && sd.survey_dt <= eDate
                                                               && (i.delete_dt == null)
                                                               && cv.code_val_type == surveryorCodeValType

                                                           group new { sot, cc, sd, cl, i, cv } by new
                                                           {
                                                               cc.code,
                                                               sot.tank_no,
                                                               sot.status_cv,
                                                               i.eir_no,
                                                               sd.survey_type_cv,
                                                               sd.survey_dt,
                                                               cv.description,
                                                               clean_dt = sot.purpose_cleaning == true && cl.complete_dt.HasValue ? cl.complete_dt : null
                                                           } into g

                                                           select new DailyTankSurveySummary
                                                           {
                                                               customer_code = g.Key.code,
                                                               tank_no = g.Key.tank_no,
                                                               status = g.Key.status_cv,
                                                               eir_no = g.Key.eir_no,
                                                               survey_type = g.Key.survey_type_cv,
                                                               survey_dt = g.Key.survey_dt,
                                                               surveryor = g.Key.description,
                                                               clean_dt = g.Key.clean_dt,
                                                               visit = g.Count().ToString()
                                                           };

                if (!string.IsNullOrEmpty(dailyTankSurveyRequest.customer_code))
                {
                    query = query.Where(tf => String.Equals(tf.customer_code, dailyTankSurveyRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                }

                if (!string.IsNullOrEmpty(dailyTankSurveyRequest.tank_no))
                {
                    query = query.Where(tf => tf.tank_no.Contains(dailyTankSurveyRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(dailyTankSurveyRequest.eir_no))
                {
                    query = query.Where(tf => tf.eir_no.Contains(dailyTankSurveyRequest.eir_no));
                }

                if (dailyTankSurveyRequest.survey_type != null && dailyTankSurveyRequest.survey_type.Any())
                {
                    query = query.Where(tf => dailyTankSurveyRequest.survey_type.Contains(tf.survey_type));
                }

                if (!string.IsNullOrEmpty(dailyTankSurveyRequest.surveyor_name))
                {
                    query = query.Where(tf => tf.surveryor.Contains(dailyTankSurveyRequest.surveyor_name));
                }

                return await query.OrderBy(i => i.customer_code).ToListAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<List<DailyInventorySummary>> QueryDailyInventorySummary(ApplicationBillingDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, DailyInventoryRequest dailyInventoryRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                long sDate = dailyInventoryRequest.start_date; //StartDateExtract(dailyInventoryRequest.start_date);
                long eDate = dailyInventoryRequest.end_date; //EndDateExtract(dailyInventoryRequest.end_date);



                List<OpeningBalance?> openingBalances = new List<OpeningBalance?>();
                var OB = await QueryOpeningBalance(context, sDate);
                openingBalances = await QueryYardCount(context, dailyInventoryRequest.inventory_type, sDate, eDate, OB);

                List<DailyInventorySummary> inList = new List<DailyInventorySummary>();
                List<DailyInventorySummary> outList = new List<DailyInventorySummary>();

                var query = context.storing_order_tank.AsQueryable();
                if (!string.IsNullOrEmpty(dailyInventoryRequest.customer_code))
                {
                    if (query != null)
                    {
                        query = query.Where(s => s.storing_order.customer_company.code == dailyInventoryRequest.customer_code);
                    }
                }

                var query1 = query;

                if (dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.IN) || dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.ALL))
                {
                    query = query.Where(sot => context.in_gate
                                    .Where(i => (i.delete_dt == null || i.delete_dt == 0) && i.eir_dt >= sDate && i.eir_dt <= eDate)
                                    .Select(i => i.so_tank_guid)
                                    .Contains(sot.guid)).AsQueryable();

                    var res = await query.GroupBy(sot => new { sot.storing_order.customer_company.code, sot.storing_order.customer_company.name })
                                      .Select(g => new
                                      {
                                          NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
                                          Code = g.Key.code,
                                          Name = g.Key.name
                                      }).ToListAsync();

                    if (dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.IN))
                    {
                        return res.Select(x => new DailyInventorySummary
                        {
                            code = x.Code,
                            name = x.Name,
                            in_gate_count = x.NoOfTanks,
                            opening_balance = openingBalances

                        }).ToList();
                    }
                    else
                    {
                        inList = res.Select(x => new DailyInventorySummary
                        {
                            code = x.Code,
                            name = x.Name,
                            in_gate_count = x.NoOfTanks
                        }).ToList();
                    }
                }

                if (dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.OUT) || dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.ALL))
                {
                    query1 = query1.Where(sot => context.out_gate
                                    .Where(i => (i.delete_dt == null || i.delete_dt == 0) && i.eir_dt >= sDate && i.eir_dt <= eDate)
                                    .Select(i => i.so_tank_guid)
                                    .Contains(sot.guid)).AsQueryable();

                    var res = await query1.GroupBy(sot => new { sot.storing_order.customer_company.code, sot.storing_order.customer_company.name })
                                      .Select(g => new
                                      {
                                          NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
                                          Code = g.Key.code,
                                          Name = g.Key.name
                                      }).ToListAsync();

                    if (dailyInventoryRequest.inventory_type.EqualsIgnore(ReportType.OUT))
                    {
                        return res.Select(x => new DailyInventorySummary
                        {
                            code = x.Code,
                            name = x.Name,
                            out_gate_count = x.NoOfTanks,
                            opening_balance = openingBalances
                        }).ToList();
                    }
                    else
                    {
                        outList = res.Select(x => new DailyInventorySummary
                        {
                            code = x.Code,
                            name = x.Name,
                            out_gate_count = x.NoOfTanks
                        }).ToList();
                    }
                }
                return MergeList(inList, outList, openingBalances);

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
                             where r.status_cv == repairStatus && !string.IsNullOrEmpty(sot.purpose_repair_cv)
                             select new DailyTeamRevenue
                             {
                                 estimate_no = r.estimate_no,
                                 tank_no = sot.tank_no,
                                 code = cc.code,
                                 estimate_date = r.create_dt,  // Assuming `CreateDt` is part of `Repair`
                                 qc_by = jo.qc_by,
                                 repair_cost = r.total_cost,  // Assuming `TotalCost` is part of `StoringOrderTank`
                                 team = t.description,
                                 repair_type = sot.purpose_repair_cv == "REPAIR" ? "IN-SERVICE" : sot.purpose_repair_cv

                             }).AsQueryable();


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

                if (dailyTeamRevenueRequest.approved_start_date != null && dailyTeamRevenueRequest.approved_end_date != null)
                {
                    query = query.Where(tr => tr.approved_date >= dailyTeamRevenueRequest.approved_start_date && tr.approved_date <= dailyTeamRevenueRequest.approved_end_date);
                }

                if (dailyTeamRevenueRequest.allocation_start_date != null && dailyTeamRevenueRequest.allocation_end_date != null)
                {
                    query = query.Where(tr => tr.allocation_date >= dailyTeamRevenueRequest.allocation_start_date && tr.allocation_date <= dailyTeamRevenueRequest.allocation_end_date);
                }

                if (dailyTeamRevenueRequest.qc_start_date != null && dailyTeamRevenueRequest.qc_end_date != null)
                {
                    query = query.Where(tr => tr.qc_date >= dailyTeamRevenueRequest.qc_start_date && tr.qc_date <= dailyTeamRevenueRequest.qc_end_date);
                }

                if (dailyTeamRevenueRequest.team != null && dailyTeamRevenueRequest.team.Any())
                {
                    query = query.Where(tr => dailyTeamRevenueRequest.team.Contains(tr.team));
                }

                return await query.OrderBy(tr => tr.code).OrderBy(tr => tr.estimate_date).ToListAsync();
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
        public async Task<MonthlyReport> QueryMonthReport(ApplicationBillingDBContext context, [Service] IConfiguration config,
           [Service] IHttpContextAccessor httpContextAccessor, MontlyReportRequest monthlyReportRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                List<string> process = new List<string> { $"{ProcessType.CLEANING}", $"{ProcessType.STEAMING}", $"{ProcessType.REPAIR}" };
                if (!process.ContainsIgnore(monthlyReportRequest.report_type))
                    throw new GraphQLException(new Error($"Invalid Report Type", "ERROR"));

                int year = monthlyReportRequest.year;
                int month = monthlyReportRequest.month;
                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";


                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, month, 1);
                // Get the end date of the month (last day of the month)
                DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();


                //var query = (from sot in context.storing_order_tank
                //             join so in context.storing_order on sot.so_guid equals so.guid into soJoin
                //             from so in soJoin.DefaultIfEmpty()
                //             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccJoin
                //             from cc in ccJoin.DefaultIfEmpty()
                //             select new TempReport
                //             {
                //                 sot_guid = sot.guid,
                //                 code = cc.code,
                //                 //date = (long)s.complete_dt
                //             }).AsQueryable();


                //if (monthlyReportRequest.report_type.EqualsIgnore("cleaning"))
                //{
                //    query = (from result in query
                //             join s in context.cleaning on result.sot_guid equals s.sot_guid
                //             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();

                //}
                //else if (monthlyReportRequest.report_type.EqualsIgnore("steaming"))
                //{
                //    query = (from result in query
                //             join s in context.steaming on result.sot_guid equals s.sot_guid
                //             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();
                //}
                //else if (monthlyReportRequest.report_type.EqualsIgnore("repair"))
                //{
                //    query = (from result in query
                //             join s in context.repair on result.sot_guid equals s.sot_guid
                //             where s.status_cv == qcCompletedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();
                //}

                //if (!string.IsNullOrEmpty(monthlyReportRequest.customer_code))
                //{
                //    query = query.Where(tr => String.Equals(tr.code, monthlyReportRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                //}

                //var resultList = await query.ToListAsync();

                var resultList = await RetriveReportResult(context, monthlyReportRequest.report_type, startEpoch, endEpoch, monthlyReportRequest.customer_code);

                // Convert epoch timestamp to local date (yyyy-MM-dd)
                foreach (var item in resultList)
                {
                    // Convert epoch timestamp to DateTimeOffset (local time zone)
                    DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(item.date);
                    // Format the date as yyyy-MM-dd and replace the code with date
                    item.code = dateTimeOffset.ToString("dd/MM/yyyy");
                }
                // Group nodes by FormattedDate and count the number of SotGuids for each group
                var groupedNodes = resultList
                    .GroupBy(n => n.code)  // Group by formatted date
                    .Select(g => new
                    {
                        FormattedDate = g.Key,
                        Count = g.Count(),
                        //SotGuids = g.Select(n => n.sot_guid).Distinct().ToList() // Get distinct SotGuids
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
                    .Select(date => new CountPerDay
                    {
                        date = date,
                        day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
                        count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0
                    })
                    .OrderBy(g => g.date) // Sort by date
                    .ToList();

                // Calculate the total count of SotGuids for the month
                int totalForMonth = completeGroupedNodes.Sum(g => g.count);
                // Calculate the number of days with SotGuids greater than 0
                int daysWithCount = completeGroupedNodes.Count(g => g.count > 0);

                // Calculate the average
                int averageSotGuidsPerDay = daysWithCount > 0 ? totalForMonth / daysWithCount : 0;

                MonthlyReport monthlyReport = new MonthlyReport()
                {
                    count_per_day = completeGroupedNodes,
                    total = totalForMonth,
                    average = averageSotGuidsPerDay
                };

                return monthlyReport;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        public async Task<YearlyReport> QueryYearlyReport(ApplicationBillingDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, YearlyReportRequest yearlyReportRequest)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                List<string> process = new List<string> { $"{ProcessType.CLEANING}", $"{ProcessType.STEAMING}", $"{ProcessType.REPAIR}" };
                if (!process.ContainsIgnore(yearlyReportRequest.report_type))
                    throw new GraphQLException(new Error($"Invalid Report Type", "ERROR"));

                int year = yearlyReportRequest.year;
                int start_month = yearlyReportRequest.start_month;
                int end_month = yearlyReportRequest.end_month;
                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";


                // Get the start date of the month (1st of the month)
                DateTime startOfMonth = new DateTime(year, start_month, 1);
                int daysInMonth = DateTime.DaysInMonth(year, end_month);
                DateTime endOfMonth = new DateTime(year, end_month, daysInMonth).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Get the end date of the month (last day of the month)
                //DateTime endOfMonth = startOfMonth.AddMonths(1).AddDays(-1).AddHours(23).AddMinutes(59).AddSeconds(59);
                // Convert the start and end dates to Unix Epoch (seconds since 1970-01-01)
                long startEpoch = ((DateTimeOffset)startOfMonth).ToUnixTimeSeconds();
                long endEpoch = ((DateTimeOffset)endOfMonth).ToUnixTimeSeconds();


                //var query = (from sot in context.storing_order_tank
                //             join so in context.storing_order on sot.so_guid equals so.guid into soJoin
                //             from so in soJoin.DefaultIfEmpty()
                //             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccJoin
                //             from cc in ccJoin.DefaultIfEmpty()
                //             select new TempReport
                //             {
                //                 sot_guid = sot.guid,
                //                 code = cc.code,
                //                 //date = (long)s.complete_dt
                //             }).AsQueryable();


                //if (yearlyReportRequest.report_type.EqualsIgnore("cleaning"))
                //{
                //    query = (from result in query
                //             join s in context.cleaning on result.sot_guid equals s.sot_guid
                //             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();

                //}
                //else if (yearlyReportRequest.report_type.EqualsIgnore("steaming"))
                //{
                //    query = (from result in query
                //             join s in context.steaming on result.sot_guid equals s.sot_guid
                //             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();
                //}
                //else if (yearlyReportRequest.report_type.EqualsIgnore("repair"))
                //{
                //    query = (from result in query
                //             join s in context.repair on result.sot_guid equals s.sot_guid
                //             where s.status_cv == qcCompletedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                //                 && s.delete_dt == null
                //             select new TempReport
                //             {
                //                 sot_guid = result.sot_guid,
                //                 code = result.code,
                //                 date = (long)s.complete_dt
                //             }).AsQueryable();
                //}

                //if (!string.IsNullOrEmpty(yearlyReportRequest.customer_code))
                //{
                //    query = query.Where(tr => String.Equals(tr.code, yearlyReportRequest.customer_code, StringComparison.OrdinalIgnoreCase));
                //}

                //var resultList = await query.OrderBy(tr => tr.date).ToListAsync();

                var resultList = await RetriveReportResult(context, yearlyReportRequest.report_type, startEpoch, endEpoch, yearlyReportRequest.customer_code);

                // Convert epoch timestamp to local date (yyyy-MM-dd)
                foreach (var item in resultList)
                {
                    // Convert epoch timestamp to DateTimeOffset (local time zone)
                    DateTimeOffset dateTimeOffset = DateTimeOffset.FromUnixTimeSeconds(item.date);
                    // Format the date as yyyy-MM-dd and replace the code with date
                    item.code = dateTimeOffset.ToString("MMMM");
                }
                // Group nodes by FormattedDate and count the number of SotGuids for each group
                var groupedNodes = resultList
                    .GroupBy(n => n.code)  // Group by formatted date
                    .Select(g => new
                    {
                        FormattedDate = g.Key,
                        Count = g.Count(),
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
                    .Select(date => new CountPerMonth
                    {
                        //date = date,
                        //day = DateTime.ParseExact(date, "dd/MM/yyyy", null).ToString("dddd"), // Get the day of the week (e.g., Monday)
                        month = date,
                        count = groupedNodes.FirstOrDefault(g => g.FormattedDate == date)?.Count ?? 0
                    })
                    //.OrderBy(g => g.date) // Sort by date
                    .ToList();

                // Calculate the total count of SotGuids for the month
                int total = completeGroupedNodes.Sum(g => g.count);
                // Calculate the number of days with SotGuids greater than 0
                int monthsWithCount = completeGroupedNodes.Count(g => g.count > 0);

                // Calculate the average
                int average = monthsWithCount > 0 ? total / monthsWithCount : 0;

                YearlyReport yearlyReport = new YearlyReport()
                {
                    count_per_month = completeGroupedNodes,
                    total = total,
                    average = average
                };

                return yearlyReport;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<List<TempReport>?> RetriveReportResult(ApplicationBillingDBContext context, string reportType, long startEpoch, long endEpoch, string customerCode)
        {

            try
            {
                string completedStatus = "COMPLETED";
                string qcCompletedStatus = "QC_COMPLETED";

                var query = (from sot in context.storing_order_tank
                             join so in context.storing_order on sot.so_guid equals so.guid into soJoin
                             from so in soJoin.DefaultIfEmpty()
                             join cc in context.customer_company on so.customer_company_guid equals cc.guid into ccJoin
                             from cc in ccJoin.DefaultIfEmpty()
                             select new TempReport
                             {
                                 sot_guid = sot.guid,
                                 code = cc.code,
                                 //date = (long)s.complete_dt
                             }).AsQueryable();


                if (reportType.EqualsIgnore("cleaning"))
                {
                    query = (from result in query
                             join s in context.cleaning on result.sot_guid equals s.sot_guid
                             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                                 && s.delete_dt == null
                             select new TempReport
                             {
                                 sot_guid = result.sot_guid,
                                 code = result.code,
                                 date = (long)s.complete_dt
                             }).AsQueryable();

                }
                else if (reportType.EqualsIgnore("steaming"))
                {
                    query = (from result in query
                             join s in context.steaming on result.sot_guid equals s.sot_guid
                             where s.status_cv == completedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                                 && s.delete_dt == null
                             select new TempReport
                             {
                                 sot_guid = result.sot_guid,
                                 code = result.code,
                                 date = (long)s.complete_dt
                             }).AsQueryable();
                }
                else if (reportType.EqualsIgnore("repair"))
                {
                    //query = (from result in query
                    //         join s in context.repair on result.sot_guid equals s.sot_guid
                    //         where s.status_cv == qcCompletedStatus && s.complete_dt != null && s.complete_dt != 0 && s.complete_dt >= startEpoch && s.complete_dt <= endEpoch
                    //             && s.delete_dt == null
                    //         select new TempReport
                    //         {
                    //             sot_guid = result.sot_guid,
                    //             code = result.code,
                    //             date = (long)s.complete_dt
                    //         }).AsQueryable();


                    query = (from result in query
                             join s in context.repair on result.sot_guid equals s.sot_guid
                             join rp in context.repair_part on s.guid equals rp.repair_guid
                             join jo in context.job_order on rp.job_order_guid equals jo.guid into joJoin
                             from jo in joJoin.DefaultIfEmpty()  // Left Join
                             where s.status_cv == qcCompletedStatus && s.delete_dt == null && jo.qc_dt >= startEpoch && jo.qc_dt <= endEpoch &&
                                   rp.guid == (from rp2 in context.repair_part
                                               where rp2.repair_guid == s.guid && rp2.approve_part == true && rp2.delete_dt == null
                                               orderby rp2.guid  // Ensuring we take the first match
                                               select rp2.guid).FirstOrDefault()
                             select new TempReport
                             {
                                 sot_guid = result.sot_guid,
                                 code = result.code,
                                 date = (long)jo.qc_dt
                             }).AsQueryable();
                }

                if (!string.IsNullOrEmpty(customerCode))
                {
                    query = query.Where(tr => String.Equals(tr.code, customerCode, StringComparison.OrdinalIgnoreCase));
                }

                var resultList = await query.OrderBy(tr => tr.date).ToListAsync();
                return resultList;
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }


        private List<DailyInventorySummary> MergeList(List<DailyInventorySummary> list1, List<DailyInventorySummary> list2, List<OpeningBalance?> openingBalances)
        {
            List<DailyInventorySummary> mergedList = new List<DailyInventorySummary>();
            try
            {
                mergedList = (from l1 in list1
                              join l2 in list2 on l1.code equals l2.code into joined
                              from l2 in joined.DefaultIfEmpty()
                              select new DailyInventorySummary
                              {
                                  code = l1.code,
                                  name = l1.name,
                                  in_gate_count = l1.in_gate_count,
                                  out_gate_count = l2?.out_gate_count ?? 0,
                                  opening_balance = openingBalances
                              })
                           .Union(
                               from l2 in list2
                               where !list1.Any(l1 => l1.code == l2.code)
                               select new DailyInventorySummary
                               {
                                   code = l2.code,
                                   name = l2.name,
                                   in_gate_count = 0,
                                   out_gate_count = l2.out_gate_count,
                                   opening_balance = openingBalances
                               }
                           )
                           .ToList();
            }
            catch (Exception ex)
            {
                throw ex;
            }

            return mergedList;
        }

        private async Task<List<OpeningBalance>> QueryOpeningBalance(ApplicationBillingDBContext context, long inventoryDate)
        {
            try
            {
                long sDate = inventoryDate; //StartDateExtract(inventoryDate);
                var res = (from ig in context.in_gate
                           join og in context.out_gate
                               on ig.so_tank_guid equals og.so_tank_guid into ogGroup
                           from og in ogGroup.DefaultIfEmpty()
                           where (ig.delete_dt == null || ig.delete_dt == 0) && ig.eir_dt < sDate
                                 && (og.delete_dt == null || og.delete_dt == 0) && (og.eir_dt == null || og.eir_dt > sDate)
                           group ig by ig.yard_cv into grouped
                           select new
                           {
                               OpeningBalance = grouped.Count(ig => ig.so_tank_guid != null),
                               Yard = grouped.Key
                           }).AsQueryable();

                return await res.Select(x => new OpeningBalance
                {
                    yard = x.Yard,
                    open_balance = x.OpeningBalance
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async Task<List<OpeningBalance>> QueryYardCount(ApplicationBillingDBContext context, string type, long sDate, long eDate, List<OpeningBalance> openingBalances)
        {
            try
            {
                List<OpeningBalance> inList = new List<OpeningBalance>();
                List<OpeningBalance> outList = new List<OpeningBalance>();

                if (type.EqualsIgnore(ReportType.IN) || type.EqualsIgnore(ReportType.ALL))
                {
                    var result = await (from sot in context.storing_order_tank
                                        join i in context.in_gate
                                        on sot.guid equals i.so_tank_guid into leftJoin
                                        from i in leftJoin.DefaultIfEmpty()
                                        where context.in_gate
                                               .Where(ig => ig.delete_dt == null
                                                            && ig.eir_dt >= sDate
                                                            && ig.eir_dt <= eDate)
                                               .Select(ig => ig.so_tank_guid)
                                               .Distinct()
                                               .Contains(sot.guid)
                                        group sot by i.yard_cv into grouped
                                        select new OpeningBalance
                                        {
                                            in_count = grouped.Count(),
                                            yard = grouped.Key
                                        }).ToListAsync();
                    inList = result;
                }

                if (type.EqualsIgnore(ReportType.OUT) || type.EqualsIgnore(ReportType.ALL))
                {
                    var result = await (from sot in context.storing_order_tank
                                        join i in context.out_gate
                                        on sot.guid equals i.so_tank_guid into leftJoin
                                        from i in leftJoin.DefaultIfEmpty()
                                        where context.out_gate
                                               .Where(ig => ig.delete_dt == null
                                                            && ig.eir_dt >= sDate
                                                            && ig.eir_dt <= eDate)
                                               .Select(ig => ig.so_tank_guid)
                                               .Distinct()
                                               .Contains(sot.guid)
                                        group sot by i.yard_cv into grouped
                                        select new OpeningBalance
                                        {
                                            out_count = grouped.Count(),
                                            yard = grouped.Key
                                        }).ToListAsync();

                    outList = result;
                }

                foreach (var item in openingBalances)
                {
                    if (inList.Count() != 0)
                        item.in_count = inList.Where(i => i.yard == item.yard).Select(i => i.in_count).FirstOrDefault();

                    if (outList.Count != 0)
                        item.out_count = outList.Where(i => i.yard == item.yard).Select(i => i.out_count).FirstOrDefault();
                }

                return openingBalances.OrderBy(i => i.yard).ToList();

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private long StartDateExtract(long dateTimeEpoch)
        {

            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(dateTimeEpoch).UtcDateTime;

            // Set time to 00:00:00 (midnight)
            DateTime dateOnly = dateTime.Date;  // This removes the time portion

            //DateTime dateGMT = dateOnly.ToUniversalTime();

            // Convert the DateTime back to epoch time (in seconds)
            long epochDateOnly = ((DateTimeOffset)dateOnly).ToUnixTimeSeconds();

            return epochDateOnly;
        }

        private long EndDateExtract(long endTimeEpoch)
        {
            // Assume you have an epoch timestamp in seconds
            //long epochTimestamp = 1615825923; // Example epoch timestamp

            // Convert epoch to DateTime
            DateTime dateTime = DateTimeOffset.FromUnixTimeSeconds(endTimeEpoch).UtcDateTime;

            // Set time to the end of the day (23:59:59)
            DateTime endOfDay = dateTime.Date.AddDays(1).AddTicks(-1); // 23:59:59.9999999

            // Convert the DateTime back to epoch time (in seconds)
            long epochEndOfDay = ((DateTimeOffset)endOfDay).ToUnixTimeSeconds();

            return epochEndOfDay;
        }
    }
}
