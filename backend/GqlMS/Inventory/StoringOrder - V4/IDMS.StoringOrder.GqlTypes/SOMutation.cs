using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.StoringOrder.GqlTypes.Repo;
using Microsoft.EntityFrameworkCore;
using AutoMapper;
using IDMS.Models.Inventory;
using IDMS.StoringOrder.Model.Request;
using IDMS.StoringOrder.Model;

namespace IDMS.StoringOrder.GqlTypes
{
    public class SOMutation
    {
        public async Task<int> AddStoringOrder(StoringOrderRequest so, List<StoringOrderTankRequest> soTanks,
            AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
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

                foreach (var tnk in soTanks)
                {
                    storing_order_tank newTank = mapper.Map<StoringOrderTankRequest, storing_order_tank>(tnk);
                    newTank.guid = Util.GenerateGUID();
                    newTank.so_guid = soDomain.guid;
                    newTank.create_dt = currentDateTime;
                    newTank.create_by = user;
                    newTank.status_cv = SOTankStatus.WAITING;
                    context.storing_order_tank.Add(newTank);
                }

                // Add StoringOrder to DbContext and save changes
                context.storing_order.Add(soDomain);
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

        public async Task<int> UpdateStoringOrder(StoringOrderRequest so, List<StoringOrderTankRequest> soTanks,
            AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        {
            //id updateSO dont have guid i need to call insert command
            //for soTanks, if have guid and delete_dt > 1 need to call update (soft delete)
            //return null;
            try
            {
                //if updateSO have guid then i need call update command
                storing_order? soDomain = await context.storing_order.Where(d => d.delete_dt == null || d.delete_dt == 0)
                                        .Include(s => s.storing_order_tank)
                                        .FirstOrDefaultAsync(s => s.guid == so.guid);
                if (soDomain == null)
                {
                    throw new GraphQLException(new Error("Storing Order not found.", "NOT_FOUND"));
                }

                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();


                // Update child entities (StoringOrderTanks)
                foreach (var tnk in soTanks)
                {
                    // Find the corresponding existing child entity or add a new one if necessary
                    var existingTank = soDomain.storing_order_tank.FirstOrDefault(t => t.guid == tnk.guid && (t.delete_dt == null || t.delete_dt == 0));

                    if (existingTank == null)
                    {
                        //For Insert
                        // If the child entity does not exist, add a new one
                        storing_order_tank newTank = mapper.Map<StoringOrderTankRequest, storing_order_tank>(tnk);
                        newTank.guid = Util.GenerateGUID(); // Ensure the foreign key is set
                        newTank.create_dt = currentDateTime;
                        newTank.create_by = user;
                        context.storing_order_tank.Add(newTank);
                        continue;
                    }

                    //var updatedTank = RemoveNullProperties(tnk);
                    mapper.Map(tnk, existingTank);
                    if (tnk.delete_dt > 0)
                    {
                        existingTank.delete_dt = currentDateTime;
                        existingTank.update_dt = currentDateTime;
                        existingTank.update_by = user;
                    }
                    else
                    {
                        //For Update
                        //existingTank = updatedTank;
                        existingTank.update_dt = currentDateTime;
                        existingTank.update_by = user;
                        //existingTank.clean_status = tnk.clean_status;
                        //existingTank.certificate = tnk.certificate;
                    }
                }


                if (so.delete_dt > 0)
                {
                    soDomain.delete_dt = currentDateTime;
                    soDomain.update_dt = currentDateTime;
                    soDomain.update_by = user;
                }
                else
                {
                    //soDomain.status_cv = so.status_cv;
                    soDomain.customer_company_guid = so.customer_company_guid;
                    soDomain.haulier = so.haulier;
                    //soDomain.so_no = so.so_no;
                    soDomain.so_notes = so.so_notes;
                    soDomain.update_dt = currentDateTime;
                    soDomain.update_by = user;
                }

                //soDomain.storing_order_tank = storingOrderTanks;
                // context.storing_order.Update(soDomain);
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

        //public async Task<int> CancelStoringOrder(string[] soGuids, [Service] ITopicEventSender sender,
        //    AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
        //{
        //    try
        //    {
        //        string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        var storingOrders = context.storing_order.Where(s => soGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0))
        //                                                 .Include(s => s.storing_order_tank);

        //        if (storingOrders.Any())
        //        {
        //            foreach (var so in storingOrders)
        //            {
        //                if (!(PENDING.EqualsIgnore(so.status_cv) || PROCESSING.EqualsIgnore(so.status_cv)))
        //                    throw new GraphQLException(new Error("Storing Order Cannot be Canceled.", "INVALID_OPERATION"));

        //                int tnkAlreadyAcceptedCount = 0;
        //                string finalSOStatus = CANCELED;

        //                var tanks = so.storing_order_tank?.Where(t => t.so_guid == so.guid);
        //                if (tanks != null && tanks.Any())
        //                {
        //                    foreach (var tnk in tanks)
        //                    {
        //                        if (string.IsNullOrEmpty(tnk.tank_status_cv) || WAITING.EqualsIgnore(tnk.tank_status_cv))
        //                        {
        //                            tnk.status_cv = CANCELED;
        //                            tnk.update_dt = currentDateTime;
        //                            tnk.update_by = user;
        //                        }

        //                        if (ACCEPTED.EqualsIgnore(tnk.status_cv))
        //                            tnkAlreadyAcceptedCount++;
        //                    }

        //                    if (tnkAlreadyAcceptedCount == tanks.Count())
        //                        throw new GraphQLException(new Error("Storing Order Cannot be Canceled.", "INVALID_OPERATION"));

        //                    if (tnkAlreadyAcceptedCount > 0 && tnkAlreadyAcceptedCount != tanks.Count())
        //                        finalSOStatus = COMPLETED;

        //                }
        //                //so.status_cv = CANCEL;
        //                so.update_dt = currentDateTime;
        //                so.update_by = user;
        //                so.status_cv = finalSOStatus;
        //            }

        //            var res = await context.SaveChangesAsync();
        //            //TODO
        //            //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
        //            //await topicEventSender.SendAsync(updateCourseTopic, course);
        //            return res;
        //        }
        //        else
        //        {
        //            throw new GraphQLException(new Error("Storing Order Not Found.", "NOT_FOUND"));
        //        }

        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        public async Task<int> CancelStoringOrder(List<StoringOrderRequest> so, [Service] ITopicEventSender sender,
          AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
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
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }



        public async Task<int> DeleteStoringOrder(string[] soGuids, [Service] ITopicEventSender sender,
        AppDbContext context, [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper)
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
