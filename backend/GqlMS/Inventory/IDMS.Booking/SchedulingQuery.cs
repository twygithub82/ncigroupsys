using HotChocolate;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes;
using Microsoft.Extensions.Configuration;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class SchedulingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<scheduling> QueryScheduling(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var schedulingDetails = context.scheduling.Where(d => d.delete_dt == null || d.delete_dt == 0);
                    //.Include(b => b.storing_order_tank)
                    //.Include(b => b.release_order);

                return schedulingDetails;
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
        public IQueryable<scheduling_sot> QuerySchedulingSOT(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var schedulingSOTDetails = context.scheduling_sot.Where(d => d.delete_dt == null || d.delete_dt == 0);
                //.Include(b => b.storing_order_tank)
                //.Include(b => b.release_order);

                return schedulingSOTDetails;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
