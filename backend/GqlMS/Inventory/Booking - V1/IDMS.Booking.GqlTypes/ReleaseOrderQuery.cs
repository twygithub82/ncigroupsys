using HotChocolate;
using IDMS.Booking.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class ReleaseOrderQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<release_order> QueryReleaseOrder([Service] ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var roDetails = context.release_order.Where(d => d.delete_dt == null || d.delete_dt == 0);

                //var bookingDetail = context.booking.Where(b => b.delete_dt == null || b.delete_dt == 0)
                //    .Include(b => b.storing_order_tank);

                return roDetails;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
