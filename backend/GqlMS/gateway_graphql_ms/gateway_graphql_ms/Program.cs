using gateway_graphql_ms;
using HotChocolate.AspNetCore;
using Microsoft.Extensions.Configuration;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();

ConfigureServices(builder.Services,builder.Configuration);

var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();
app.UseRouting()
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

    foreach (var service in graphqlServiceSettings)
    {
        services.AddGraphQLServer().AddRemoteSchema(service.Key.ToLower());
    
    }


    // Add other services and configurations as needed
}