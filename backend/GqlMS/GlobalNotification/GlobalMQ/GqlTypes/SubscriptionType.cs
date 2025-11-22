using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using IDMS.Models;
using IDMS.Models.Notification;


namespace GlobalMQ.GqlTypes
{
    public class SubscriptionType
    {
        string prefix = "On";

        [Subscribe]
        public Message_r1 MessageReceived_r1([EventMessage] Message_r1 message) => message;

        [Subscribe]
        public Message MessageReceived([EventMessage] Message message) => message;

        [Subscribe]
        public notification NotificationTriggered([EventMessage] notification notification) => notification;

        [Subscribe(With = nameof(PurposeChanged))]
        public PurposeNotification OnPurposeChanged([EventMessage] PurposeNotification purposeNotification) 
            => purposeNotification;

        public ValueTask<ISourceStream<PurposeNotification>> PurposeChanged(string sot_guid, [Service] ITopicEventReceiver receiver)
        {

            string topicName = $"{prefix}{nameof(PurposeChanged)}_{sot_guid}";
            return receiver.SubscribeAsync<PurposeNotification>(topicName);
        }

        public ValueTask<ISourceStream<JobNotification>> JobStarted(string job_order_guid, [Service] ITopicEventReceiver receiver)
        {
            
            string topicName = $"{prefix}{nameof(JobStarted)}_{job_order_guid}";
            return receiver.SubscribeAsync<JobNotification>(topicName);
        }

        [Subscribe(With = nameof(JobStarted))]
        public JobNotification OnJobStarted([EventMessage] JobNotification jobNotification)
            => jobNotification;

        public ValueTask<ISourceStream<JobNotification>> JobStopped(string job_order_guid, [Service] ITopicEventReceiver receiver)
        {
            //string prefix = "On";
            string topicName = $"{prefix}{nameof(JobStopped)}_{job_order_guid}";
            return receiver.SubscribeAsync<JobNotification>(topicName);
        }

        [Subscribe(With = nameof(JobStopped))]
        public JobNotification OnJobStopped([EventMessage] JobNotification jobNotification)
            => jobNotification;

        public ValueTask<ISourceStream<JobNotification>> JobCompleted(string job_order_guid, [Service] ITopicEventReceiver receiver)
        {
            //string prefix = "On";
            string topicName = $"{prefix}{nameof(JobCompleted)}_{job_order_guid}";
            return receiver.SubscribeAsync<JobNotification>(topicName);
        }

        [Subscribe(With = nameof(JobCompleted))]
        public JobNotification OnJobCompleted([EventMessage] JobNotification jobNotification)
            => jobNotification;


        public ValueTask<ISourceStream<JobNotification>> JobItemCompleted(string item_guid, string job_type, [Service] ITopicEventReceiver receiver)
        {
            //string prefix = "On";
            string topicName = $"{prefix}{nameof(JobItemCompleted)}_{item_guid}_{job_type}";
            return receiver.SubscribeAsync<JobNotification>(topicName);
        }

        [Subscribe(With = nameof(JobItemCompleted))]
        public JobNotification OnJobItemCompleted([EventMessage] JobNotification jobNotification)
            => jobNotification;

        public ValueTask<ISourceStream<JobNotification>> JobStartStop(string team_guid, [Service] ITopicEventReceiver receiver)
        {
            //string prefix = "On";
            string topicName = $"{prefix}{nameof(JobStartStop)}_{team_guid}";
            return receiver.SubscribeAsync<JobNotification>(topicName);
        }

        [Subscribe(With = nameof(JobStartStop))]
        public JobNotification OnJobStartStop([EventMessage] JobNotification jobNotification)
            => jobNotification;
    }
}
