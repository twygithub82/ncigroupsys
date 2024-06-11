using System;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using Newtonsoft.Json;

namespace GraphQLConsoleApp
{
    class Program
    {
        static async Task Main(string[] args)
        {
            // Define the GraphQL query
            var query = @"
            query($message: EntityClass_MessageInput!) {
                sendMessage(message: $message) {
                  
                }
            }";

            // Define the variables for the query
            var variables = new
            {
                message = new
                {
                    event_id = DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString(),
                    event_name = "Hello, World!"
                    
                }
            };

            // Create the GraphQL request payload
            var requestPayload = new
            {
                query = query,
                variables = variables
            };

            // Serialize the payload to JSON
            var jsonPayload = JsonConvert.SerializeObject(requestPayload);

            // Define the URL of the GraphQL endpoint
            var url = "http://localhost:5114/graphql/";

            // Create an HttpClient instance
            using (var client = new HttpClient())
            {
                // Set the request content
                var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

                // Send the POST request
                var response = await client.PostAsync(url, content);

                // Read the response content
                var responseContent = await response.Content.ReadAsStringAsync();

                // Print the response content
                Console.WriteLine(responseContent);
            }
        }
    }
}