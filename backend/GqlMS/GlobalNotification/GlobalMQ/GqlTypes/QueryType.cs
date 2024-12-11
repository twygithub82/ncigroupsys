using GlobalMQ.LocalModel;
using HotChocolate.Data;
using HotChocolate.Subscriptions;
using IDMS.Models;
using IDMS.Models.DB;
using IDMS.Models.GqlTypes;
using IDMS.Models.Notification;
using IDMS.Models.Package;
using System;

namespace GlobalMQ.GqlTypes
{
    public class QueryType
    {

        public async Task<string> SendMessage(Message message, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                await topicEventSender.SendAsync(nameof(SubscriptionType.MessageReceived), message);
                return value;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<string> SendJobNotification(JobNotification jobNotification, int type, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
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

                await topicEventSender.SendAsync(topicName, jobNotification);
                return value;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<string> SendPurposeChangeNotification(PurposeNotification purposeNotification, [Service] ITopicEventSender topicEventSender)
        {
            string value = "ok";
            try
            {
                //string prefix = "On";
                //string methodName = "";
                //string topicName = "";

                //if (type == JobNotificationType.START_JOB)
                //{
                //methodName = nameof(SubscriptionType.JobStarted);
                //topicName = $"{prefix}{methodName}_{purposeNotification.job_order_guid}";
                //}
                //else if (type == JobNotificationType.STOP_JOB)
                //{
                //    methodName = nameof(SubscriptionType.JobStopped);
                //    topicName = $"{prefix}{methodName}_{purposeNotification.job_order_guid}";
                //}
                //else if (type == JobNotificationType.COMPLETE_JOB)
                //{
                //    methodName = nameof(SubscriptionType.JobCompleted);
                //    topicName = $"{prefix}{methodName}_{purposeNotification.job_order_guid}";
                //}
                //else if (type == JobNotificationType.COMPLETE_ITEM)
                //{
                //    methodName = nameof(SubscriptionType.JobStopped);
                //    topicName = $"{prefix}{methodName}_{purposeNotification.item_guid}_{purposeNotification.job_type}";
                //}

                //await topicEventSender.SendAsync(topicName, purposeNotification);
                await topicEventSender.SendAsync(nameof(SubscriptionType.OnPurposeChanged), purposeNotification);
                return value;
            }
            catch (Exception ex)
            {
                throw ex;
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
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                DateTime endTargetTime = DateTime.Today.AddHours(23).AddMinutes(59).AddSeconds(59);
                DateTime startTargetTime = DateTime.Today.AddMonths(-1);

                long enddt = ((DateTimeOffset)endTargetTime).ToUnixTimeSeconds();
                long startdt = ((DateTimeOffset)startTargetTime).ToUnixTimeSeconds();

                query = context.notification.Where(i => (i.delete_dt == null || i.delete_dt == 0) && (i.date >= startdt && i.date <= enddt)).OrderByDescending(i => i.date); ;



            }
            catch
            {
                throw;
            }

            return query;
        }
    }
}
