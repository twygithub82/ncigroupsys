using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.StoringOrder.GqlTypes.Repo;
using IDMS.StoringOrder.Model;
using IDMS.StoringOrder.Model.Request;

//using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System.Runtime.CompilerServices;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes
{
    [ExtendObjectType(typeof(SOMutation))]
    public class SOTMutation
    {
        public async Task<int> CancelStoringOrderTank(List<StoringOrderTankRequest> sot, [Service] ITopicEventSender sender,
            [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, 
            ApplicationInventoryDBContext context)
        {
            try
            {
                return await StoringOrderTankChanges(context, sot, true);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }


        public async Task<int> RollbackStoringOrderTank(List<StoringOrderTankRequest> sot, [Service] ITopicEventSender sender,
          [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, ApplicationInventoryDBContext context)
        {
            try
            {
                return await StoringOrderTankChanges(context, sot, false);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }

        private async Task<int> StoringOrderTankChanges(ApplicationInventoryDBContext context, List<StoringOrderTankRequest> sot, bool forCancel)
        {
            int res = 0;
            string user = "admin";
            long currentDateTime = DateTime.Now.ToEpochTime();

            string[] soGuids = sot.Select(s => s.so_guid).ToArray();

            if (soGuids == null)
                throw new GraphQLException(new Error("Storing Order Guid Cannot Null", "INVALID_OPERATION"));


            if(!soGuids.All(x => x == soGuids[0]))
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
