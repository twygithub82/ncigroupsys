using DWMS.Cleaning.Model;
using DWMS.DB.Implementation;
using DWMS.DB.Interface;
using HotChocolate;
using HotChocolate.Subscriptions;

namespace DWMS.Cleaning.GqlTypes
{
    public class MutationType
    {
        private readonly List<Cake> cakes;
        public MutationType()
        {
            cakes = new List<Cake>();
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
