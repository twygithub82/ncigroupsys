using HotChocolate.Types;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using Microsoft.Extensions.Logging;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class CleaningQuery
    {
        private readonly ILogger<CleaningQuery> _logger;

        public CleaningQuery(ILogger<CleaningQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<cleaning> QueryCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<cleaning> query = null;
            try
            {
                _logger.LogInformation("QueryCleaning called");
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryCleaning failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

            return query;
        }
    }
}
