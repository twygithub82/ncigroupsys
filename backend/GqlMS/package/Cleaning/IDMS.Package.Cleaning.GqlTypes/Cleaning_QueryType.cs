using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Master;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;

namespace IDMS.Models.Package.Cleaning.GqlTypes
{
    public class PackageCleaning_QueryType
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public  IQueryable<customer_company_cleaning_category_with_customer_company ?> QueryPackageCleaning([Service] ApplicationPackageDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<customer_company_cleaning_category_with_customer_company> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.customer_company_cleaning_category.Where(i => i.delete_dt == null || i.delete_dt == 0)
                      .Include(pc => pc.customer_company)
                      .Include(pc => pc.cleaning_category);
                      
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
