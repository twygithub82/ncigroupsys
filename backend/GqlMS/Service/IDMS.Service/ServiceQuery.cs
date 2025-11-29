using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Models;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Service.GqlTypes.LocalModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Service.GqlTypes
{
    public class ServiceQuery
    {
        private readonly ILogger<ServiceQuery> _logger;

        public ServiceQuery(ILogger<ServiceQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<job_order> QueryJobOrder(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var jobOrders = context.job_order
                                .Include(j => j.storing_order_tank)
                                .Include(j => j.team)
                                .Include(j => j.repair_part).ThenInclude(p => p.repair)
                                .Where(d => d.delete_dt == null || d.delete_dt == 0);

                _logger.LogInformation("QueryJobOrder called.");
                return jobOrders;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryJobOrder failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<team> QueryTeams(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var teamDetails = context.team.Where(d => d.delete_dt == null || d.delete_dt == 0);
                _logger.LogInformation("QueryTeams called.");
                return teamDetails;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryTeams failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<TeamResult?> QueryTeamsWithCount(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.team
                                      .Where(t => t.delete_dt == null || t.delete_dt == 0)
                                      .Select(t => new TeamResult
                                      {
                                          team = t,
                                          assign_count = t.team_user.Where(ts => ts.delete_dt == null).Count() + 
                                                         t.job_order.Where(j => j.delete_dt == null).Count(),
                                      })
                                      .AsQueryable();
                _logger.LogInformation("QueryTeamsWithCount called.");
                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryTeamsWithCount failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<aspnetusers> QueryUsers(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var user = context.aspnetusers.AsSplitQuery(); //.Include(a => a.aspnetuserroles);
                _logger.LogInformation("QueryUsers called.");
                return user;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryUsers failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<role> QueryRoles(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var roles = context.role.Where(d => d.delete_dt == null || d.delete_dt == 0);
                _logger.LogInformation("QueryRoles called.");
                return roles;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryRoles failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<functions> QueryFunctions(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var functions = context.Set<functions>().Where(d => d.delete_dt == null || d.delete_dt == 0);
                _logger.LogInformation("QueryFunctions called.");
                return functions;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryFunctions failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
