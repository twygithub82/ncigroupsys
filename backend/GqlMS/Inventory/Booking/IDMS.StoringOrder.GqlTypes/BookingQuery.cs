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
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        //[UseSorting(typeof(SOSorter))]
        public IQueryable<booking> QueryBooking(AppDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var bookings = context.booking.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.tariff_cleaning)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.storing_order)
                            .ThenInclude(c => c.customer_company);
                            
                return bookings;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
