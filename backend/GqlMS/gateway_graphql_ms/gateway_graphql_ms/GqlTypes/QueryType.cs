using HotChocolate.Subscriptions;
using IDMS.Models;

namespace gateway_graphql_ms.GqlTypes
{
    public class QueryType :ObjectType
    {
        protected override void Configure(IObjectTypeDescriptor descriptor)
        {
            descriptor.Field("SendMessage")
                      .Resolve(async ([Service] ITopicEventSender topicEventSender, Message msg) =>  await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), msg));
        }
        //public async Task<string> SendMessage(string message, [Service] ITopicEventSender topicEventSender)
        //{
        //    string value = "ok";
        //    try
        //    {
        //        await topicEventSender.SendAsync("MessageReceived", message);
        //        return value;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
    }
}
