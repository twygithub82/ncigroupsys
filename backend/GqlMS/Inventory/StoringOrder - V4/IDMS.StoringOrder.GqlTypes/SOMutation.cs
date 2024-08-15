using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.StoringOrder.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using IDMS.Models.Inventory;
using IDMS.StoringOrder.Model.Request;
using IDMS.StoringOrder.Model;
using HotChocolate.Utilities;
using Microsoft.Extensions.Configuration;
using IDMS.Models;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;

namespace IDMS.StoringOrder.GqlTypes
{
    public class SOMutation
    {
        public async Task<int> AddStoringOrder(StoringOrderRequest so, List<StoringOrderTankRequest> soTanks,
            [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
            ApplicationInventoryDBContext context)
        {
            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                storing_order soDomain = new();
                mapper.Map(so, soDomain);
                soDomain.guid = Util.GenerateGUID();
                soDomain.status_cv = SOStatus.PENDING;
                soDomain.create_dt = currentDateTime;
                soDomain.create_by = user;

                if (soTanks is null || soTanks.Count <= 0)
                    throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "INVALID_OPERATION"));

                IList<storing_order_tank> newTankList = new List<storing_order_tank>();
                foreach (var tnk in soTanks)
                {
                    storing_order_tank newTank = mapper.Map<StoringOrderTankRequest, storing_order_tank>(tnk);
                    newTank.guid = Util.GenerateGUID();
                    newTank.so_guid = soDomain.guid;
                    newTank.create_dt = currentDateTime;
                    newTank.create_by = user;
                    if (SOTankAction.PREORDER.EqualsIgnore(tnk?.action))
                        newTank.status_cv = SOTankStatus.PREORDER;
                    else
                        newTank.status_cv = SOTankStatus.WAITING;
                    newTank.preinspect_job_no = tnk.job_no;
                    newTank.liftoff_job_no = tnk.job_no;
                    newTank.lifton_job_no = tnk.job_no;
                    newTank.takein_job_no = tnk.job_no;
                    newTank.release_job_no = tnk.job_no;
                    //context.storing_order_tank.Add(newTank);
                    newTankList.Add(newTank);   
                }

                // Add StoringOrder to DbContext and save changes
                await context.storing_order.AddAsync(soDomain);
                await context.storing_order_tank.AddRangeAsync(newTankList);
                var res = await context.SaveChangesAsync();

