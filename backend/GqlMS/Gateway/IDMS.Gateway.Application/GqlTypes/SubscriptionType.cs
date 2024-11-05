
//using IDMS.Models;

namespace gateway_graphql_ms.GqlTypes
{
    public class SubscriptionType
    {
        [Subscribe]
        [Topic]
        public Message MessageReceived([EventMessage] Message message) => message;
    }

    public class Message
    {
        public string event_id { get; set; } = "";
        public string event_name { get; set; } = "";
    }
}
