using HotChocolate.Types;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using IDMS.Service.GqlTypes;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.EntityFrameworkCore;


namespace IDMS.Steaming.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class SteamingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<steaming> QuerySteaming(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var steaming = context.steaming.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(d => d.steaming_part)
                    .Include(d => d.storing_order_tank)
                        .ThenInclude(t => t.storing_order)
                            .ThenInclude(s => s.customer_company);

                return steaming;
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
        public IQueryable<steaming_temp> QuerySteamingTemp(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var steamingTemp = context.steaming_temp.Where(d => d.delete_dt == null || d.delete_dt == 0);
                return steamingTemp;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
