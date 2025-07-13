using HotChocolate;
using HotChocolate.Types;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.StoringOrder.GqlTypes.CustomSorter;
//using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IDMS.StoringOrder.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class SOQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting(typeof(SOSorter))]
        public IQueryable<storing_order> QueryStoringOrder([Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] IConfiguration config)
        {
            try
            {
                Console.WriteLine($"{DateTime.Now.ToString("yyyy-MMM-dd HH:mm:ss.ffff")} - QueryStoringOrder");
                GqlUtils.IsAuthorize(config, httpContextAccessor);
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
        public IQueryable<storing_order> QueryStoringOrderById(string id, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] IConfiguration config)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
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

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10, MaxPageSize = int.MaxValue - 1)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<storing_order_tank> QueryStoringOrderTank([Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] IConfiguration config)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(so => so.storing_order)
                    .Include(tf => tf.tariff_cleaning)
                    .Include(d => d.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0))
                    .Include(bk => bk.booking.Where(b => b.booking_dt == null || b.delete_dt == 0));
                    
                //return context.storing_order_tank
                //    .Where(d => (d.delete_dt == null || d.delete_dt == 0) &&
                //                (d.tariff_cleaning.delete_dt == null || d.tariff_cleaning.delete_dt == 0))
                //    .Include(so => so.storing_order)
                //    .Include(tf => tf.tariff_cleaning)
                //    .Include(bk => bk.booking);
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
        public IQueryable<storing_order_tank> QueryStoringOrderTankCount([Service] IHttpContextAccessor httpContextAccessor,
         ApplicationInventoryDBContext context, [Service] IConfiguration config)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0);

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
