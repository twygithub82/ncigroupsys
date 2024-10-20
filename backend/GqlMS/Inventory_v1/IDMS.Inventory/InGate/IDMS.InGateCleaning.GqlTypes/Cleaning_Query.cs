using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Inventory;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace IDMS.InGateCleaning.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class Cleaning_Query
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<in_gate_cleaning> QueryInGateCleaning(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
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
