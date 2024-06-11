using HotChocolate.Subscriptions;
using IDMS.Models;

namespace GlobalMQ.GqlTypes
{
    public class QueryType
    {
        public async Task<string> SendMessage(EntityClass_Message message, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), message);
                return value;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
