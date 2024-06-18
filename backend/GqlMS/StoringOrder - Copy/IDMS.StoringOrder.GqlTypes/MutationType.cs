using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using IDMS.StoringOrder.Model;
using IDMS.DBAccess.Interface;
using Newtonsoft.Json.Linq;
using System;
using System.Net;

namespace IDMS.StoringOrder.GqlTypes
{
    public class MutationType
    {
        //private readonly List<Cake> cakes;
        private readonly IDBAccess _dbAccess;

        public MutationType(IDBAccess dBAccess)
        {
            _dbAccess = dBAccess;
        }

        //public async Task<StoringOder> CreateStoringOrder(StoringOder newSO, List<StoringOrderTank> soTanks)
        //{

        //}

        //public async Task<StoringOder> UpdateStoringOrder(StoringOder updateSO, List<StoringOrderTank> soTanks, bool forCancel, [Service] ITopicEventSender topicEventSender)
        //{

        //    //if updateSO have guid then i need call update command

        //    //id updateSO dont have guid i need to call insert command

        //    //for soTanks, if have guid and delete_dt > 1 need to call update (soft delete)


        //    //if (await _dbAccess.UpdateDataAsync<StoringOder>(updateSO, "storing_order") >= 1)
        //    //{
        //    //    string topicName = $"{nameof(SubscriptionType.SOUpdated)}";
        //    //    await topicEventSender.SendAsync(topicName, updateSO);
        //    //    return updateSO;
        //    //}
        //    //else
        //    //{
        //    //    throw new GraphQLException(new Error("storing_order not found", "UPDATE FAIL"));
        //    //}
        //}




        public async Task<StoringOder> DeleteStoringOrder(StoringOder deleteSO, [Service] ITopicEventSender sender)
        {

            if (await _dbAccess.DeleteDataAsync(deleteSO.guid, "storing_order") >= 1)
            {
                await sender.SendAsync("SODeleted", deleteSO.so_no);
                return deleteSO;
            }
            else
            {
                throw new GraphQLException(new Error("storing_order not found", "DELETE FAIL"));
            }

        }

        //public async Task<Person> CreatePerson(string name)
        //{
        //    Person person = new Person { ID = 1, Name = name, Date = DateTime.Now };
        //    if (await _dbAccess.InsertDataAsync(person) == null)
        //    {
        //        throw new GraphQLException(new Error("create new person error", "CREATE_ERROR"));
        //    };
        //    return person;
        //}


        //public async Task<CakeResult> CreateNewCake(string name, decimal price, string desc, [Service] ITopicEventSender topicEventSender)
        //{
        //    var newId = (int)DateTime.Now.Ticks;
        //    Cake cake = new Cake()
        //    {
        //        Id = newId,
        //        Name = name,
        //        Price = price,
        //        Description = desc
        //    };
        //    cakes.Add(cake);

        //    CakeResult result = new CakeResult()
        //    {
        //        Id = newId,
        //        Name = name,
        //    };

        //    //Send to the function that need this subsciptions
        //    await topicEventSender.SendAsync(nameof(SubscriptionType.CakeCreated), result);

        //    return result;
        //}

        //public async Task<CakeUpdateResult> CakeUpdate(int id, decimal newPrice, [Service] ITopicEventSender topicEventSender)
        //{
        //    Cake cake = cakes.FirstOrDefault(c => c.Id == id);
        //    if (cake == null)
        //    {
        //        throw new GraphQLException(new Error("cake not found", "NOT_FOUND"));
        //    }

        //    CakeUpdateResult result = new CakeUpdateResult()
        //    {
        //        Id = id,
        //        NewPrice = newPrice
        //    };

        //    string topicName = $"{id}_{nameof(SubscriptionType.CakeUpdated)}";
        //    await topicEventSender.SendAsync(topicName, result);
        //    return result;
        //}

        //public async Task<bool> CakeDelete(int id, [Service]ITopicEventSender sender) 
        //{

        //    var ret = cakes.RemoveAll(c => c.Id == id);
        //    if (ret >= 1)
        //    {
        //        await sender.SendAsync("SomeCakeDeleted", id);
        //        return true;
        //    }
        //    else return false;
        //}
    }
}
