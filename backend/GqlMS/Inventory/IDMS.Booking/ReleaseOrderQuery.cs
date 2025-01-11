using HotChocolate;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using Microsoft.Extensions.Configuration;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class ReleaseOrderQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<release_order> QueryReleaseOrder(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
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


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<release_order_sot> QueryReleaseOrderSOT(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var roDetails = context.release_order_sot.Where(d => d.delete_dt == null || d.delete_dt == 0);

                return roDetails;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
