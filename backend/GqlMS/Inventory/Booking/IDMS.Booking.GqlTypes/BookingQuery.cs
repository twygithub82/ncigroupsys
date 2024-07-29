using HotChocolate;
using IDMS.Booking.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class BookingQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<booking> QueryBooking([Service] ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var bookingDetail = context.booking.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.tariff_cleaning)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.storing_order)
                            .ThenInclude(c => c.customer_company);

                //var bookingDetail = context.booking.Where(b => b.delete_dt == null || b.delete_dt == 0)
                //    .Include(b => b.storing_order_tank);

                return bookingDetail;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
