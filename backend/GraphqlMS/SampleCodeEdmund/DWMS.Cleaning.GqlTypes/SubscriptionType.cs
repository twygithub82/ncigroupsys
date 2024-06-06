using DWMS.Cleaning.Model;
using HotChocolate;
using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate.Types;

namespace DWMS.Cleaning.GqlTypes
{
    public class SubscriptionType
    {
        [Subscribe]
        public CakeResult CakeCreated([EventMessage]CakeResult result)
        {
            return result;
        }

        //Old method, going to obsolette
        [SubscribeAndResolve]
        public async ValueTask<ISourceStream<CakeUpdateResult>> CakeUpdated(int id, [Service] ITopicEventReceiver topicEventReceiver)
        {
            string topicName = $"{id}_CakeUpdated";
            return await topicEventReceiver.SubscribeAsync<CakeUpdateResult>(topicName);
        }

        /// <summary>
        /// Still need to work on this, not working yet
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        //public ValueTask<ISourceStream<CakeUpdateResult>> CakeUpdated([Service] ITopicEventReceiver topicEventReceiver)
        //{
        //    string topicName = $"CakeUpdated";
        //    return topicEventReceiver.SubscribeAsync<CakeUpdateResult>(topicName);
        //}
        //[Subscribe(With = nameof(CakeUpdated))]
        //public CakeUpdateResult CakeUpdated([EventMessage] CakeUpdateResult result) => result;


        [Subscribe]
        [Topic("SomeCakeDeleted")]
        public string CakeDeleted([EventMessage]int id)
        {
            return $"cake with this id: {id} deleted";
        }
    }
}
