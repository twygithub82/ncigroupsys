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
        private readonly ILogger<MutationType> _logger;
        const string graphqlErrorCode = "ERROR";

        public MutationType(ILogger<MutationType> logger)
        {
            _logger = logger;
        }

        public async Task<int> AddNotification([Service] ApplicationNotificationDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, notification newNotification, [Service] ITopicEventSender topicEventSender)
        {
            int retval = 0;
            try
            {
                _logger.LogInformation("AddNotification called with notification guid={Guid}", newNotification?.guid);

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                if (newNotification != null)
                {
                    if (newNotification.date == null) newNotification.date = GqlUtils.GetNowEpochInSec();
                    if (string.IsNullOrEmpty(newNotification.guid)) newNotification.guid = Guid.NewGuid().ToString("N");
                    newNotification.create_dt= GqlUtils.GetNowEpochInSec() ;
                    newNotification.create_by = uid;
                    context.notification.Add(newNotification);
                    retval = context.SaveChanges();

                    _logger.LogInformation("Creating notification: {Guid} Title: {Title}", newNotification.guid, newNotification.title);

                    if (retval > 0)
                    {
                        topicEventSender.SendAsync(nameof(SubscriptionType.NotificationTriggered), newNotification);
                    }
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while adding notification guid={Guid}", newNotification?.guid);
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
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
