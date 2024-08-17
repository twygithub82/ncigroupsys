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
using Microsoft.Extensions.Configuration;
using static IDMS.Booking.Model.StatusConstant;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(BookingMutation))]
    public class ReleaseOrderMutation
    {
        public async Task<int> AddReleaseOrder(ReleaseOrderRequest releaseOrder, List<SchedulingRequest> schedulings, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
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
                //newRO.booking_dt = releaseOrder.booking_dt;
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

                    //newScheduling.sot_guid = sch.sot_guid;
                    //newScheduling.release_order_guid = newRO.guid;
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

        public async Task<int> UpdateReleaseOrder(ReleaseOrderRequest releaseOrder, List<SchedulingRequest> schedulings, [Service] IHttpContextAccessor httpContextAccessor,
         ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                bool isSendNotification = false;
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var res = 0;
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<scheduling> newSchedulingsList = new List<scheduling>();
                string[] sotGuids = schedulings.Select(s => s.sot_guid).ToArray();
                string[] schGuids = schedulings.Select(s => s.guid).ToArray();
                List<storing_order_tank> sotLists = context.storing_order_tank.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();
                List<scheduling> existingSchList = context.scheduling.Where(s => schGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();

                foreach (var sch in schedulings)
                {
                    if (string.IsNullOrEmpty(sch?.action))
                        continue;

                    storing_order_tank? sot = sotLists.Find(s => s.guid == sch.sot_guid);
                    if (TankAction.NEW.EqualsIgnore(sch?.action))
                    {
                        //For Insert
                        var newScheduling = new scheduling();
                        newScheduling.guid = Util.GenerateGUID();
                        newScheduling.create_by = user;
                        newScheduling.create_dt = currentDateTime;

                        //newScheduling.sot_guid = sch.sot_guid;
                        //newScheduling.release_order_guid = releaseOrder.guid;
                        newScheduling.status_cv = ROStatus.PENDING;
                        newScheduling.reference = sch.reference;
                        newSchedulingsList.Add(newScheduling);

                        //storing_order_tank? sot = sotLists.Find(s => s.guid == sch.sot_guid);
                        sot.release_job_no = sch?.storing_order_tank?.release_job_no;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        isSendNotification = true;
                        continue;
                    }

                    if (TankAction.EDIT.EqualsIgnore(sch?.action))
                    {   //For Update
                        var extSch = existingSchList.Find(s => s.guid == sch.guid);
                        extSch.reference = sch.reference;
                        extSch.update_by = user;
                        extSch.update_dt = currentDateTime;

                        sot.release_job_no = sch.storing_order_tank.release_job_no;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        continue;
                    }

                    if (TankAction.CANCEL.EqualsIgnore(sch?.action))
                    {
                        var extSch = existingSchList.Find(s => s.guid == sch.guid);
                        extSch.status_cv = ROStatus.CANCELED;
                        extSch.update_by = user;
                        extSch.update_dt = currentDateTime;
                        //extSch.delete_dt = currentDateTime;

                        //No need to change any info for SOT
                        //sot.release_job_no = "";
                        //sot.update_by = user;
                        //sot.update_dt = currentDateTime;
                        isSendNotification = true;
                        continue;
                    }
                }

                //Update Release Order details here
                var existingRO = context.release_order.Find(releaseOrder.guid);
                if (existingRO != null) 
                {
                    existingRO.update_by = user;
                    existingRO.update_dt = currentDateTime; 

                    existingRO.ro_notes = releaseOrder.ro_notes;
                    existingRO.haulier = releaseOrder.haulier;
                    existingRO.remarks = releaseOrder.remarks;
                    //existingRO.status_cv = ROStatus.PENDING;
                    //existingRO.customer_company_guid = releaseOrder.customer_company_guid;
                    //existingRO.ro_generated = false;
                    //existingRO.booking_dt = releaseOrder.booking_dt;
                    existingRO.release_dt = releaseOrder.release_dt;
                }
                else
                    throw new GraphQLException(new Error("Release Order not found.", "NOT_FOUND"));

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> DeleteReleaseOrder(List<string> roGuids, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender)
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
