using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.Booking.GqlTypes.Repo;
using IDMS.Models.Inventory;
using HotChocolate.Execution.Processing;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using IDMS.Booking.Model.Request;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;

namespace IDMS.Booking.GqlTypes
{
    public class BookingMutation
    {
        public async Task<int> AddBooking(List<booking> bookings,
            [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        {
            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (booking bk in bookings)
                {
                    bk.guid = Util.GenerateGUID();
                    bk.create_by = user;
                    bk.create_dt = currentDateTime;
                    bk.status_cv = "NEW";

                    var newBooking = new BookingWithTanks();
                    mapper.Map(bk, newBooking);
                    context.booking.Add(newBooking);
                }
                var res = await context.SaveChangesAsync();

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateBooking(List<BookingRequest> bookings,
         [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        {
            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (BookingRequest bk in bookings)
                {
                    // Find the corresponding existing child entity or add a new one if necessary
                    var existingBooking = context.booking.Where(b => b.guid == bk.guid & (b.delete_dt == null || b.delete_dt == 0)).FirstOrDefault();
                    if (existingBooking != null)
                    {
                        mapper.Map(bk, existingBooking);
                        existingBooking.update_by = user;
                        existingBooking.update_dt = currentDateTime;
                        //existingBooking.status_cv = "NEW";
                        //context.booking.Update(bk);
                    }
                }
                var res = await context.SaveChangesAsync();

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> DeleteBooking(string[] bookingGuids,
            [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        {

            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var bookings = context.storing_order.Where(b => bookingGuids.Contains(b.guid) && b.delete_dt == null);

                foreach (var bk in bookings)
                {
                    //so.status_cv = CANCEL;
                    bk.delete_dt = currentDateTime;
                    bk.update_dt = currentDateTime;
                    bk.update_by = user;
                }

                var res = await context.SaveChangesAsync();
                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

    }
}
