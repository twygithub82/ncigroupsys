using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace IDMS.Gate.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class OutGateQuery
    {
        private readonly ILogger<OutGateQuery> _logger;

        public OutGateQuery(ILogger<OutGateQuery> logger)
        {
            _logger = logger;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<out_gate> QueryOutGates(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<out_gate> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.out_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                                        .Where(i => i.tank != null && (i.tank.delete_dt == null || i.tank.delete_dt == 0))
                .Include(s => s.tank)
                .Include(s => s.tank.release_order_sot)
                    .ThenInclude(r => r.release_order).AsSplitQuery();

                int processed = 0;
                foreach (var q in query)
                {
                    if (q.tank != null)
                        if (q.tank.release_order_sot != null)
                        {
                            var ro = q.tank.release_order_sot.Where(s => s.sot_guid == q.tank.guid && (s.delete_dt == null || s.delete_dt == 0))
                                .FirstOrDefault()?.release_order;
                            if (ro != null)
                                q.haulier = ro.haulier;
                        }
                    processed++;
                }

                _logger.LogInformation("QueryInGates and processed {Count} records", processed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryOutGates");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

            return query;
        }
    }
}