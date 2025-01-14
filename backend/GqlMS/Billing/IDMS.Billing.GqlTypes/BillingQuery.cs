using HotChocolate.Types;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using IDMS.Models.DB;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Billing;
using IDMS.Billing.Application;

namespace IDMS.Billing.GqlTypes
{
    public class BillingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<billing> QueryBilling([Service] IHttpContextAccessor httpContextAccessor,
                [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<billing_sot> QueryBillingSOT([Service] IHttpContextAccessor httpContextAccessor,
               [Service] IConfiguration config, ApplicationBillingDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.billing_sot.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

    }
}
