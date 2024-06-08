using CommonUtil.Core.Service;
using DWMS.Cleaning.Model;
using DWMS.DB.Implementation;
using DWMS.DB.Interface;
using DWMS.DBAccess.Interface;
using HotChocolate;
using HotChocolate.Subscriptions;
using Newtonsoft.Json.Linq;
using System.Net;

namespace DWMS.Cleaning.GqlTypes
{
    public class MutationType
    {
        private readonly List<Cake> cakes;
        private readonly IDBAccess _dbAccess;

        public MutationType(IDBAccess dBAccess)
        {
            cakes = new List<Cake>();
            _dbAccess = dBAccess;
        }


        public async Task<Person> CreatePerson(string name)
        {
            Person person = new Person { ID = 1, Name = name, Date = DateTime.Now };
            if (await _dbAccess.InsertDataAsync(person) == null)
            {
                throw new GraphQLException(new Error("create new person error", "CREATE_ERROR"));
            };
            return person;
        }


        public async Task<CakeResult> CreateNewCake(string name, decimal price, string desc, [Service] ITopicEventSender topicEventSender)
        {
            var newId = (int)DateTime.Now.Ticks;
            Cake cake = new Cake()
            {
                Id = newId,
                Name = name,
                Price = price,
                Description = desc
            };
            cakes.Add(cake);

            CakeResult result = new CakeResult()
            {
                Id = newId,
                Name = name,
            };

            //Send to the function that need this subsciptions
            await topicEventSender.SendAsync(nameof(SubscriptionType.CakeCreated), result);

            return result;
        }

        public async Task<CakeUpdateResult> CakeUpdate(int id, decimal newPrice, [Service] ITopicEventSender topicEventSender)
        {
            Cake cake = cakes.FirstOrDefault(c => c.Id == id);
            if (cake == null)
            {
                throw new GraphQLException(new Error("cake not found", "NOT_FOUND"));
            }

            CakeUpdateResult result = new CakeUpdateResult()
            {
                Id = id,
                NewPrice = newPrice
            };

            string topicName = $"{id}_{nameof(SubscriptionType.CakeUpdated)}";
            await topicEventSender.SendAsync(topicName, result);
            return result;
        }

        public async Task<bool> CakeDelete(int id, [Service]ITopicEventSender sender) 
        {

            var ret = cakes.RemoveAll(c => c.Id == id);
            if (ret >= 1)
            {
                await sender.SendAsync("SomeCakeDeleted", id);
                return true;
            }
            else return false;
        }
    }
}
