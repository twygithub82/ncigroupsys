using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.Models.Inventory;
using HotChocolate.Execution.Processing;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using HotChocolate.Types;
using Microsoft.Extensions.Configuration;
using IDMS.Inventory.GqlTypes;
using IDMS.Booking.GqlTypes.LocaModel;
using Microsoft.Extensions.Logging;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class BookingMutation
    {
        private readonly ILogger<BookingMutation> _logger;

        public BookingMutation(ILogger<BookingMutation> logger)
        {
            _logger = logger;
        }

        public async Task<int> AddBooking(BookingRequest booking, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<booking> bookings = new List<booking>();
                foreach (var guid in booking.sot_guid)
                {
                    var newBooking = new booking();
                    newBooking.guid = Util.GenerateGUID();
                    newBooking.create_by = user;
                    newBooking.create_dt = currentDateTime;
                    newBooking.update_by = user;
                    newBooking.update_dt = currentDateTime;

                    newBooking.sot_guid = guid;
                    newBooking.test_class_cv = booking.test_class_cv;
                    newBooking.reference = booking.reference;
                    newBooking.book_type_cv = booking.book_type_cv;
                    newBooking.status_cv = BookingStatus.NEW;
                    newBooking.booking_dt = booking.booking_dt;
                    //newBooking.action_dt = booking.action_dt;

                    bookings.Add(newBooking);

                    _logger.LogDebug("Prepared booking guid={BookingGuid} for sot_guid={SotGuid}", newBooking.guid, guid);
                }
                context.booking.AddRange(bookings);
                var res = await context.SaveChangesAsync();

                _logger.LogInformation("AddBooking completed by {User}, inserted={Count}", user, res);
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddBooking");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateBooking(List<BookingRequest> bookingList, [Service] IHttpContextAccessor httpContextAccessor,
         ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)//[Service] IMapper mapper)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var res = 0;
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (bookingList.Any())
                {
                    string[] bkGuids = bookingList.Select(b => b.guid).ToArray();
                    var existingBookingList = context.booking.Where(s => bkGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0));

                    foreach (var booking in bookingList)
                    {
                        // Find the corresponding existing child entity or add a new one if necessary
                        var bk = existingBookingList.Where(b => b.guid == booking.guid).FirstOrDefault();
                        if (bk != null)
                        {
                            bk.update_by = user;
                            bk.update_dt = currentDateTime;

                            bk.test_class_cv = booking.test_class_cv;
                            bk.reference = booking.reference;
                            bk.book_type_cv = booking.book_type_cv;
                            bk.status_cv = booking.status_cv;
                            bk.booking_dt = booking.booking_dt;
                            bk.remarks = booking.remarks;

                            _logger.LogDebug("Prepared update for booking guid={BookingGuid}", bk.guid);
                        }
                        else
                        {
                            _logger.LogWarning("UpdateBooking: booking not found guid={BookingGuid}", booking?.guid);
                        }
                    }
                    res = await context.SaveChangesAsync();
                    _logger.LogInformation("UpdateBooking saved affected={Affected}", res);
                }
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateBooking");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> CancelBooking(List<BookingRequest> bookingList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config) //[Service] IMapper mapper)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var booking in bookingList)
                {
                    var bk = new booking() { guid = booking.guid };
                    context.Attach(bk);

                    bk.update_dt = currentDateTime;
                    bk.update_by = user;
                    bk.status_cv = BookingStatus.CANCELED;
                    bk.remarks = booking.remarks;

                    _logger.LogDebug("Marked booking guid={BookingGuid} as CANCELED", booking.guid);
                }
                //context.UpdateRange(bookings);
                res = await context.SaveChangesAsync();

                _logger.LogInformation("CancelBooking saved affected={Affected}", res);
                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in CancelBooking");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> DeleteBooking(List<string> bkGuids, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config) //[Service] IMapper mapper)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var bookings = context.booking.Where(b => bkGuids.Contains(b.guid) && b.delete_dt == null);
                if (bookings.Any())
                {
                    foreach (var bk in bookings)
                    {
                        bk.update_dt = currentDateTime;
                        bk.update_by = user;
                        bk.delete_dt = currentDateTime;

                        _logger.LogDebug("Marked booking guid={BookingGuid} deleted", bk.guid);
                    }
                    context.UpdateRange(bookings);
                    res = await context.SaveChangesAsync();
                    _logger.LogInformation("DeleteBooking saved affected={Affected}", res);
                }
                else
                {
                    _logger.LogWarning("DeleteBooking found no bookings for provided guids");
                }

                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteBooking");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

    }
}
