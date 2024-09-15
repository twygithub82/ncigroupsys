using AutoMapper;
using HotChocolate.Subscriptions;
using HotChocolate;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Inventory;
using IDMS.Models;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;

namespace IDMS.Inventory.GqlTypes
{
    public class Mutation
    {

        //public async Task<int> AddStoringOrder(StoringOrderRequest so, List<StoringOrderTankRequest> soTanks,
        //   [Service] ITopicEventSender topicEventSender, [Service] IMapper mapper, [Service] IConfiguration config,
        //   ApplicationInventoryDBContext context)
        //{
        //    try
        //    {
        //        string user = "admin";
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        storing_order soDomain = new();
        //        mapper.Map(so, soDomain);
        //        soDomain.guid = Util.GenerateGUID();
        //        soDomain.status_cv = SOStatus.PENDING;
        //        soDomain.create_dt = currentDateTime;
        //        soDomain.create_by = user;

        //        if (soTanks is null || soTanks.Count <= 0)
        //            throw new GraphQLException(new Error("Storing order tank cannot be null or empty.", "INVALID_OPERATION"));

        //        IList<storing_order_tank> newTankList = new List<storing_order_tank>();
        //        foreach (var tnk in soTanks)
        //        {
        //            storing_order_tank newTank = mapper.Map<StoringOrderTankRequest, storing_order_tank>(tnk);
        //            newTank.guid = Util.GenerateGUID();
        //            newTank.so_guid = soDomain.guid;
        //            newTank.create_dt = currentDateTime;
        //            newTank.create_by = user;
        //            if (SOTankAction.PREORDER.EqualsIgnore(tnk?.action))
        //                newTank.status_cv = SOTankStatus.PREORDER;
        //            else
        //                newTank.status_cv = SOTankStatus.WAITING;
        //            newTank.preinspect_job_no = tnk.job_no;
        //            newTank.liftoff_job_no = tnk.job_no;
        //            newTank.lifton_job_no = tnk.job_no;
        //            newTank.takein_job_no = tnk.job_no;
        //            newTank.release_job_no = tnk.job_no;
        //            //context.storing_order_tank.Add(newTank);
        //            newTankList.Add(newTank);
        //        }

        //        // Add StoringOrder to DbContext and save changes
        //        await context.storing_order.AddAsync(soDomain);
        //        await context.storing_order_tank.AddRangeAsync(newTankList);
        //        var res = await context.SaveChangesAsync();

        //        //TODO
        //        string evtId = EventId.NEW_SOT;
        //        string evtName = EventName.NEW_SOT;
        //        GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
        //        //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
        //    }
        //}
    }
}
