using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Booking.Model.Request;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static IDMS.Booking.Model.StatusConstant;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(BookingMutation))]
    public class SchedulingMutation
    {
        public async Task<int> AddScheduling(SchedulingRequest scheduling, List<SchedulingSOTRequest> scheduling_SotList, [Service] IHttpContextAccessor httpContextAccessor,
          ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newScheduling = new scheduling();
                newScheduling.guid = Util.GenerateGUID();
                newScheduling.create_by = user;
                newScheduling.create_dt = currentDateTime;

                newScheduling.reference = scheduling.reference; 
                newScheduling.status_cv = BookingStatus.NEW;
                newScheduling.book_type_cv = scheduling.book_type_cv;
                newScheduling.scheduling_dt = scheduling.scheduling_dt;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                //string[] sotGuids = schedulings.Select(s => s.sot_guid).ToArray();
                //List<storing_order_tank> sotLists = context.storing_order_tank.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();

                foreach (var sch_sot in scheduling_SotList)
                {
                    var newSchedulingSOT = new scheduling_sot();
                    newSchedulingSOT.guid = Util.GenerateGUID();
                    newSchedulingSOT.create_by = user;
                    newSchedulingSOT.create_dt = currentDateTime;

                    newSchedulingSOT.sot_guid = sch_sot.sot_guid;
                    newSchedulingSOT.scheduling_guid = newScheduling.guid;
                    newSchedulingSOT.status_cv = BookingStatus.NEW;

                    schedulingsSOTList.Add(newSchedulingSOT);

                    //storing_order_tank? sot = sotLists.Find(s => s.guid == sch.sot_guid);
                    //sot.release_job_no = sch.storing_order_tank.release_job_no;
                    //sot.update_by = user;
                    //sot.update_dt = currentDateTime;
                }
                context.scheduling.Add(newScheduling);
                context.scheduling_sot.AddRange(schedulingsSOTList);

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

        public async Task<int> UpdateScheduling(SchedulingRequest scheduling, List<SchedulingSOTRequest> scheduling_SotList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var exScheduling =  await context.scheduling.Where(s => s.guid == scheduling.guid && (s.delete_dt == null || s.delete_dt == 0)).FirstOrDefaultAsync();
                if(exScheduling == null)
                    throw new GraphQLException(new Error($"Scheduling not found, update failed.", "ERROR"));

                exScheduling.update_by = user;
                exScheduling.update_dt = currentDateTime;

                exScheduling.reference = scheduling.reference;
                if (BookingStatus.CANCELED.EqualsIgnore(scheduling.action))
                    exScheduling.status_cv = BookingStatus.CANCELED;
                else
                    exScheduling.status_cv = scheduling.status_cv;
                exScheduling.book_type_cv = scheduling.book_type_cv;
                exScheduling.scheduling_dt = scheduling.scheduling_dt;
                exScheduling.remarks = scheduling.remarks;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                foreach (var sch in scheduling_SotList)
                {
                    var exSch = new scheduling_sot() { guid = sch.guid };
                    context.Attach(exSch);
                    //context.Entry(exSch).Property(e=>e.status_cv).IsModified = true;
                    
                    if(BookingStatus.CANCELED.EqualsIgnore(sch.action))
                        exSch.status_cv = BookingStatus.CANCELED;
                    else
                        exSch.status_cv = sch.status_cv;
                    exSch.update_by = user;
                    exSch.update_dt = currentDateTime;
                    exSch.remarks = sch.remarks;
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


        //public async Task<int> DeleteReleaseOrder(List<string> roGuids, [Service] IHttpContextAccessor httpContextAccessor,
        //    ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        //{

        //    try
        //    {
        //        var res = 0;
        //        string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        var releaseOrders = context.release_order.Where(b => roGuids.Contains(b.guid) && b.delete_dt == null);
        //        if (releaseOrders.Any())
        //        {
        //            foreach (var ro in releaseOrders)
        //            {
        //                ro.update_dt = currentDateTime;
        //                ro.update_by = user;
        //                ro.delete_dt = currentDateTime;
        //            }
        //            //context.UpdateRange(releaseOrders);
        //            res = await context.SaveChangesAsync();
        //        }

        //        //TODO
        //        //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
        //        //await topicEventSender.SendAsync(updateCourseTopic, course);
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}

    }
}
