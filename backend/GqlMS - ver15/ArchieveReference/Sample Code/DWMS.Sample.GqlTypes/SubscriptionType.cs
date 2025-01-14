using HotChocolate.Execution;
using HotChocolate.Subscriptions;
using HotChocolate;
using HotChocolate.Types;
using Newtonsoft.Json.Linq;

namespace DWMS.Sample.GqlTypes
{
    public class ClasSubscriptionTypes1
    {
        //[Subscribe]
        //public async ValueTask<ISourceStream<Course>> CourseUpdated(string Id, [Service] ITopicEventReceiver topicEventReceiver)
        //{
        //    string topicName = $"{Id}_{CourseUpdated}";

        //    return await topicEventReceiver.SubscribeAsync<Course>(topicName);
        //}


        // The topic argument must be in the format "{argument}"
        // Using string interpolation and nameof is a good way to reference the argument name properly
        //[Topic($"CourseUpdated_*")]
        [Subscribe]
        public string BookPublished([EventMessage] string book)
        {
            return book;
        }



        public ValueTask<ISourceStream<Course>> CourseUpdated(string Id, [Service] ITopicEventReceiver receiver)
        {
            //string t = ($"{{{nameof(Id).ToString()}}})_{{{nameof(status).ToString()}}}");

            //string topicName = $"{Id}_{status}_{nameof(CourseUpdated)}";
            //string wc = "*";
            string topicName = $"{nameof(CourseUpdated)}:{Id}";
            return receiver.SubscribeAsync<Course>(topicName);
        }


        [Subscribe(With = nameof(CourseUpdated))]
        public Course OnCourseUpdate([EventMessage] Course updateCourse)
            => updateCourse;
    }
}
