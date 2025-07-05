using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Booking.GqlTypes.LocaModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
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
                newScheduling.update_by = user;
                newScheduling.update_dt = currentDateTime;

                //newScheduling.reference = scheduling.reference;
                newScheduling.status_cv = BookingStatus.NEW;
                newScheduling.book_type_cv = scheduling.book_type_cv;
                //newScheduling.scheduling_dt = scheduling.scheduling_dt;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                foreach (var sch_sot in scheduling_SotList)
                {
                    var newSchedulingSOT = new scheduling_sot();
                    newSchedulingSOT.guid = Util.GenerateGUID();
                    newSchedulingSOT.create_by = user;
                    newSchedulingSOT.create_dt = currentDateTime;
                    newSchedulingSOT.update_by = user;
                    newSchedulingSOT.update_dt = currentDateTime;

                    newSchedulingSOT.sot_guid = sch_sot.sot_guid;
                    newSchedulingSOT.scheduling_guid = newScheduling.guid;
                    newSchedulingSOT.status_cv = BookingStatus.NEW;
                    newSchedulingSOT.reference = sch_sot.reference;
                    newSchedulingSOT.scheduling_dt = sch_sot.scheduling_dt;

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

                //var exScheduling = await context.scheduling.Where(s => s.guid == scheduling.guid && (s.delete_dt == null || s.delete_dt == 0)).FirstOrDefaultAsync();
                //if (exScheduling == null)
                //    throw new GraphQLException(new Error($"Scheduling not found, update failed.", "ERROR"));


                var exScheduling = new scheduling() { guid =  scheduling.guid };   
                context.Attach(exScheduling);
                exScheduling.update_by = user;
                exScheduling.update_dt = currentDateTime;

                //exScheduling.reference = scheduling.reference;
                //exScheduling.scheduling_dt = scheduling.scheduling_dt;
                //if (BookingStatus.CANCELED.EqualsIgnore(scheduling.action))
                //    exScheduling.status_cv = BookingStatus.CANCELED;
                //else
                //    exScheduling.status_cv = scheduling.status_cv;
                exScheduling.book_type_cv = scheduling.book_type_cv;
                exScheduling.remarks = scheduling.remarks;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                foreach (var schSOT in scheduling_SotList)
                {
                    var exSch = new scheduling_sot() { guid = schSOT.guid };
                    context.Attach(exSch);
                    //context.Entry(exSch).Property(e=>e.status_cv).IsModified = true;

                    //if (BookingStatus.CANCELED.EqualsIgnore(sch.action))
                    //    exSch.status_cv = BookingStatus.CANCELED;
                    //else
                    //    exSch.status_cv = sch.status_cv;

                    exSch.update_by = user;
                    exSch.update_dt = currentDateTime;
                    exSch.remarks = schSOT.remarks;
                    exSch.reference = schSOT.reference;
                    exSch.scheduling_dt = schSOT.scheduling_dt;
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


        public async Task<int> DeleteScheduling(List<string> schedulingGuids, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var id in schedulingGuids)
                {
                    var scheduling = new scheduling() { guid = id };
                    context.Attach(scheduling);

                    scheduling.update_dt = currentDateTime;
                    scheduling.update_by = user;
                    scheduling.delete_dt = currentDateTime;
                }

                var schSots = context.scheduling_sot.Where(b => schedulingGuids.Contains(b.scheduling_guid));
                foreach (var sch in schSots)
                {
                    sch.update_dt = currentDateTime;
                    sch.update_by = user;
                    sch.delete_dt = currentDateTime;
                }

                res = await context.SaveChangesAsync();
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

        public async Task<int> DeleteSchedulingSOT(List<string> schedulingSOTGuids, [Service] IHttpContextAccessor httpContextAccessor,
          ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var id in schedulingSOTGuids)
                {
                    var schedulingSOT = new scheduling_sot() { guid = id };
                    context.Attach(schedulingSOT);

                    schedulingSOT.update_dt = currentDateTime;
                    schedulingSOT.update_by = user;
                    schedulingSOT.delete_dt = currentDateTime;
                }

                res = await context.SaveChangesAsync();
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
