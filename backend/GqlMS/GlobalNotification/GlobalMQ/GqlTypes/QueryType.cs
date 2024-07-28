using HotChocolate.Data;
using HotChocolate.Subscriptions;
using IDMS.Models;
using IDMS.Models.DB;
using IDMS.Models.GqlTypes;
using IDMS.Models.Notification;
using IDMS.Models.Package;

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
                DateTime endTargetTime = DateTime.Today.AddHours(12).AddMinutes(59).AddSeconds(59);
                DateTime startTargetTime = DateTime.Today.AddMonths(-1);
                long enddt = new DateTimeOffset(endTargetTime, TimeSpan.Zero).ToUnixTimeSeconds();
                long startdt = new DateTimeOffset(startTargetTime, TimeSpan.Zero).ToUnixTimeSeconds();
                
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
