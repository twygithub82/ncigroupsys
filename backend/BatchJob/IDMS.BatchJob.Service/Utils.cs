using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.BatchJob.Service
{
    internal class Utils
    {
        public static async Task AddAndTriggerStaffNotification(string notificationUrl, int id, string module_cv, string message, string notification_uid)
        {
            try
            {
                string httpURL = $"{notificationUrl}";
                if (!string.IsNullOrEmpty(httpURL))
                {
                    var mutation = @"
                    mutation($message: notificationInput!) {
                        addNotification(newNotification: $message) {
                        }
                    }";

                    // Define the variables for the query
                    var variables = new
                    {
                        message = new
                        {
                            id = id,
                            module_cv = module_cv,
                            message = message,
                            notification_uid = notification_uid
                        }
                    };

                    // Create the GraphQL request payload
                    var requestPayload = new
                    {
                        query = mutation,
                        variables = variables
                    };

                    // Serialize the payload to JSON
                    var jsonPayload = JsonConvert.SerializeObject(requestPayload);

                    using (var httpClient = new HttpClient())
                    {
                        var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                        var data = await httpClient.PostAsync(httpURL, content);
                        Console.WriteLine(data);
                    }

                    //HttpClient _httpClient = new();
                    ////string queryStatement = JsonConvert.SerializeObject(query);
                    //var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");
                    //var data = await _httpClient.PostAsync(httpURL, content);
                    //Console.WriteLine(data);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
            }
        }
    }
}
