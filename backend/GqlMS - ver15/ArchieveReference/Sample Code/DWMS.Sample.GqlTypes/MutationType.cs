using HotChocolate;
using HotChocolate.Subscriptions;
using Newtonsoft.Json.Linq;

namespace DWMS.Sample.GqlTypes
{
    public class MutationType
    {

        public async Task<int> UpdateCourse([Service] ITopicEventSender topicEventSender, string updated_Id, int age)
        {

            Course course = new Course()
            {
                Id = updated_Id,
                Name = "Edmund",
                Age = 24
            };

            string num = "";
            if (age % 2 == 0)
                num = "true";

            string updateCourseTopic = $"CourseUpdated:{updated_Id}";
            await topicEventSender.SendAsync(updateCourseTopic, course);


            //JObject jo = new JObject()
            //{
            //    ["name"] = "Edmund",
            //    ["age"] = 23,
            //    ["Id"] = updated_Id
            //};

            //string CourseTopic = $"CourseUpdated_{updated_Id}";
            //await topicEventSender.SendAsync(CourseTopic, "book");


            return 1;

        }
    }
}
    