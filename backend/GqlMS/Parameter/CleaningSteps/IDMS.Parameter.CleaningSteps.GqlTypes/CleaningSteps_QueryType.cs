using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace IDMS.Models.Parameter.CleaningSteps.GqlTypes
{
    public class CleaningSteps_QueryType
    {
        // [Authorize]
        public async Task<List<EntityClass_CleaningStep>> QueryAllCleaningStep([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            List<EntityClass_CleaningStep> retval = new List<EntityClass_CleaningStep>();
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string sqlStatement = "select * from idms.cleaning_steps where  delete_dt is null";
                var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                var resultList = resultJtoken["result"];
                if (resultList?.Count() > 0)
                {
                    retval = resultList.ToObject<List<EntityClass_CleaningStep>>();
                }
              
            }
            catch
            {
                throw;
            }

            return retval;
        }


        public async Task<EntityClass_CleaningStep> QueryCleaningStep([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,string guid)
        {
            EntityClass_CleaningStep retval = new EntityClass_CleaningStep();
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);

                string sqlStatement = $"select * from idms.cleaning_steps where guid='{guid}' and  delete_dt is null";
                var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                var resultList = resultJtoken["result"];
                if (resultList?.Count() > 0)
                {
                    var firstData = resultList[0];
                    retval = firstData.ToObject<EntityClass_CleaningStep>();
                   
                }

            }
            catch
            {
                throw;
            }

            return retval;
        }
    }
}
