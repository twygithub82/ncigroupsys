using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Inventory;
using IDMS.StoringOrder.GqlTypes.Repo;
using IDMS.StoringOrder.Model.CustomSorter;
//using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace IDMS.StoringOrder.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class SOQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting(typeof(SOSorter))]
        public IQueryable<storing_order> QueryStoringOrder(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order.Where(d => d.delete_dt == null || d.delete_dt == 0)
                     .Include(so => so.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0))
                     .Include(so => so.customer_company);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        [UseProjection]
        public IQueryable<storing_order> QueryStoringOrderById(string id, AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order.Where(c => c.guid.Equals(id))
                    .Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(so => so.storing_order_tank)//.ThenInclude(sot=> sot.tariff_cleaning)
                    .Include(so => so.customer_company);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering(typeof(SOTFilter))]
        [UseSorting]
        public IQueryable<storing_order_tank> QueryStoringOrderTank(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(so => so.storing_order)
                    .Include(tf => tf.tariff_cleaning);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
