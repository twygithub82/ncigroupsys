﻿using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System.Diagnostics.Eventing.Reader;

namespace IDMS.Models.Tariff.GqlTypes
{
    public class TariffQuery
    {
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
        public IQueryable<tariff_cleaning?> QueryTariffCleaning(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_cleaning> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0)
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


        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
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
            [Service] IHttpContextAccessor httpContextAccessor, string? groupName, string? subgroupName)
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

                if (subgroupName == null)
                {
                    query = query.Where(tr => tr.subgroup_name_cv == null || tr.group_name_cv == "");
                }
                else if(subgroupName != "")
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


        //[UseProjection()]
        //[UseFiltering()]
        //[UseSorting]
        //public IQueryable<tariff_repair?> QueryDistinctValue(ApplicationTariffDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, string? partName)
        //{
        //    try
        //    {
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);

        //        //var query = context.tariff_repair.AsQueryable();

        //        // Apply filters conditionally
        //        //if (!string.IsNullOrEmpty(partName))
        //        //{
        //        //    query = query.Where(tr => tr.part_name == partName);
        //        //}

        //        // Select distinct part names
        //        var distinctDimension = context.tariff_repair;
        //        //distinctDimension.Distinct();

        //        return distinctDimension;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }


        //}

    }
}
