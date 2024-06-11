using IDMS.Models;

namespace GlobalMQ.GqlTypes
{
    public class SubscriptionType
    {
        [Subscribe]
        public EntityClass_Message MessageReceived([EventMessage] EntityClass_Message message) => message;
    }
}
