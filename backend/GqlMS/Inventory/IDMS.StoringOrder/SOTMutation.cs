using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Inventory.GqlTypes;
using IDMS.Inventory.GqlTypes.LocalModel;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.StoringOrder.GqlTypes.LocalModel;



//using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class SOTMutation
    {
        private async Task<int> CancelStoringOrderTank(List<StoringOrderTankRequest> sot, [Service] ITopicEventSender sender,
            [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context)
        {
            try
            {
                return await StoringOrderTankChanges(config, httpContextAccessor, context, sot, true);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        public async Task<int> UpdateStoringOrderTank([Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, StoringOrderTankRequest soTank, StoringOrderRequest? storingOrder,
            ApplicationInventoryDBContext context)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrEmpty(soTank.guid))
                    throw new GraphQLException(new Error($"Tank guid cannot be emptry or null", "ERROR"));

                var sot = new storing_order_tank() { guid = soTank.guid };
                context.storing_order_tank.Attach(sot);

                //Overwrite handling------------------------
                if (!string.IsNullOrEmpty(soTank?.action) && soTank.action.EqualsIgnore(TankInfoAction.OVERWRITE))
                {
                    if (string.IsNullOrEmpty(soTank.tank_no))
                        throw new GraphQLException(new Error($"Tank no cannot be emptry or null", "ERROR"));
                    sot.tank_no = soTank.tank_no;
                }
                else
                {
                    sot.tank_note = soTank.tank_note;
                    sot.release_note = soTank.release_note;
                }
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                //Overwrite handling------------------------
                if (soTank.action.EqualsIgnore(TankInfoAction.RECUSTOMER))
                {
                    if (storingOrder == null)
                        throw new GraphQLException(new Error($"Storing order object cannot be emptry or null", "ERROR"));

                    if (string.IsNullOrEmpty(storingOrder.customer_company_guid) || string.IsNullOrEmpty(storingOrder.guid))
                        throw new GraphQLException(new Error($"SO guid/customer_guid cannot be emptry or null", "ERROR"));

                    var so = new storing_order() { guid = storingOrder.guid };
                    context.storing_order.Attach(so);
                    so.customer_company_guid = storingOrder.customer_company_guid;
                    so.update_by = user;
                    so.update_dt = currentDateTime;
                }

                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> OverwriteProcessCostHandling(ApplicationInventoryDBContext context, string sotGuid, string customerGuid,
            string tariffBufferGuid, string user, long currentDateTime)
        {

            try
            {
                //Cleaning handling
                var sotDB = context.storing_order_tank.Where(s => s.guid == sotGuid)
                                                      .Include(s => s.cleaning.Where(c => c.delete_dt == null || c.delete_dt == 0))
                                                      .Include(s => s.residue.Where(r => r.delete_dt == null || r.delete_dt == 0))
                                                      .Include(s => s.steaming.Where(st => st.delete_dt == null || st.delete_dt == 0))
                                                      .Include(s => s.repair.Where(rp => rp.delete_dt == null || rp.delete_dt == 0));


                var clean = await sotDB?.SelectMany(s => s.cleaning)?.ToListAsync();
                foreach (var item in clean)
                {
                    var categoryGuid = await sotDB?.Select(t => t.tariff_cleaning.cleaning_category_guid)?.FirstOrDefaultAsync() ?? "";
                    var adjustedPrice = await GqlUtils.GetCustomerCleaningCostAsync(context, customerGuid, categoryGuid);
                    item.cleaning_cost = adjustedPrice;
                    item.est_cleaning_cost = adjustedPrice;

                    var bufferCost = await GqlUtils.GetCustomerBufferCostAsync(context, customerGuid, tariffBufferGuid);
                    item.buffer_cost = bufferCost;
                    item.est_buffer_cost = bufferCost;

                    item.update_by = user;
                    item.update_dt = currentDateTime;

                }

                //foreach (var item in clean)
                //{
                //    var categoryGuid = await sotDB?.Select(t => t.tariff_cleaning.cleaning_category_guid)?.FirstOrDefaultAsync() ?? "";
                //    var adjustedPrice = await GqlUtils.GetCustomerCleaningCostAsync(context, customerGuid, categoryGuid);
                //    item.cleaning_cost = adjustedPrice;
                //    item.est_cleaning_cost = adjustedPrice;

                //    var bufferCost = await GqlUtils.GetCustomerBufferCostAsync(context, customerGuid, tariffBufferGuid);
                //    item.buffer_cost = bufferCost;
                //    item.est_buffer_cost = bufferCost;

                //    item.update_by = user;
                //    item.update_dt = currentDateTime;

                //}


                var steaming = await sotDB?.SelectMany(s => s.steaming)?.ToListAsync();
                foreach (var item in steaming)
                {
                    var lastCargoGuid = await sotDB?.Select(t => t.last_cargo_guid)?.FirstOrDefaultAsync() ?? "";
                    var reqTemp = await sotDB?.Select(t => t.required_temp)?.FirstOrDefaultAsync() ?? 0;

                    (var result, bool isExclusive) = await GqlUtils.GetTankPackageSteamingAsync(context, customerGuid, reqTemp, lastCargoGuid);
                    if (result != null && !string.IsNullOrEmpty(result.steaming_guid))
                    {
                        if (item?.flat_rate ?? false)
                            item.rate = item.est_cost = item.total_cost = result?.cost ?? 0.0;
                        else
                            item.rate = item.est_cost = item.total_cost = result?.labour ?? 0.0;
                    }
                    //    item.cleaning_cost = adjustedPrice;
                    //item.est_cleaning_cost = adjustedPrice;

                    //var bufferCost = await GqlUtils.GetCustomerBufferCostAsync(context, customerGuid, tariffBufferGuid);
                    //item.buffer_cost = bufferCost;
                    //item.est_buffer_cost = bufferCost;

                    item.update_by = user;
                    item.update_dt = currentDateTime;

                }
            }
            catch (Exception ex)
            {

            }



            return 1;

        }

        private async Task<int> StoringOrderTankChanges([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context, List<StoringOrderTankRequest> sot, bool forCancel)
        {
            int res = 0;
            string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
            long currentDateTime = DateTime.Now.ToEpochTime();

            string[] soGuids = sot.Select(s => s.so_guid).ToArray();

            if (soGuids == null)
                throw new GraphQLException(new Error("Storing Order Guid Cannot Null", "INVALID_OPERATION"));


            if (!soGuids.All(x => x == soGuids[0]))
                throw new GraphQLException(new Error("Storing Order Guid Not Match", "INVALID_OPERATION"));

            var storingOrder = context.storing_order.Where(s => s.guid == soGuids.First() && (s.delete_dt == null || s.delete_dt == 0))
                     .Include(s => s.storing_order_tank).FirstOrDefault();

            if (storingOrder != null)
            {
                string[] sotGuids = sot.Select(s => s.guid).ToArray();
                var tanks = storingOrder?.storing_order_tank?.Where(s => sotGuids.Contains(s.guid) && (s.delete_dt == null || s.delete_dt == 0));

                foreach (var tnk in tanks)
                {
                    tnk.status_cv = forCancel ? SOTankStatus.CANCELED : SOTankStatus.WAITING;
                    tnk.remarks = sot.Where(s => s.guid == tnk.guid).Select(s => s.remarks).First();
                    tnk.update_by = user;
                    tnk.update_dt = currentDateTime;
                }

                int tnkAlreadyAcceptedCount = 0;
                var unCancelTanks = storingOrder?.storing_order_tank?.Where(s => s.status_cv != SOTankStatus.CANCELED);
                if (unCancelTanks != null && unCancelTanks.Any())
                {
                    foreach (var t in unCancelTanks)
                    {
                        if (SOTankStatus.ACCEPTED.EqualsIgnore(t.status_cv))
                            tnkAlreadyAcceptedCount++;
                    }

                    if (tnkAlreadyAcceptedCount == 0)
                        storingOrder.status_cv = SOStatus.PENDING;
                    else if (tnkAlreadyAcceptedCount >= unCancelTanks.Count())
                        storingOrder.status_cv = SOStatus.COMPLETED;
                    else
                        storingOrder.status_cv = SOStatus.PROCESSING;
                }
                else
                    //All tank has been cancelled
                    storingOrder.status_cv = SOStatus.CANCELED;

                storingOrder.update_by = user;
                storingOrder.update_dt = currentDateTime;
                res = await context.SaveChangesAsync();

                if (!forCancel)
                    VoidInGateEIR(sotGuids, user, currentDateTime, context);
            }
            return res;
        }

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
