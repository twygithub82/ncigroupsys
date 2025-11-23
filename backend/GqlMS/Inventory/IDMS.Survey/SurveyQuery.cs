using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using System.Net;
using Newtonsoft.Json.Linq;
using System;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics.Metrics;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes;
using Microsoft.Extensions.Logging;

namespace IDMS.Survey.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class SurveyQuery
    {
        private readonly ILogger<SurveyQuery> _logger;

        public SurveyQuery(ILogger<SurveyQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<in_gate_survey> QueryInGateSurvey(ApplicationInventoryDBContext context, 
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<in_gate_survey> query = null;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.in_gate_survey.Where(i => i.delete_dt == null || i.delete_dt == 0)
                                                .Include(i => i.in_gate);

                _logger.LogInformation("QueryInGateSurvey returning queryable for user {User}", user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryInGateSurvey");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

            return query;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<out_gate_survey> QueryOutGateSurvey(ApplicationInventoryDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<out_gate_survey> query = null;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.out_gate_survey.Where(i => i.delete_dt == null || i.delete_dt == 0)
                                                .Include(i => i.out_gate);

                _logger.LogInformation("QueryOutGateSurvey returning queryable for user {User}", user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in QueryOutGateSurvey");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

            return query;
        }
    }
}