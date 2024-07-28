using IDMS.Models;

namespace GlobalMQ.GqlTypes
{
    public class SubscriptionType
    {
        [Subscribe]
        public Message MessageReceived([EventMessage] Message message) => message;
    }
}
