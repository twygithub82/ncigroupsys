using HotChocolate.Types;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Shared;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Service;
using Microsoft.Extensions.Configuration;

namespace IDMS.Service.GqlTypes
{
    public class ServiceQuery
    {
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
                                .Include(j=>j.repair_part).ThenInclude(p=>p.repair)
                                .Where(d => d.delete_dt == null || d.delete_dt == 0);

                return jobOrders;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
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
                return teamDetails;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
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
                var user = context.aspnetusers.Include(a => a.aspnetuserroles);
                return user;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
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
                return roles;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
