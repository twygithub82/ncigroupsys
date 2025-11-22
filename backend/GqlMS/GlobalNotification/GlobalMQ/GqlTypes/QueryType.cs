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

        public async Task<string> SendMessage_r1( Message_r1 message, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            _logger.LogInformation("SendMessage_r1 invoked.");
            try
            {
                _logger.LogDebug("Sending Message_r1 to topic {Topic}, event_id={EventId}", message?.topic, message?.event_id);
                await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived_r1), message);
                _logger.LogInformation("SendMessage_r1 completed for event_id={EventId}", message?.event_id);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SendMessage_r1 for event_id={EventId}", message?.event_id);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
        }

        public async Task<string> SendMessage(Message message, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            _logger.LogInformation("SendMessage invoked.");
            try
            {
                _logger.LogDebug("Sending Message to subscription {Subscription}, event_id={EventId}", nameof(SubscriptionType.MessageReceived), message?.event_id);
                await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), message);
                _logger.LogInformation("SendMessage completed for event_id={EventId}", message?.event_id);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SendMessage for event_id={EventId}", message?.event_id);
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
            _logger.LogInformation("SendJobNotification invoked. job_order_guid={JobOrderGuid}, type={Type}", jobNotification?.job_order_guid, type);
            try
            {
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

                _logger.LogDebug("Publishing job notification. topic={Topic}, method={Method}", topicName, methodName);
                await topicEventSender.SendAsync(topicName, jobNotification);
                _logger.LogInformation("Job notification published to {Topic}", topicName);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SendJobNotification for job_order_guid={JobOrderGuid}", jobNotification?.job_order_guid);
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
            _logger.LogInformation("SendPurposeChangeNotification invoked. sot_guid={SotGuid}", purposeNotification?.sot_guid);
            try
            {
                string prefix = "On";
                string methodName = nameof(SubscriptionType.PurposeChanged);
                string topicName = $"{prefix}{methodName}_{purposeNotification.sot_guid}";

                _logger.LogDebug("Publishing purpose change. topic={Topic}, purpose={Purpose}", topicName, purposeNotification?.purpose);
                await topicEventSender.SendAsync(topicName, purposeNotification);

                _logger.LogInformation("Purpose change published to {Topic}", topicName);
                return value;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in SendPurposeChangeNotification for sot_guid={SotGuid}", purposeNotification?.sot_guid);
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
            _logger.LogInformation("QueryNotifications invoked.");
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                _logger.LogDebug("Authorized user for QueryNotifications: {UserId}", uid);

                DateTime endTargetTime = DateTime.Today.AddHours(23).AddMinutes(59).AddSeconds(59);
                DateTime startTargetTime = DateTime.Today.AddMonths(-1);

                long enddt = ((DateTimeOffset)endTargetTime).ToUnixTimeSeconds();
                long startdt = ((DateTimeOffset)startTargetTime).ToUnixTimeSeconds();

                query = context.notification.Where(i => (i.delete_dt == null || i.delete_dt == 0) && (i.date >= startdt && i.date <= enddt)).OrderByDescending(i => i.date);
                _logger.LogDebug("QueryNotifications built query with startdt={StartDt} enddt={EndDt}", startdt, enddt);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Exception in QueryNotifications.");
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
