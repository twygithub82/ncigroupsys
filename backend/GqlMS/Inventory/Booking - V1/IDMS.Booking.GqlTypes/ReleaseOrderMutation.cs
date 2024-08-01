using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.Booking.Model.Request;
using IDMS.Models;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;

namespace IDMS.Booking.GqlTypes
{
    public class ReleaseOrderMutation
    {
        public async Task<int> AddReleaseOrder(ReleaseOrderRequest releaseOrder, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        {
            try
            {
                //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                //foreach (var guid in booking.sot_guid)
                //{
                    var newRO = new release_order();
                    newRO.guid = Util.GenerateGUID();
                    newRO.create_by = user;
                    newRO.create_dt = currentDateTime;

                    //newRO.sot_guid = guid;
                    newRO.ro_no = releaseOrder.ro_no;
                    newRO.ro_notes = releaseOrder.ro_notes;
                    newRO.status_cv = releaseOrder.status_cv;
                    //newRO.status_cv = StatusConstant.BookingStatus.NEW;
                    newRO.remarks = releaseOrder.remarks;
                    newRO.release_dt = releaseOrder.release_dt;

                    context.release_order.Add(newRO);
                //}
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

        public async Task<int> UpdateReleaseOrder(List<ReleaseOrderRequest> roList, [Service] IHttpContextAccessor httpContextAccessor,
         [Service] ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
        {
            try
            {
                //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
                var res = 0;
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (roList.Any())
                {
                    string[] roGuids = roList.Select(b => b.guid).ToArray();
                    var existingROList = context.release_order.Where(s => roGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0));

                    foreach (var ro in roList)
                    {
                        // Find the corresponding existing child entity or add a new one if necessary
                        var releaseOrder = existingROList.Where(b => b.guid == ro.guid).FirstOrDefault();
                        if (releaseOrder != null)
                        {
                            releaseOrder.update_by = user;
                            releaseOrder.update_dt = currentDateTime;

                            //bk.surveyor_guid = ro.surveyor_guid;
                            releaseOrder.remarks = ro.remarks;
                            releaseOrder.ro_notes = ro.ro_notes;
                            releaseOrder.status_cv = ro.status_cv;
                            releaseOrder.release_dt = ro.release_dt;
                            //releaseOrder.action_dt = ro.action_dt;
                        }
                    }
                    res = await context.SaveChangesAsync();
                }
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
