using HotChocolate.Data;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace IDMS.Models.Tariff.All.GqlTypes
{
    public class TariffCleaning_QueryType
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_depot?> QueryTariffDepot( ApplicationTariffDBContext context,
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
        public  IQueryable<tariff_cleaning?> QueryTariffCleaning( ApplicationTariffDBContext context,
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
        public IQueryable<tariff_labour?> QueryTariffLabour( ApplicationTariffDBContext context,
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
        public IQueryable<tariff_residue?> QueryTariffResidue( ApplicationTariffDBContext context,
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


        //public async Task<EntityClass_CleaningProcedureWithStepsAndGroupShort > QueryCleaningProcedureWithStepsAndGroupShort([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string queryCleaningProcedure_guid)
        //{
        //    EntityClass_CleaningProcedureWithStepsAndGroupShort retval = new EntityClass_CleaningProcedureWithStepsAndGroupShort();
        //    try
        //    {
        //        var table = "idms.cleaning_procedure";
        //        GqlUtils.IsAuthorize(config, httpContextAccessor);

        //        string sqlStatement =$"select * from {table} where guid ='{queryCleaningProcedure_guid}'";
        //        var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
        //        var resultList = resultJtoken["result"];
        //        if (resultList?.Count() > 0)
        //        {
        //            var result = resultList[0];
        //            retval = result.ToObject<EntityClass_CleaningProcedureWithStepsAndGroupShort>();
        //            //sqlStatement = $"select * from idms.cleaning_steps where guid in (select cleaning_step_guid from idms.cleaning_procedure_steps where cleaning_procedure_guid ='{retval.guid}')";
        //            sqlStatement = @$"select a.*, b.duration from idms.cleaning_steps a inner join 
        //                           (select cleaning_step_guid, duration from idms.cleaning_procedure_steps where cleaning_procedure_guid ='{retval.guid}' and delete_dt is null) b on a.guid=b.cleaning_step_guid";
        //            resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
        //            resultList = resultJtoken["result"];
        //            if(resultList?.Count() > 0)
        //            {
        //                var clnSteps = resultList.ToObject<List<EntityClass_CleaningStepWithDuration>>();
        //                retval.CleaningSteps = clnSteps.ToArray();
        //            }
        //            if(!string.IsNullOrEmpty(retval.clean_group_guid))
        //            {
        //                sqlStatement = $"select * from idms.cleaning_group where guid ='{retval.clean_group_guid}'";
        //                resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
        //                resultList = resultJtoken["result"];
        //                if (resultList?.Count() > 0)
        //                {
        //                    var clnGroup = resultList[0];
        //                    var cleanGroupShort = clnGroup.ToObject<EntityClass_CleaningGroup_Short>();
        //                    retval.CleaningGroupShort = cleanGroupShort;
        //                }
        //            }
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
