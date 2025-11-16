using HotChocolate.Data;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;


namespace IDMS.Models.Parameter.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstQuery))]
    public class CleaningMethodQuery
    {
        private readonly ILogger<CleaningMethodQuery> _logger;
        const string graphqlErrorCode = "ERROR";

        public CleaningMethodQuery(ILogger<CleaningMethodQuery> logger)
        {
            _logger = logger;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public  IQueryable<cleaning_method?> QueryCleaningMethod(ApplicationMasterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_method> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_method.Where(i => i.delete_dt == null);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryCleaningMethod: {Message}", ex.Message);
                throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage(ex.Message)
                            .SetCode(graphqlErrorCode)
                            .Build());
            }

            return query;
        }


        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<cleaning_category?> QueryCleaningCategory(ApplicationMasterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_category> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_category.Where(i => i.delete_dt == null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryCleaningCategory: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }

            return query;

        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<cleaning_formula?> QueryCleaningFormula(ApplicationMasterDBContext context,
          [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_formula> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_formula.Where(i => i.delete_dt == null);
            }
            catch(Exception ex)
            {
                _logger.LogError(ex, "Error in QueryCleaningFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<cleaning_method_formula?> QueryCleaningMethodFormula(ApplicationMasterDBContext context,
          [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_method_formula> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_method_formula.Where(i => i.delete_dt == null);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryCleaningMethodFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }

            return query;
        }

    }
}
