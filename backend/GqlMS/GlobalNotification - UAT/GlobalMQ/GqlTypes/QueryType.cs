using GlobalMQ.LocalModel;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using IDMS.Models;
using IDMS.Models.DB;
using IDMS.Models.GqlTypes;
using IDMS.Models.Notification;
using IDMS.Models.Package;
using Microsoft.Extensions.Logging;
using System;

namespace GlobalMQ.GqlTypes
{
    public class QueryType
    {
        private readonly ILogger<QueryType> _logger;
        const string graphqlErrorCode = "ERROR";

        public QueryType(ILogger<QueryType> logger)
        {
            _logger = logger;
        }

        public async Task<string> SendMessage(Message message, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                _logger.LogDebug("SendMessage called. event_id={EventId} event_name={EventName}", message?.event_id, message?.event_name);
                await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), message);
                _logger.LogInformation("Message published to topic {Topic} event_id={EventId}", nameof(SubscriptionType.MessageReceived), message?.event_id);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing message event_id={EventId}", message?.event_id);
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
        }

        public async Task<string> SendJobNotification(JobNotification jobNotification, int type, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                _logger.LogDebug("SendJobNotification called. job_order_guid={JobOrderGuid} item_guid={ItemGuid} type={Type}", jobNotification?.job_order_guid, jobNotification?.item_guid, type);

                string prefix = "On";
                string methodName = "";
                string topicName = "";

                if (type == JobNotificationType.START_JOB)
                {
                    methodName = nameof(SubscriptionType.JobStarted);
                    topicName = $"{prefix}{methodName}_{jobNotification.job_order_guid}";
                }
                else if (type == JobNotificationType.STOP_JOB)
                {
                    methodName = nameof(SubscriptionType.JobStopped);
                    topicName = $"{prefix}{methodName}_{jobNotification.job_order_guid}";
                }
                else if (type == JobNotificationType.COMPLETE_JOB)
                {
                    methodName = nameof(SubscriptionType.JobCompleted);
                    topicName = $"{prefix}{methodName}_{jobNotification.job_order_guid}";
                }
                else if (type == JobNotificationType.COMPLETE_ITEM)
                {
                    methodName = nameof(SubscriptionType.JobStopped);
                    topicName = $"{prefix}{methodName}_{jobNotification.item_guid}_{jobNotification.job_type}";
                }

                _logger.LogInformation("Publishing job notification to topic {Topic} (method={Method})", topicName, methodName);
                await topicEventSender.SendAsync(topicName, jobNotification);
                _logger.LogInformation("Published job notification for job_order_guid={JobOrderGuid} to {Topic}", jobNotification?.job_order_guid, topicName);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing job notification for job_order_guid={JobOrderGuid}", jobNotification?.job_order_guid);
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
        }


        public async Task<string> SendPurposeChangeNotification(PurposeNotification purposeNotification, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                _logger.LogDebug("SendPurposeChangeNotification called. sot_guid={SotGuid} purpose={Purpose}", purposeNotification?.sot_guid, purposeNotification?.purpose);

                string prefix = "On";
                string methodName = nameof(SubscriptionType.PurposeChanged);
                string topicName = $"{prefix}{methodName}_{purposeNotification.sot_guid}";

                _logger.LogInformation("Publishing purpose change to topic {Topic}", topicName);
                await topicEventSender.SendAsync(topicName, purposeNotification);
                _logger.LogInformation("Published purpose change for sot_guid={SotGuid} to {Topic}", purposeNotification?.sot_guid, topicName);

                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error publishing purpose change for sot_guid={SotGuid}", purposeNotification?.sot_guid);
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<notification> QueryNotifications([Service] ApplicationNotificationDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<notification> query = null;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                _logger.LogDebug("QueryNotifications called by user {UserId}", uid);

                DateTime endTargetTime = DateTime.Today.AddHours(23).AddMinutes(59).AddSeconds(59);
                DateTime startTargetTime = DateTime.Today.AddMonths(-1);

                long enddt = ((DateTimeOffset)endTargetTime).ToUnixTimeSeconds();
                long startdt = ((DateTimeOffset)startTargetTime).ToUnixTimeSeconds();

                _logger.LogInformation("Querying notifications for user {UserId} between {Start} and {End} (unix:{StartDt}-{EndDt})", uid, startTargetTime, endTargetTime, startdt, enddt);

                query = context.notification.Where(i => (i.delete_dt == null || i.delete_dt == 0) && (i.date >= startdt && i.date <= enddt)).OrderByDescending(i => i.date);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error while querying notifications");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }

            return query;
        }
    }
}
