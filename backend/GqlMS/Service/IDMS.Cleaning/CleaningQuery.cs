using HotChocolate.Types;
using HotChocolate;
using IDMS.Repair.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Repair;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(RepairEstQuery))]
    public class CleaningQuery
    {

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<in_gate_cleaning> QueryInGateCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<in_gate_cleaning> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.in_gate_cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

            return query;
        }
    }
}
