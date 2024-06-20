using HotChocolate.Data;
using IDMS.Models.Inventory;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IDMS.Models.Parameter.CleaningSteps.GqlTypes
{
    public class CleaningSteps_QueryType
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering()]
        [UseSorting]
        public  IQueryable<EntityClass_CleaningStep> QueryCleaningSteps([Service] ApplicationParameterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<EntityClass_CleaningStep> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_steps.Where(i => i.delete_dt == null).Include(s=>s.clean_procedures);


            }
            catch
            {
                throw;
            }

            return query;
        }


      
    }
}
