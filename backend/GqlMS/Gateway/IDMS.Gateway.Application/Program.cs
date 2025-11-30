using gateway_graphql_ms;
using gateway_graphql_ms.GqlTypes;
using HotChocolate.AspNetCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Threading.Tasks;
using static HotChocolate.ErrorCodes;

var builder = WebApplication.CreateBuilder(args);

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();
builder.Logging.SetMinimumLevel(LogLevel.Information);

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

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
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application starting up.");
logger.LogInformation("GraphQL server initializing. Environment: {env}", app.Environment.EnvironmentName);

app.UseHttpsRedirection();
app.UseAuthorization();
app.MapGraphQL();
app.Run();


async Task ConfigureServices(IServiceCollection services, ConfigurationManager configuration)
{
    // Bind configuration to strongly typed class
    bool allowIntrospection = bool.Parse(configuration.GetSection("AllowIntrospection").Value);
    var env = configuration.GetSection("Environment").Value ?? "DEV";
    var graphqlService = $"GraphQL_Service_{env}";

    var graphqlServiceSettings = configuration.GetSection(graphqlService)
            .Get<Dictionary<string, string>>();

    // Iterate over properties and register HTTP clients dynamically
    foreach (var service in graphqlServiceSettings)
    {
        services.AddHttpClient(service.Key.ToLower(), (provider, client) =>
        {
            client.BaseAddress = new Uri(service.Value);

            // Configure the HTTP client to forward the Bearer token
            var httpContextAccessor = provider.GetRequiredService<IHttpContextAccessor>();
            client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue(
                "Bearer",
                httpContextAccessor.HttpContext?.Request.Headers["Authorization"].ToString().Replace("Bearer ", "")
            );
        });
        // services.AddHttpClient(service.Key.ToLower(), client => client.BaseAddress = new Uri(service.Value));
    }

    var server = services.AddGraphQLServer().AllowIntrospection(allowIntrospection);
    foreach (var service in graphqlServiceSettings)
    {
        try
        {
            //var t = Task.Run(() => server.AddRemoteSchema(service.Key.ToLower()));
            server.AddRemoteSchema(service.Key.ToLower());
            //await t;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
        }
    }

    //localSDL.Add("local", "https://tlxidmsstorage.blob.core.windows.net/files/config/schema.graphql");
    //server.AddRemoteSchemaFromFile("SDL", "graphql/schema.graphql");
    //server.AddRemoteSchemaFromFile("SDL", "https://tlxidmsstorage.blob.core.windows.net/files/config/schema.graphql");
    server.InitializeOnStartup(keepWarm: true);

    // Add other services and configurations as needed

    // Register IHttpContextAccessor for token forwarding
    services.AddHttpContextAccessor();
}