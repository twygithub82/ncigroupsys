// See https://aka.ms/new-console-template for more information
using System;
using System.Reactive.Linq;
using System.Threading.Tasks;
using GraphQL;
using GraphQL.Client.Abstractions;
using GraphQL.Client.Http;
using GraphQL.Client.Serializer.Newtonsoft;

var subscriptionEndpoint = "wss://tlx-idms-global-notification.azurewebsites.net/graphql";

var graphQLClient = new GraphQLHttpClient(new GraphQLHttpClientOptions
{
    EndPoint = new Uri(subscriptionEndpoint),
    WebSocketEndPoint = new Uri(subscriptionEndpoint)
}, new NewtonsoftJsonSerializer());

var subscriptionRequest = new GraphQLRequest
{
    Query = @"
                subscription {
                   messageReceived {
                    event_id
                    event_name
                  }
                }"
};

var observable = graphQLClient.CreateSubscriptionStream<dynamic>(subscriptionRequest);

var subscription = observable.Subscribe(response =>
{
    if (response.Errors != null)
    {
        Console.WriteLine($"Error: {string.Concat(", ", response.Errors)}");
    }
    else
    {
        Console.WriteLine("New message received:");
        Console.WriteLine($"ID: {response.Data.newMessage.id}");
        Console.WriteLine($"Content: {response.Data.newMessage.content}");
        Console.WriteLine($"Author: {response.Data.newMessage.author}");
    }
}, exception =>
{
    Console.WriteLine($"Subscription error: {exception.Message}");
});

Console.WriteLine("Press any key to exit...");
Console.ReadKey();

subscription.Dispose();
