using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Booking.GqlTypes.LocaModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Diagnostics.Metrics;
using System;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class ReleaseOrderMutation
    {
        public async Task<int> AddReleaseOrder(ReleaseOrderRequest releaseOrder, List<ReleaseOrderSOTRequest> ro_SotList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newRO = new release_order();
                newRO.guid = Util.GenerateGUID();
                newRO.create_by = user;
                newRO.create_dt = currentDateTime;
                newRO.update_by = user;
                newRO.update_dt = currentDateTime;

                newRO.ro_no = releaseOrder.ro_no;
                newRO.ro_notes = releaseOrder.ro_notes;
                newRO.haulier = releaseOrder.haulier;
                newRO.remarks = releaseOrder.remarks;
                newRO.status_cv = ROStatus.PENDING;
                newRO.customer_company_guid = releaseOrder.customer_company_guid;
                newRO.ro_generated = true;
                newRO.release_dt = releaseOrder.release_dt;

                IList<release_order_sot> newROSotList = new List<release_order_sot>();
                //string[] sotGuids = ro_sots.Select(s => s.sot_guid).ToArray();
                //List<storing_order_tank> sotLists = context.storing_order_tank.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();

                foreach (var roSOT in ro_SotList)
                {
                    if (roSOT.storing_order_tank == null)
                        throw new GraphQLException(new Error($"storing_order_tank is compulsory field", "ERROR"));

                    var newROSOT = new release_order_sot();
                    newROSOT.guid = Util.GenerateGUID();
                    newROSOT.create_by = user;
                    newROSOT.create_dt = currentDateTime;
                    newROSOT.update_by = user;
                    newROSOT.update_dt = currentDateTime;

                    newROSOT.sot_guid = roSOT.sot_guid;
                    newROSOT.ro_guid = newRO.guid;
                    newROSOT.status_cv = SOTankStatus.WAITING;
                    newROSotList.Add(newROSOT);

                    storing_order_tank sot = new() { guid = roSOT.storing_order_tank.guid }; //sotLists.Find(s => s.guid == sot.sot_guid);
                    context.Attach(sot);

                    sot.release_job_no = roSOT.storing_order_tank.release_job_no;
                    sot.tank_status_cv = TankMovementStatus.RO;
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                }
                context.release_order.Add(newRO);
                context.release_order_sot.AddRange(newROSotList);
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

        public async Task<int> UpdateReleaseOrder(ReleaseOrderRequest releaseOrder, List<ReleaseOrderSOTRequest> ro_SotList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                bool isSendNotification = false;
                bool isSOTChanges = false;
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var res = 0;
                long currentDateTime = DateTime.Now.ToEpochTime();

                if(string.IsNullOrEmpty(releaseOrder.guid))
                    throw new GraphQLException(new Error($"release_order_guid is compulsory field", "ERROR"));

                IList<release_order_sot> newRoSotList = new List<release_order_sot>();
                foreach (var roSOT in ro_SotList)
                {
                    if (string.IsNullOrEmpty(roSOT?.action))
                        continue;

                    storing_order_tank sot = new() { guid = roSOT.storing_order_tank.guid };
                    //Start add the entity into EF for tracking
                    context.storing_order_tank.Attach(sot);

                    if (SOTankAction.NEW.EqualsIgnore(roSOT?.action))
                    {
                        //For Insert, create a new RO_SOT record
                        var newROSOT = new release_order_sot();
                        newROSOT.guid = Util.GenerateGUID();
                        newROSOT.create_by = user;
                        newROSOT.create_dt = currentDateTime;
                        newROSOT.update_by = user;
                        newROSOT.update_dt = currentDateTime;

                        newROSOT.sot_guid = roSOT.storing_order_tank.guid;
                        newROSOT.ro_guid = releaseOrder.guid;
                        newROSOT.status_cv = ROStatus.PENDING;
                        newRoSotList.Add(newROSOT);

                        //Update the SOT detail
                        sot.release_job_no = roSOT.storing_order_tank.release_job_no;
                        sot.tank_status_cv = TankMovementStatus.RO;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;

                        isSendNotification = true;
                        isSOTChanges = true;
                        continue;
                    }

                    if (SOTankAction.EDIT.EqualsIgnore(roSOT?.action))
                    {   //For Update
                        //var extSch = existingSchList.Find(s => s.guid == roSOT.guid);
                        //extSch.update_by = user;
                        //extSch.update_dt = currentDateTime;

                        var extROSot = new release_order_sot() { guid = roSOT.guid };
                        context.release_order_sot.Attach(extROSot);
                        extROSot.update_by = user;
                        extROSot.update_dt = currentDateTime;
                        extROSot.status_cv = roSOT.status_cv;
                        extROSot.remarks = roSOT.remarks;

                        sot.release_job_no = roSOT.storing_order_tank.release_job_no;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;
                        isSOTChanges = true;
                        continue;
                    }

                    if (SOTankAction.CANCEL.EqualsIgnore(roSOT?.action))
                    {
                        //var extSch = existingSchList.Find(s => s.guid == roSOT.guid);
                        //extSch.status_cv = ROStatus.CANCELED;
                        //extSch.update_by = user;
                        //extSch.update_dt = currentDateTime;
                        
                        var extROSot = new release_order_sot() { guid = roSOT.guid };
                        context.release_order_sot.Attach(extROSot);
                        extROSot.status_cv = ROStatus.CANCELED;
                        extROSot.remarks = roSOT.remarks;
                        extROSot.update_by = user;
                        extROSot.update_dt = currentDateTime;
                        //extROSot.delete_dt = currentDateTime;   

                        sot.tank_status_cv = TankMovementStatus.STORAGE;
                        sot.update_by = user;
                        sot.update_dt = currentDateTime;

                        isSendNotification = true;
                        isSOTChanges = true;
                        continue;
                    }
                }

                //TODO
                context.release_order_sot.AddRange(newRoSotList);
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                res = await context.SaveChangesAsync();

                //Update Release Order details here
                release_order existingRO = new release_order() { guid = releaseOrder.guid };
                context.release_order.Attach(existingRO);
                existingRO.update_by = user;
                existingRO.update_dt = currentDateTime;
                existingRO.ro_notes = releaseOrder.ro_notes;
                existingRO.haulier = releaseOrder.haulier;
                existingRO.remarks = releaseOrder.remarks;
                existingRO.release_dt = releaseOrder.release_dt;

                //This function will check and update the RO status
                //only do when there is SOT changes
                if (isSOTChanges)
                {
                    var unCancelTanks = await context.release_order_sot.Where(r => r.ro_guid == releaseOrder.guid & r.status_cv != ROStatus.CANCELED
                                                              & (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();
                    string finalStatus = "";
                    if (unCancelTanks != null && unCancelTanks.Any())
                    {
                        int tnkAlreadyAcceptedCount = unCancelTanks.Count(t => SOTankStatus.ACCEPTED.EqualsIgnore(t.status_cv));

                        if (tnkAlreadyAcceptedCount == 0)
                            finalStatus = ROStatus.PENDING;
                        else if (tnkAlreadyAcceptedCount == unCancelTanks.Count)
                            finalStatus = ROStatus.COMPLETED;
                        else
                            finalStatus = ROStatus.PROCESSING;
                    }
                    else
                        // All tanks have been cancelled
                        finalStatus = ROStatus.CANCELED;
                    existingRO.status_cv = finalStatus;
                }

                res = res + await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> CancelReleaseOrder(List<ReleaseOrderRequest> releaseOrderList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                bool isSendNotification = false;
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var res = 0;
                long currentDateTime = DateTime.Now.ToEpochTime();

                //IList<release_order> roList = new List<release_order>();
                string[] roGuids = releaseOrderList.Select(r => r.guid).ToArray();
                //string[] schGuids = ro_SotList.Select(s => s.guid).ToArray();
                //IList<storing_order_tank> sotLists = new List<storing_order_tank>(); //context.storing_order_tank.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0)).ToList();
                List<release_order_sot> extROSotList = context.release_order_sot.Where(s => roGuids.Contains(s.ro_guid)).ToList();
                foreach (var roSOT in extROSotList)
                {
                    roSOT.update_by = user;
                    roSOT.update_dt = currentDateTime;
                    roSOT.status_cv = ROStatus.CANCELED;
                    roSOT.remarks = releaseOrderList.Find(r => r.guid == roSOT.ro_guid)?.remarks;

                    storing_order_tank sot = new() { guid = roSOT.sot_guid };
                    //Start add the entity into EF for tracking
                    context.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.tank_status_cv = TankMovementStatus.STORAGE;
                    //sotLists.Add(sot);
                }
                //context.AttachRange(sotLists);

                foreach(var item in releaseOrderList)
                {
                    release_order ro = new release_order() { guid = item.guid };
                    context.Attach(ro);
                    ro.update_by = user;
                    ro.update_dt = currentDateTime;
                    ro.status_cv = ROStatus.CANCELED;
                    ro.remarks = item.remarks;
                }
                //context.AttachRange(roList);
        
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


        //private async Task<bool> StatusConditionCheck(ApplicationInventoryDBContext contex, string ROGuid)
        //{
        //    try
        //    {
        //        //This function will check and update the RO status
        //        var unCancelTanks = await contex.release_order_sot.Where(r => r.guid == ROGuid & r.status_cv != ROStatus.CANCELED
        //                                                         & (r.delete_dt == null || r.delete_dt == 0)).ToListAsync();

        //        string finalStatus = "";
        //        if (unCancelTanks != null && unCancelTanks.Any())
        //        {
        //            int tnkAlreadyAcceptedCount = unCancelTanks.Count(t => SOTankStatus.ACCEPTED.EqualsIgnore(t.status_cv));

        //            if (tnkAlreadyAcceptedCount == 0)
        //                finalStatus = ROStatus.PENDING;
        //            else if (tnkAlreadyAcceptedCount == unCancelTanks.Count)
        //                finalStatus = ROStatus.COMPLETED;
        //            else
        //                finalStatus = ROStatus.PROCESSING;
        //        }
        //        else
        //            // All tanks have been cancelled
        //            finalStatus = ROStatus.CANCELED;

        //        var RO = new release_order() { guid = ROGuid };
        //        contex.release_order.Attach(RO);
        //        RO.status_cv = finalStatus;
        //        await contex.SaveChangesAsync();

        //        return true;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}

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
