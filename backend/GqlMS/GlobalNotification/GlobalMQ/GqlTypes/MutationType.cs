using HotChocolate.Subscriptions;
using IDMS.Models;
using IDMS.Models.DB;
using IDMS.Models.GqlTypes;
using IDMS.Models.Notification;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json.Linq;

namespace GlobalMQ.GqlTypes
{
    public class MutationType
    {

      

        public async Task<int> AddNotification([Service] ApplicationNotificationDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, notification newNotification, [Service] ITopicEventSender topicEventSender)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                if (newNotification != null)
                {
                    if (newNotification.date == null) newNotification.date = GqlUtils.GetNowEpochInSec();
                    if (string.IsNullOrEmpty(newNotification.guid)) newNotification.guid = Guid.NewGuid().ToString("N");
                    newNotification.create_dt= GqlUtils.GetNowEpochInSec() ;
                    newNotification.create_by = uid;
                    context.notification.Add(newNotification);
                    retval = context.SaveChanges();

                    if (retval > 0)
                    {
                        //Message msg = new Message();
                        //msg.event_dt = GqlUtils.GetNowEpochInSec();
                        //msg.event_id = "2030";
                        //msg.event_name = "Notification trigger";
                        //msg.payload = JToken.FromObject(newNotification).ToString();
                        topicEventSender.SendAsync(nameof(SubscriptionType.NotificationTriggered), newNotification);
                    }
                }

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        //public async Task<string> SendMessage( [Service] ITopicEventSender topicEventSender)
        //{
        //    string value = "ok";
        //    try
        //    {
        //        //await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), message);
        //        return value;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw ex;
        //    }
        //}
    }
}
