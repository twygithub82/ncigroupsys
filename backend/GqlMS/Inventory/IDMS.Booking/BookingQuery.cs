using HotChocolate;
using HotChocolate.Types;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryQuery))]
    public class BookingQuery
    {
        private readonly ILogger<BookingQuery> _logger;

        public BookingQuery(ILogger<BookingQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<booking> QueryBooking(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var bookingDetail = context.booking.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.tariff_cleaning)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(b => b.in_gate)
                    .Include(b => b.storing_order_tank)
                        .ThenInclude(s => s.storing_order)
                            .ThenInclude(c => c.customer_company);

                return bookingDetail;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error querying bookings");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