                //TODO
                string evtId = EventId.NEW_SOT;
                string evtName = EventName.NEW_SOT;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateStoringOrder(StoringOrderRequest so, List<StoringOrderTankRequest> soTanks,
            [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
            ApplicationInventoryDBContext context)
        {
            bool isSendNotification = false;

            try
            {
                //if updateSO have guid then i need call update command
                storing_order soDomain = await context.storing_order.Where(d => d.delete_dt == null || d.delete_dt == 0)
                                        .Include(s => s.storing_order_tank).FirstOrDefaultAsync(s => s.guid == so.guid);
                if (soDomain == null)
                {
                    throw new GraphQLException(new Error("Storing Order not found.", "NOT_FOUND"));
                }

                if (string.IsNullOrEmpty(soDomain.customer_company_guid))
                {
                    throw new GraphQLException(new Error("customer_company_guid cant be null", "Error"));
                }

                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();
                List<string> rollbackSOTGuids = new List<string>();

                // Update child entities (StoringOrderTanks)
                foreach (var tnk in soTanks)
                {
                    if (string.IsNullOrEmpty(tnk?.action))
                        continue;

                    if (SOTankAction.NEW.EqualsIgnore(tnk?.action) || (SOTankAction.PREORDER.EqualsIgnore(tnk?.action) && string.IsNullOrEmpty(tnk?.guid)))
                    {
                        //For Insert
                        storing_order_tank newTank = mapper.Map<StoringOrderTankRequest, storing_order_tank>(tnk);
                        // If the child entity does not exist, add a new one
                        newTank.guid = Util.GenerateGUID(); // Ensure the foreign key is set
                        newTank.create_dt = currentDateTime;
                        newTank.create_by = user;
                        newTank.status_cv = SOTankAction.NEW.EqualsIgnore(tnk?.action) ? SOTankStatus.WAITING : SOTankStatus.PREORDER;
                        await context.storing_order_tank.AddAsync(newTank);
                        isSendNotification = true;
                        continue;
                    }

                    if (string.IsNullOrEmpty(tnk?.guid) || string.IsNullOrEmpty(tnk.last_cargo_guid))
                        throw new GraphQLException(new Error("Compulsory fields sot_guid or last_cargo_guid cant be null", "Error"));

                    // Find the corresponding existing child entity or add a new one if necessary
                    var existingTank = soDomain.storing_order_tank.FirstOrDefault(t => t.guid == tnk.guid && (t.delete_dt == null || t.delete_dt == 0));
                    mapper.Map(tnk, existingTank);

                    existingTank.update_by = user;
                    existingTank.update_dt = currentDateTime;

                    if (SOTankAction.EDIT.EqualsIgnore(tnk?.action))
                    {
                        //existingTank.update_by = user;
                        //existingTank.update_dt = currentDateTime;
                        //context.storing_order_tank.Update(newTank);
                        isSendNotification = true;
                        continue;
                    }

                    if (SOTankAction.ROLLBACK.EqualsIgnore(tnk?.action))
                    {
                        //existingTank.update_by = user;
                        //existingTank.update_dt = currentDateTime;
                        existingTank.status_cv = SOTankStatus.WAITING;
                        rollbackSOTGuids.Add(tnk.guid);
                        isSendNotification = true;
                        continue;
                    }

                    if (SOTankAction.CANCEL.EqualsIgnore(tnk?.action))
                    {
                        //existingTank.update_by = user;
                        //existingTank.update_dt = currentDateTime;
                        existingTank.status_cv = SOTankStatus.CANCELED;
                        isSendNotification = true;
                        continue;
                    }

                    if (SOTankAction.PREORDER.EqualsIgnore(tnk?.action))
                    {
                        //existingTank.update_by = user;
                        //existingTank.update_dt = currentDateTime;
                        existingTank.status_cv = SOTankStatus.PREORDER;
                        isSendNotification = true;
                        continue;
                    }
                }

                int tnkAlreadyAcceptedCount = 0;
                var unCancelTanks = soDomain?.storing_order_tank?.Where(s => s.status_cv != SOTankStatus.CANCELED);
                if (unCancelTanks != null && unCancelTanks.Any())
                {
                    foreach (var t in unCancelTanks)
                    {
                        if (SOTankStatus.ACCEPTED.EqualsIgnore(t.status_cv))
                            tnkAlreadyAcceptedCount++;
                    }

                    if (tnkAlreadyAcceptedCount == 0)
                        soDomain.status_cv = SOStatus.PENDING;
                    else if (tnkAlreadyAcceptedCount >= unCancelTanks.Count())
                        soDomain.status_cv = SOStatus.COMPLETED;
                    else
                        soDomain.status_cv = SOStatus.PROCESSING;
                }
                else
                    //All tank has been cancelled
                    soDomain.status_cv = SOStatus.CANCELED;

                soDomain.remarks = so.remarks;
                soDomain.haulier = so.haulier;
                soDomain.customer_company_guid = so.customer_company_guid;
                soDomain.so_notes = so.so_notes;
                soDomain.update_by = user;
                soDomain.update_dt = currentDateTime;
                var res = await context.SaveChangesAsync();

                if (isSendNotification)
                {
                    string evtId = EventId.NEW_SOT;
                    string evtName = EventName.NEW_SOT;
                    GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
                }


                if (rollbackSOTGuids.Any())
                    VoidInGateEIR(rollbackSOTGuids.ToArray(), user, currentDateTime, context);

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


        public async Task<int> CancelStoringOrder(List<StoringOrderRequest> so, [Service] ITopicEventSender sender,
          [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
          ApplicationInventoryDBContext context)
        {
            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (StoringOrderRequest soRequest in so)
                {
                    var storingOrder = context.storing_order.Where(s => s.guid == soRequest.guid && (s.delete_dt == null || s.delete_dt == 0))
                                                 .Include(s => s.storing_order_tank).FirstOrDefault();

                    if (storingOrder != null)
                    {
                        //if (!(SOStatus.PENDING.EqualsIgnore(storingOrder.status_cv) || SOStatus.PROCESSING.EqualsIgnore(storingOrder.status_cv)))
                        //    throw new GraphQLException(new Error("Storing Order Cannot be Canceled.", "INVALID_OPERATION"));

                        //if (SOStatus.PROCESSING.EqualsIgnore(storingOrder.status_cv) || SOStatus.COMPLETED.EqualsIgnore(storingOrder.status_cv))
                        //    throw new GraphQLException(new Error("Storing Order Cannot be Canceled.", "INVALID_OPERATION"));

                        int tnkAlreadyAcceptedCount = 0;
                        string finalSOStatus = SOStatus.CANCELED;

                        var tanks = storingOrder.storing_order_tank?.Where(t => t.so_guid == storingOrder.guid);
                        if (tanks != null && tanks.Any())
                        {
                            foreach (var tnk in tanks)
                            {
                                if (string.IsNullOrEmpty(tnk.status_cv) || SOTankStatus.WAITING.EqualsIgnore(tnk.status_cv))
                                {
                                    tnk.status_cv = SOTankStatus.CANCELED;
                                    tnk.update_dt = currentDateTime;
                                    tnk.update_by = user;
                                }

                                if (SOTankStatus.ACCEPTED.EqualsIgnore(tnk.status_cv))
                                    tnkAlreadyAcceptedCount++;
                            }

                            if (tnkAlreadyAcceptedCount == tanks.Count())
                                throw new GraphQLException(new Error("Storing Order Cannot be Canceled.", "INVALID_OPERATION"));

                            if (tnkAlreadyAcceptedCount > 0 && tnkAlreadyAcceptedCount != tanks.Count())
                                finalSOStatus = SOStatus.COMPLETED;

                        }
                        //so.status_cv = CANCEL;
                        storingOrder.update_dt = currentDateTime;
                        storingOrder.update_by = user;
                        storingOrder.status_cv = finalSOStatus;
                        storingOrder.remarks = soRequest.remarks;
                    }
                }

                var res = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_SOT;
                string evtName = EventName.NEW_SOT;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }



        public async Task<int> DeleteStoringOrder(string[] soGuids, [Service] ITopicEventSender sender,
        [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
        ApplicationInventoryDBContext context)
        {

            try
            {
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var storingOrders = context.storing_order.Where(s => soGuids.Contains(s.guid) && s.delete_dt == null)
                                                        .Include(s => s.storing_order_tank);
                foreach (var so in storingOrders)
                {
                    //so.status_cv = CANCEL;
                    so.delete_dt = currentDateTime;
                    so.update_dt = currentDateTime;
                    so.update_by = user;

                    var tanks = so.storing_order_tank?.Where(t => t.guid == so.guid);
                    if (tanks != null)
                    {
                        foreach (var tnk in tanks)
                        {
                            tnk.delete_dt = currentDateTime;
                            tnk.update_dt = currentDateTime;
                            tnk.update_by = user;
                        }
                    }
                }

                var res = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_SOT;
                string evtName = EventName.NEW_SOT;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }



        //private async Task<int> StoringOrderTankChanges(AppDbContext context, List<StoringOrderTankRequest> sot, bool forCancel)
        //{
        //    int res = 0;
        //    string user = "admin";
        //    long currentDateTime = DateTime.Now.ToEpochTime();

        //    string[] soGuids = sot.Select(s => s.so_guid).ToArray();

        //    if (soGuids == null)
        //        throw new GraphQLException(new Error("Storing Order Guid Cannot Null", "INVALID_OPERATION"));


        //    if (!soGuids.All(x => x == soGuids[0]))
        //        throw new GraphQLException(new Error("Storing Order Guid Not Match", "INVALID_OPERATION"));

        //    var storingOrder = context.storing_order.Where(s => s.guid == soGuids.First() && (s.delete_dt == null || s.delete_dt == 0))
        //             .Include(s => s.storing_order_tank).FirstOrDefault();

        //    if (storingOrder != null)
        //    {
        //        string[] sotGuids = sot.Select(s => s.guid).ToArray();
        //        var tanks = storingOrder?.storing_order_tank?.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0));

        //        foreach (var tnk in tanks)
        //        {
        //            tnk.status_cv = forCancel ? SOTankStatus.CANCELED : SOTankStatus.WAITING;
        //            tnk.remarks = sot.Where(s => s.guid == tnk.guid).Select(s => s.remarks).First();
        //            tnk.update_by = user;
        //            tnk.update_dt = currentDateTime;
        //        }

        //        int tnkAlreadyAcceptedCount = 0;
        //        var unCancelTanks = storingOrder?.storing_order_tank?.Where(s => s.status_cv != SOTankStatus.CANCELED);
        //        if (unCancelTanks != null && unCancelTanks.Any())
        //        {
        //            foreach (var t in unCancelTanks)
        //            {
        //                if (SOTankStatus.ACCEPTED.EqualsIgnore(t.status_cv))
        //                    tnkAlreadyAcceptedCount++;
        //            }

        //            if (tnkAlreadyAcceptedCount == 0)
        //                storingOrder.status_cv = SOStatus.PENDING;
        //            else if (tnkAlreadyAcceptedCount >= unCancelTanks.Count())
        //                storingOrder.status_cv = SOStatus.COMPLETED;
        //            else
        //                storingOrder.status_cv = SOStatus.PROCESSING;
        //        }
        //        else
        //            //All tank has been cancelled
        //            storingOrder.status_cv = SOStatus.CANCELED;

        //        storingOrder.update_by = user;
        //        storingOrder.update_dt = currentDateTime;
        //        res = await context.SaveChangesAsync();

        //        if (!forCancel)
        //            VoidInGateEIR(sotGuids, user, currentDateTime, context);
        //    }
        //    return res;
        //}

        private async void VoidInGateEIR(string[] sotGuids, string user, long currentDateTime, ApplicationInventoryDBContext context)
        {
            var InGates = context.in_gate.Where(i => sotGuids.Contains(i.so_tank_guid) && (i.delete_dt == null || i.delete_dt == 0));
            foreach (var ig in InGates)
            {
                ig.update_dt = currentDateTime;
                ig.update_by = user;
                ig.delete_dt = currentDateTime;
            }
            await context.SaveChangesAsync();
        }
    }
}
