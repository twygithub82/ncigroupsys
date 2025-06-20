﻿using HotChocolate.Types;
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
using CommonUtil.Core.Service;


namespace IDMS.Billing.GqlTypes
{
    [ExtendObjectType(typeof(BillingQuery))]
    public class ReportQuery
    {
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
                                                                 && !StatusCondition.BeforeTankIn.Contains(sot.tank_status_cv) && i.delete_dt == null
                                                           select (new PeriodicTestDueSummary
                                                           {
                                                               tank_no = tf.tank_no,
                                                               eir_dt = i.eir_dt,
                                                               eir_no = i.eir_no,
                                                               customer_code = cc.code,
                                                               customer_name = cc.name,
                                                               owner_code = occ.code,
                                                               last_test_type = tf.last_test_cv == "2.5" ? "2.5 Year (Air)" :
                                                                            tf.last_test_cv == "5" ? "5 Year (Hydro)" : null,
                                                               class_cv = tf.test_class_cv,
                                                               test_dt = tf.test_dt,
                                                               next_test_type = tf.next_test_cv == "2.5" ? "2.5 Year (Air)" :
                                                                            tf.next_test_cv == "5" ? "5 Year (Hydro)" : null,
                                                               next_test_dt = tf.test_dt + nextTestThreshold,
                                                               due_type = (tf.test_dt + nextTestThreshold) < currentDateTime ? "Due" : "Not Due",
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

                if (!string.IsNullOrEmpty(periodicTestDueRequest.due_type))
                {
                    //query = query.Where(i => i.due_type.EqualsIgnore(periodicTestDueRequest.due_type));
                    query = query.Where(i => String.Equals(i.due_type, periodicTestDueRequest.due_type, StringComparison.OrdinalIgnoreCase));
                }

                result = await query.OrderBy(i => i.customer_code).ToListAsync();
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

                //var excludeStatus = new List<string>() { "SO_GENERATED", "IN_GATE", "IN_SURVEY" };
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
                                                               && !StatusCondition.BeforeTankIn.Contains(sot.tank_status_cv)
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
                    //Master in here need to check eir_status = published ?? and publish_dt != null ???
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

                List<OpeningBalance> resultList = new List<OpeningBalance>();

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


                //if (openingBalances.Any())
                //    resultList = openingBalances;
                if (inList.Any())
                    resultList = inList;
                else if (outList.Any())
                    resultList = outList;

                if (resultList.Any())
                {
                    foreach (var item in resultList)
                    {
                        item.in_count = inList.FirstOrDefault(i => i.yard == item.yard)?.in_count ?? 0;
                        item.out_count = outList.FirstOrDefault(i => i.yard == item.yard)?.out_count ?? 0;
                        item.open_balance = openingBalances.FirstOrDefault(i => i.yard == item.yard)?.open_balance ?? 0;
                    }

                    return resultList.OrderBy(i => i.yard).ToList();
                }

                return resultList;

                //if (openingBalances.Count > 0)
                //{
                //    foreach (var item in openingBalances)
                //    {
                //        if (inList.Count() != 0)
                //            item.in_count = inList.Where(i => i.yard == item.yard).Select(i => i.in_count).FirstOrDefault();

                //        if (outList.Count != 0)
                //            item.out_count = outList.Where(i => i.yard == item.yard).Select(i => i.out_count).FirstOrDefault();
                //    }

                //    return openingBalances.OrderBy(i => i.yard).ToList();
                //}
                //else if (inList.Count > 0)
                //{
                //    foreach (var item in inList)
                //    {
                //        if (inList.Count() != 0)
                //            item.in_count = inList.Where(i => i.yard == item.yard).Select(i => i.in_count).FirstOrDefault();

                //        if (outList.Count != 0)
                //            item.out_count = outList.Where(i => i.yard == item.yard).Select(i => i.out_count).FirstOrDefault();
                //    }

                //    return inList.OrderBy(i => i.yard).ToList();
                //}
                //else if (outList.Count > 0)
                //{
                //    foreach (var item in outList)
                //    {
                //        if (inList.Count() != 0)
                //            item.in_count = inList.Where(i => i.yard == item.yard).Select(i => i.in_count).FirstOrDefault();

                //        if (outList.Count != 0)
                //            item.out_count = outList.Where(i => i.yard == item.yard).Select(i => i.out_count).FirstOrDefault();
                //    }

                //    return outList.OrderBy(i => i.yard).ToList();

                //}

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}
