using HotChocolate;
using IDMS.Booking.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory;

namespace IDMS.Booking.GqlTypes
{
    public class BookingQuery
    {

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        ////[UseSorting(typeof(SOSorter))]
        //public IQueryable<storing_order_tank> QueryStoringOrderTank(BookDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        //{
        //    try
        //    {
        //        return context.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0)
        //            .Include(so=> so.storing_order);
        //                                         //.Include(c => c.code_values);
        //        //.Include(so => so.storing_order_tank.Where(d => d.delete_dt == null))
        //        //.Include(so => so.customer_company);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        //[UseSorting(typeof(SOSorter))]
        public IQueryable<booking> QueryBooking(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.booking.Where(d => d.delete_dt == null || d.delete_dt == 0);
                //.Include(c => c.code_values);
                //.Include(so => so.storing_order_tank.Where(d => d.delete_dt == null))
                //.Include(so => so.customer_company);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
