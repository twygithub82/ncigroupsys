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
using static IDMS.Booking.Model.StatusConstant;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(BookingMutation))]
    public class ReleaseOrderMutation
    {
        public async Task<int> AddReleaseOrder(ReleaseOrderRequest releaseOrder, List<SchedulingRequest> schedulings, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        {
            try
            {
                //var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newRO = new release_order();
                newRO.guid = Util.GenerateGUID();
                newRO.create_by = user;
                newRO.create_dt = currentDateTime;

                newRO.ro_no = releaseOrder.ro_no;
                newRO.ro_notes = releaseOrder.ro_notes;
                newRO.haulier = releaseOrder.haulier;
                newRO.remarks = releaseOrder.remarks;
                newRO.status_cv = ROStatus.PENDING;
                newRO.customer_company_guid = releaseOrder.customer_company_guid;
                newRO.ro_generated = false;
                newRO.booking_dt = releaseOrder.booking_dt;
                newRO.release_dt = releaseOrder.release_dt;

                IList<scheduling> schedulingsList = new List<scheduling>();
                string[] sotGuids = schedulings.Select(s => s.sot_guid).ToArray();
                List<storing_order_tank> sotLists = context.storing_order_tank.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();

                foreach (var sch in schedulings)
                {
                    var newScheduling = new scheduling();
                    newScheduling.guid = Util.GenerateGUID();
                    newScheduling.create_by = user;
                    newScheduling.create_dt = currentDateTime;

                    newScheduling.sot_guid = sch.sot_guid;
                    newScheduling.release_order_guid = newRO.guid;
                    newScheduling.status_cv = ROStatus.PENDING;
                    newScheduling.reference = sch.reference;
                    schedulingsList.Add(newScheduling);

                    storing_order_tank? sot = sotLists.Find(s => s.guid == sch.sot_guid);
                    sot.release_job_no = sch.storing_order_tank.release_job_no;
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                }
                context.release_order.Add(newRO);
                context.scheduling.AddRange(schedulingsList);

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

        public async Task<int> UpdateReleaseOrder(ReleaseOrderRequest releaseOrders, List<SchedulingRequest> schedulings, [Service] IHttpContextAccessor httpContextAccessor,
         [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        {
            try
            {
                //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
                var res = 0;
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                //if (releaseOrders != null)
                //{
                //    string[] roGuids = releaseOrders.Select(b => b.guid).ToArray();
                //    var existingROList = context.release_order.Where(s => roGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0));

                //    foreach (var ro in releaseOrders)
                //    {
                //        // Find the corresponding existing child entity or add a new one if necessary
                //        var releaseOrder = existingROList.Where(b => b.guid == ro.guid).FirstOrDefault();
                //        if (releaseOrder != null)
                //        {
                //            releaseOrder.update_by = user;
                //            releaseOrder.update_dt = currentDateTime;

                //            //bk.surveyor_guid = ro.surveyor_guid;
                //            releaseOrder.remarks = ro.remarks;
                //            releaseOrder.ro_notes = ro.ro_notes;
                //            releaseOrder.status_cv = ro.status_cv;
                //            releaseOrder.release_dt = ro.release_dt;
                //            //releaseOrder.action_dt = ro.action_dt;
                //        }
                //    }
                //    res = await context.SaveChangesAsync();
                //}

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> DeleteReleaseOrder(List<string> roGuids, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        {

            try
            {
                var res = 0;
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var releaseOrders = context.release_order.Where(b => roGuids.Contains(b.guid) && b.delete_dt == null);
                if (releaseOrders.Any())
                {
                    foreach (var ro in releaseOrders)
                    {
                        ro.update_dt = currentDateTime;
                        ro.update_by = user;
                        ro.delete_dt = currentDateTime;
                    }
                    //context.UpdateRange(releaseOrders);
                    res = await context.SaveChangesAsync();
                }

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
