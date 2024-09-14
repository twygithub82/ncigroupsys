using HotChocolate;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models;
using IDMS.Inventory.GqlTypes;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class ReleaseOrderQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<release_order> QueryReleaseOrder(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var roDetails = context.release_order.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    //.Include(d => d.scheduling.Where(s => s.delete_dt == null || s.delete_dt == 0))
                    .Include(d => d.customer_company);

                return roDetails;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
