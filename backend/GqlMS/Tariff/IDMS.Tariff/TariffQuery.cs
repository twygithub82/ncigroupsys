using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.Inventory;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace IDMS.Models.Tariff.GqlTypes
{
    public class TariffQuery
    {

        #region Original
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_cleaning?> QueryTariffCleaning(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_cleaning> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0)
                      //.Include(tc=>tc.sot)
                      .Include(tc => tc.cleaning_method)
                      .Include(tc => tc.cleaning_category)
                      .Where(tc => (tc.cleaning_method.delete_dt == null || tc.cleaning_method.delete_dt == 0) &&
                       (tc.cleaning_category.delete_dt == null || tc.cleaning_category.delete_dt == 0));
            }
            catch
            {
                throw;
            }

            return query;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_depot?> QueryTariffDepot(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_depot> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_depot.Where(i => i.delete_dt == null || i.delete_dt == 0)
                        .Include(t => t.tanks);
            }
            catch
            {
                throw;
            }

            return query;

        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_labour?> QueryTariffLabour(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_labour> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_labour.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_residue?> QueryTariffResidue(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_residue> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_residue.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_buffer?> QueryTariffBuffer(ApplicationTariffDBContext context,
          [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_buffer> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_buffer.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_repair?> QueryTariffRepair(ApplicationTariffDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_repair> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_repair.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_steaming?> QueryTariffSteaming(ApplicationTariffDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_steaming> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_steaming.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }

        #endregion

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffCleaningResult?> QueryTariffCleaningWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_cleaning> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_cleaning
                                     .Include(tc => tc.sot) // Ensure the 'sot' navigation property is loaded
                                     .Where(tc => tc.delete_dt == null || tc.delete_dt == 0)
                                     .Select(tc => new TariffCleaningResult
                                     {
                                         tariff_cleaning = tc,
                                         tank_count = tc.sot.Count()
                                     })
                                     .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }


        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffResidueResult?> QueryTariffResidueWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_residue> query = null;
            try
            {
                List<string> invalidStatus = new List<string>() { "CANCELED", "NO_ACTION" };
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_residue
                                     .Include(tr => tr.residue_part)
                                     .ThenInclude(rp => rp.residue)
                                     .Where(tr => tr.delete_dt == null || tr.delete_dt == 0)
                                     .Select(tr => new TariffResidueResult
                                     {
                                         tariff_residue = tr,
                                         tank_count = tr.residue_part.Count(rp => 
                                                                            rp.residue != null && rp.residue.delete_dt == null 
                                                                            && !invalidStatus.Contains(rp.residue.status_cv)
                                                                            && rp.delete_dt == null)
                                     })
                                     .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffSteamingResult?> QueryTariffSteamingWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                List<string> invalidStatus = new List<string>() { "CANCELED", "NO_ACTION" };
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_steaming
                                     .Include(tr => tr.steaming_part)
                                     .ThenInclude(rp => rp.steaming)
                                     .Where(tr => tr.delete_dt == null || tr.delete_dt == 0)
                                     .Select(tr => new TariffSteamingResult
                                     {
                                         tariff_steaming = tr,
                                         tank_count = tr.steaming_part.Count(rp => 
                                                                             rp.steaming != null && rp.steaming.delete_dt == null 
                                                                             && !invalidStatus.Contains(rp.steaming.status_cv)
                                                                             && rp.delete_dt == null)
                                     })
                                     .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffRepairResult?> QueryTariffRepairWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                List<string> invalidStatus = new List<string>() { "CANCELED", "NO_ACTION" };
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_repair
                                     .Include(tr => tr.repair_part)
                                     .ThenInclude(rp => rp.repair)
                                     .Where(tr => tr.delete_dt == null || tr.delete_dt == 0)
                                     .Select(tr => new TariffRepairResult
                                     {
                                         tariff_repair = tr,
                                         tank_count = tr.repair_part.Count(rp => rp.repair != null && rp.repair.delete_dt == null
                                                                          && !invalidStatus.Contains(rp.repair.status_cv)
                                                                          && rp.delete_dt == null)
                                     })
                                     .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffDepotResult?> QueryTariffDepotWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_depot.Where(td=>td.delete_dt == null || td.delete_dt == 0)
                                    .Select(td => new TariffDepotResult
                                    {
                                        tariff_depot = td,
                                        tank_count = td.tanks
                                            .Where(tk => tk.delete_dt == null)
                                            .SelectMany(tk => tk.sot)
                                            .Count(sot => sot.delete_dt == null)
                                    })
                                    .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<TariffBufferResult?> QueryTariffBufferWithCount(ApplicationTariffDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.tariff_buffer
                                      .Where(tb => tb.delete_dt == null || tb.delete_dt == 0)
                                      .Select(tb => new TariffBufferResult
                                      {
                                          tariff_buffer = tb,
                                          tank_count = tb.in_gate_survey
                                              .Where(igs => igs.delete_dt == null && igs.in_gate != null && igs.in_gate.delete_dt == null)
                                              .Count()
                                      })
                                      .AsQueryable();
                return result;
            }
            catch
            {
                throw;
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<steaming_exclusive?> QuerySteamingExclusive(ApplicationTariffDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<steaming_exclusive> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.steaming_exclusive.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch
            {
                throw;
            }

            return query;
        }


        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<un_number?> QueryUNClassByNo(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string unNo)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var query = context.un_number.Where(u => u.un_no == unNo && (u.delete_dt == null || u.delete_dt == 0));
                return query;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<List<string?>> QueryDistinctClassNo(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var query = context.un_number.AsQueryable();
                var distinctClassNo = await context.un_number
                      .Select(un => un.class_cv)
                      .Distinct()
                      .OrderBy(classCv => classCv)
                      .ToListAsync();

                return distinctClassNo;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<List<string?>> QueryDistinctPartName(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string? groupName, string? subgroupName, string? part_name)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var query = context.tariff_repair.AsQueryable();

                // Apply filters conditionally
                if (!string.IsNullOrEmpty(groupName))
                {
                    query = query.Where(tr => tr.group_name_cv.ToLower() == groupName.ToLower());
                }

                if (!string.IsNullOrEmpty(part_name))
                {
                    query = query.Where(tr => tr.part_name.ToLower().Contains(part_name.ToLower()));
                }

                if (subgroupName == null)
                {
                    query = query.Where(tr => tr.subgroup_name_cv == null || tr.group_name_cv == "");
                }
                else if (subgroupName != "")
                {
                    query = query.Where(tr => tr.subgroup_name_cv.ToLower() == subgroupName.ToLower());
                }

                // Select distinct part names
                var distinctPartNames = await query
                    .Select(tr => tr.part_name)
                    .Distinct()
                    .ToListAsync();

                return distinctPartNames;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<List<string?>> QueryDistinctDimension(ApplicationTariffDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, string? partName)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var query = context.tariff_repair.AsQueryable();

                // Apply filters conditionally
                if (!string.IsNullOrEmpty(partName))
                {
                    query = query.Where(tr => tr.part_name == partName);
                }

                // Select distinct part names
                var distinctDimension = await query
                    .Select(tr => tr.dimension)
                    .Distinct()
                    .ToListAsync();

                return distinctDimension;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<List<LengthWithUnit>> QueryDistinctLength(ApplicationTariffDBContext context, [Service] IConfiguration config,
             [Service] IHttpContextAccessor httpContextAccessor, string? partName, string? dimension)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var query = context.tariff_repair.AsQueryable();

                // Apply filters conditionally
                if (!string.IsNullOrEmpty(partName))
                {
                    query = query.Where(tr => tr.part_name == partName);
                }


                // Apply filters conditionally
                if (!string.IsNullOrEmpty(partName))
                {
                    query = query.Where(tr => tr.dimension == dimension);
                }

                // Select distinct part names
                var distinctLength = await query
                    .Select(tr => new { tr.length, tr.length_unit_cv })
                    .Distinct()
                    .ToListAsync();

                //return distinctLength;

                return distinctLength
                   .Select(x => new LengthWithUnit
                   {
                       length = x.length,
                       length_unit_cv = x.length_unit_cv
                   })
                   .ToList();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

    }
}
