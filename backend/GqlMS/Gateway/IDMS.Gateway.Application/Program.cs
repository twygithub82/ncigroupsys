using gateway_graphql_ms;
using gateway_graphql_ms.GqlTypes;
using HotChocolate.AspNetCore;
using Microsoft.Extensions.Configuration;
using static HotChocolate.ErrorCodes;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

ConfigureServices(builder.Services, builder.Configuration);
//var server = builder.Services.AddGraphQLServer("local");
//server.AddQueryType<QueryType>();
//server.AddTypeExtensionsFromFile("./graphql/schema.graphql");
//server.InitializeOnStartup();
//server.AddSubscriptionType<SubscriptionType>();
//server.RenameType("Message", "MessageLocal");
//server.AddInMemorySubscriptions();


//server = builder.Services.AddGraphQLServer();
//server.AddLocalSchema("local");




var app = builder.Build();

app.UseHttpsRedirection();

app.UseAuthorization();

//app.MapControllers();
//app.UseWebSockets();

app.UseRouting()
          //.UseWebSockets()
          .UseEndpoints(endpoints =>
          {
              endpoints.MapGraphQL();
          });

app.Run();


void ConfigureServices(IServiceCollection services, ConfigurationManager configuration)
{
    // Bind configuration to strongly typed class
    var graphqlServiceSettings = configuration.GetSection("GraphQL_Service")
            .Get<Dictionary<string, string>>();

    // Iterate over properties and register HTTP clients dynamically
    foreach (var service in graphqlServiceSettings)
    {
        services.AddHttpClient(service.Key.ToLower(), client => client.BaseAddress = new Uri(service.Value));
    }

    var server = services.AddGraphQLServer();
    foreach (var service in graphqlServiceSettings)
    {
        try
        {
            //Task.Run(() => server.AddRemoteSchema(service.Key.ToLower()));
            server.AddRemoteSchema(service.Key.ToLower());
            
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
        
    }
    //server.AddLocalSchema("local");
    server.InitializeOnStartup();

    // Add other services and configurations as needed
}