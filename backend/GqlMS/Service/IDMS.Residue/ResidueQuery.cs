using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class ResidueQuery
    {

        private readonly ILogger<ResidueQuery> _logger;

        public ResidueQuery(ILogger<ResidueQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<residue> QueryResidue(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var residue = context.residue.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(r => r.residue_part)
                    .Include(r => r.storing_order_tank)
                        .ThenInclude(t => t.storing_order)
                            .ThenInclude(s => s.customer_company);

                _logger.LogInformation("QueryResidue called.");
                return residue;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryResidue failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
