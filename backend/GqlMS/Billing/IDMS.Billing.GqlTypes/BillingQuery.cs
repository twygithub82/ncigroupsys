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
                    query = query.Where(sot => sot.storing_order.customer_company.code == cleaningInventoryRequest.customer_code);
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
                if (cleaningInventoryRequest.report_type == "customer")
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
                else if (cleaningInventoryRequest.report_type == "cargo")
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
                else if (cleaningInventoryRequest.report_type == "un")
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

                //long sDate = periodicTestDueRequest.start_date; //StartDateExtract(cleaningInventoryRequest.start_date);
                //long eDate = periodicTestDueRequest.end_date;

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
                                                                 && !new[] { "SO_GENERATED", "IN_GATE", "IN_SURVEY" }.Contains(sot.tank_status_cv) && i.delete_dt == null
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
                    query = query.Where(tf => tf.customer_code == periodicTestDueRequest.customer_code);
                }

                if (!string.IsNullOrEmpty(periodicTestDueRequest.tank_no))
                {
                    query = query.Where(tf => tf.tank_no.Contains(periodicTestDueRequest.tank_no));
                }

                if (!string.IsNullOrEmpty(periodicTestDueRequest.eir_no))
                {
                    query = query.Where(tf => tf.eir_no.EqualsIgnore(periodicTestDueRequest.eir_no));
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

                return result;
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
                openingBalances = await QueryOpeningBalance(context, sDate);

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

                if (dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.IN) || dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.ALL))
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

                    if (dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.IN))
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

                if (dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.OUT) || dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.ALL))
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

                    if (dailyInventoryRequest.inventory_type.EqualsIgnore(DailyInventoryReportType.OUT))
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
                    count = x.OpeningBalance
                }).ToListAsync();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        //public async Task<List<OpeningBalance>> QueryOpeningBalance(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //       [Service] IHttpContextAccessor httpContextAccessor, long inventoryDate)
        //{
        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long sDate = StartDateExtract(inventoryDate);

        //        var res = (from ig in context.in_gate
        //                   join og in context.out_gate
        //                       on ig.so_tank_guid equals og.so_tank_guid into ogGroup
        //                   from og in ogGroup.DefaultIfEmpty()
        //                   where (ig.delete_dt == null || ig.delete_dt == 0) && ig.eir_dt < sDate
        //                         && (og.delete_dt == null || og.delete_dt == 0) && (og.eir_dt == null || og.eir_dt > sDate)
        //                   group ig by ig.yard_cv into grouped
        //                   select new
        //                   {
        //                       OpeningBalance = grouped.Count(ig => ig.so_tank_guid != null),
        //                       Yard = grouped.Key
        //                   }).AsQueryable();

        //        return res.Select(x => new OpeningBalance
        //        {
        //            yard = x.Yard,
        //            count = x.OpeningBalance
        //        }).ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

        //[UseFiltering]
        //public IQueryable<CleaningReportCustomer> QuerySummaryReport1(ApplicationBillingDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, InventoryReportRequest inventoryReportRequest)
        //{
        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);

        //        DateTime sDate = ExtractDateFromEpoch(inventoryReportRequest.start_date);
        //        DateTime eDate = ExtractDateFromEpoch(inventoryReportRequest.end_date);


        //        var query = context.storing_order_tank
        //                        .Where(sot => context.cleaning
        //                        .Where(c => c.complete_dt >= inventoryReportRequest.start_date && c.complete_dt <= inventoryReportRequest.end_date)
        //                        .Select(c => c.sot_guid)
        //                        .Contains(sot.guid)).AsQueryable();


        //        //if (!string.IsNullOrEmpty(inventoryReportRequest.customer_code))
        //        //{
        //        //    query = query.Where(sot => sot.storing_order.customer_company.code == inventoryReportRequest.customer_code);
        //        //}

        //        //if (!string.IsNullOrEmpty(inventoryReportRequest.last_cargo))
        //        //{
        //        //    query = query.Where(sot => sot.tariff_cleaning.cargo == inventoryReportRequest.last_cargo);
        //        //}

        //        // Apply filters conditionally
        //        if (inventoryReportRequest.report_type == "customer")
        //        {
        //            query = (IQueryable<storing_order_tank>)query.GroupBy(sot => new { sot.storing_order.customer_company.code, sot.storing_order.customer_company.name })
        //                              .Select(g => new
        //                              {
        //                                  NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
        //                                  Code = g.Key.code,
        //                                  Name = g.Key.name
        //                              }).ToList().AsQueryable();


        //            //return res.Select(x => new CleaningReportCustomer
        //            //{
        //            //    code = x.Code,
        //            //    name = x.Name,
        //            //    count = x.NoOfTanks
        //            //}).ToList();
        //        }
        //        else if (inventoryReportRequest.report_type == "cargo")
        //        {
        //            var res = query.GroupBy(sot => new { sot.tariff_cleaning.cargo });
        //                              //.Select(g => new
        //                              //{
        //                              //    NoOfTanks = g.Select(s => s.guid).Distinct().Count(), // Count distinct `guid`
        //                              //    Cargo = g.Key.cargo
        //                              //}).ToList();


        //            //return res.Select(x => new CleaningReportCustomer
        //            //{
        //            //    code = x.Cargo,
        //            //    count = x.NoOfTanks
        //            //}).ToList();
        //        }

        //        return null;

        //        //// Apply filters conditionally
        //        //if (!string.IsNullOrEmpty(partName))
        //        //{
        //        //    query = query.Where(tr => tr.dimension == dimension);
        //        //}

        //        //// Select distinct part names
        //        //var distinctLength = await query
        //        //    .Select(tr => new { tr.length, tr.length_unit_cv })
        //        //    .Distinct()
        //        //    .ToListAsync();

        //        //return distinctLength;

        //        //return distinctLength
        //        //   .Select(x => new LengthWithUnit
        //        //   {
        //        //       length = x.length,
        //        //       length_unit_cv = x.length_unit_cv
        //        //   })
        //        //   .ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

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
