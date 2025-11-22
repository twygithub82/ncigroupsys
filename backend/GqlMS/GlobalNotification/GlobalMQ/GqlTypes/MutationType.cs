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
            _logger.LogInformation("AddNotification invoked.");

            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                _logger.LogInformation("Authorized user: {UserId}", uid);

                if (newNotification != null)
                {
                    if (newNotification.date == null) newNotification.date = GqlUtils.GetNowEpochInSec();
                    if (string.IsNullOrEmpty(newNotification.guid)) newNotification.guid = Guid.NewGuid().ToString("N");
                    newNotification.create_dt = GqlUtils.GetNowEpochInSec();
                    newNotification.create_by = uid;

                    _logger.LogInformation("Creating notification: {Guid} Title: {Title}", newNotification.guid, newNotification.title);

                    context.notification.Add(newNotification);
                    retval = context.SaveChanges();

                    if (retval > 0)
                    {
                        _logger.LogInformation("Notification saved (guid={Guid}, id={Id}). Sending subscription event.", newNotification.guid, newNotification.id);
                        await topicEventSender.SendAsync(nameof(SubscriptionType.NotificationTriggered), newNotification);
                        _logger.LogInformation("Subscription event sent for notification {Guid}.", newNotification.guid);
                    }
                    else
                    {
                        _logger.LogWarning("SaveChanges returned 0 while adding notification (guid={Guid}).", newNotification.guid);
                    }
                }
                else
                {
                    _logger.LogWarning("AddNotification called with null newNotification.");
                }

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception while adding notification.");
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
