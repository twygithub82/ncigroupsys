using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

using Microsoft.AspNetCore.Identity;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes;
using Microsoft.Extensions.Logging;

namespace IDMS.Gate.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class InGateQuery
    {
        private readonly ILogger<InGateQuery> _logger;

        public InGateQuery(ILogger<InGateQuery> logger)
        {
            _logger = logger;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering(typeof(IDMS.Models.Filters.in_gate_filtertype))]
        [UseSorting]
        public IQueryable<in_gate> QueryInGates(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<in_gate> query = null;

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0)
                    .Include(s => s.tank.tariff_cleaning)
                    .Include(s => s.tank.storing_order)
                    .Include(s => s.tank.storing_order.customer_company)
                    .Include(s => s.tank.tariff_cleaning.cleaning_method)
                    .Include(s => s.tank.tariff_cleaning.cleaning_category)
                    .Include(s => s.in_gate_survey);

                int processed = 0;
                foreach (var q in query)
                {
                    if (q.tank != null)
                        if (q.tank.storing_order != null)
                            q.haulier = q.tank.storing_order.haulier;

                    processed++;
                }

                _logger.LogInformation("QueryInGates and processed {Count} records", processed);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryInGates");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

            return query;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<in_gate> QueryInGatesCount(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<in_gate> query = null;

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                _logger.LogInformation("User {User} requested in-gates count", user);

                query = context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryInGatesCount");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
            return query;
        }
    }
}