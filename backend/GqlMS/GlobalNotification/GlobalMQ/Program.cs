using GlobalMQ.GqlTypes;
using IDMS.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configure logging from appsettings and add console/debug providers
builder.Logging.ClearProviders();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConsole();
builder.Logging.AddDebug();

builder.Services.AddDbContextPool<ApplicationNotificationDBContext>(options =>
    options.UseMySql(
        builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21)))
    // Keep EF Core SQL logging to console at Information level so it appears alongside other logs
    //.LogTo(Console.WriteLine, LogLevel.Information)
);

// Add services to the container.
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddHttpContextAccessor();

builder.Services
.AddGraphQLServer()
.RegisterDbContext<ApplicationNotificationDBContext>(DbContextKind.Synchronized)
.AddMutationType<MutationType>()
.AddQueryType<QueryType>()
.AddSubscriptionType<SubscriptionType>()
.AddInMemorySubscriptions()
.AddType<AnyType>() // Required for dynamic JSON
.AddFiltering()
.AddProjections()
.AddSorting()
.ModifyOptions(options =>
 {
     options.StrictValidation = false; // Allows dynamic types
 });

var app = builder.Build();

// Resolve a typed logger for the Program to use during startup
var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application starting up");

// Initialize the database connection
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationNotificationDBContext>();
    try
    {
        // Perform a simple operation to initialize the connection
        dbContext.Database.OpenConnection();
        logger.LogInformation("Database connection opened successfully.");
    }
    catch (Exception ex)
    {
        logger.LogError(ex, "Failed to open database connection.");
        throw;
    }
}

// Configure the HTTP request pipeline.
logger.LogInformation("Configuring HTTP pipeline. Environment: {env}", app.Environment.EnvironmentName);

if (app.Environment.IsDevelopment())
{
    logger.LogInformation("Development environment detected - enabling Swagger UI.");
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseWebSockets();
app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();
app.MapGraphQL();

logger.LogInformation("Application started and GraphQL endpoint mapped.");

app.Run();
