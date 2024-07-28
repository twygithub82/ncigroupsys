using IDMS.Models;
using IDMS.Models.Notification;

namespace GlobalMQ.GqlTypes
{
    public class SubscriptionType
    {
        [Subscribe]
        public Message MessageReceived([EventMessage] Message message) => message;


        [Subscribe]
        public notification NotificationTriggered([EventMessage] notification notification) => notification;
    }
}
