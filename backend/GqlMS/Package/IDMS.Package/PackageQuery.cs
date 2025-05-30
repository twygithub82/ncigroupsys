﻿using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Master;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace IDMS.Models.Package.GqlTypes
{
    public class PackageQuery
    {

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_depot?> QueryPackageDepot(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_depot> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_depot.Where(i => i.delete_dt == null || i.delete_dt == 0).Include(c => c.customer_company);//.Include(td=>td.depot);
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
        public IQueryable<customer_company_cleaning_category?> QueryPackageCleaning(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<customer_company_cleaning_category> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.customer_company_cleaning_category.Where(i => i.delete_dt == null || i.delete_dt == 0)
                      .Include(pc => pc.customer_company)
                      .Include(pc => pc.cleaning_category)
                        .ThenInclude(t => t.tariff_cleanings);

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;

        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_labour?> QueryPackageLabour(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_labour> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_labour.Where(i => i.delete_dt == null || i.delete_dt == 0);

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
        public IQueryable<package_residue?> QueryPackageResidue(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_residue> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_residue.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_buffer?> QueryPackageBuffer(ApplicationPackageDBContext context,
             [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_buffer> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_buffer.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_repair?> QueryPackageRepair(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_repair> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_repair.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_steaming?> QueryPackageSteaming(ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<package_steaming> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_steaming.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;
        }
        //public async Task<List<EntityClass_CleaningProcedure>> QueryCleaningProcedures([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,EntityClass_CleaningProcedure queryCleaningProcedure,string orderby="guid",int offset = 0, int limit=10)
        //{
        //    List<EntityClass_CleaningProcedure> retval = new List<EntityClass_CleaningProcedure>();
        //    try
        //    {
        //        var table = "idms.cleaning_procedure";
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        JObject  jtkObj = JObject.FromObject(queryCleaningProcedure);
        //        jtkObj.Remove("guid");
        //        jtkObj["delete_dt"] = "is null";
        //        string jsonString = $@"{{
        //                'select': ['*'],
        //                'where': {jtkObj.ToString()},
        //                'orderBy': '{orderby}',
        //                'offset': {offset},
        //                'limit': {limit}
        //            }}";
        //        jtkObj = JObject.Parse(jsonString);
        //        string sqlStatement = GqlUtils.GenerateSqlSelect(jtkObj, table);
        //        var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
        //        var resultList = resultJtoken["result"];
        //        if (resultList?.Count() > 0)
        //        {
        //            retval = resultList.ToObject<List<EntityClass_CleaningProcedure>>();

        //        }

        //    }
        //    catch
        //    {
        //        throw;
        //    }



        //    return retval;
        //}

    }
}
