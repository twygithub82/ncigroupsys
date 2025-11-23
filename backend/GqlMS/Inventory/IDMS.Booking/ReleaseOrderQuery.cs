using HotChocolate;
using HotChocolate.Types;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class ReleaseOrderQuery
    {
        private readonly ILogger<ReleaseOrderQuery> _logger;

        public ReleaseOrderQuery(ILogger<ReleaseOrderQuery> logger)
        {
            _logger = logger;
        }

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
                _logger.LogError(ex, "Error querying release orders");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                _logger.LogError(ex, "Error querying release order SOTs");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
