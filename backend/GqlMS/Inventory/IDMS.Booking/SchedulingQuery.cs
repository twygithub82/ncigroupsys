using HotChocolate;
using HotChocolate.Types;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class SchedulingQuery
    {
        private readonly ILogger<SchedulingQuery> _logger;

        public SchedulingQuery(ILogger<SchedulingQuery> logger)
        {
            _logger = logger;
        }


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
                _logger.LogError(ex, "Error in QueryScheduling");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                _logger.LogError(ex, "Error in QuerySchedulingSOT");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
