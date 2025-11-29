using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


namespace IDMS.Steaming.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class SteamingQuery
    {
        private readonly ILogger<SteamingQuery> _logger;

        public SteamingQuery(ILogger<SteamingQuery> logger)
        {
            _logger = logger;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<steaming> QuerySteaming(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var steaming = context.steaming.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(d => d.steaming_part)
                    .Include(d => d.storing_order_tank)
                        .ThenInclude(t => t.storing_order)
                            .ThenInclude(s => s.customer_company);

                _logger.LogInformation("QuerySteaming called.");
                return steaming;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QuerySteaming failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<steaming_temp> QuerySteamingTemp(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var steamingTemp = context.steaming_temp.Where(d => d.delete_dt == null || d.delete_dt == 0);
                _logger.LogInformation("QuerySteamingTemp called.");
                return steamingTemp;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QuerySteamingTemp failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
