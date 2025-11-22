using GlobalMQ.GqlTypes;
using IDMS.Models.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Configure logging providers and levels
builder.Logging.ClearProviders();
builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
builder.Logging.AddConsole();
builder.Logging.AddDebug();
builder.Logging.SetMinimumLevel(LogLevel.Information);

builder.Services.AddDbContextPool<ApplicationNotificationDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
        new MySqlServerVersion(new Version(8, 0, 21)))
        //.LogTo(Console.WriteLine)
);

// Add services to the container.




//builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddHttpContextAccessor();

builder.Services.AddGraphQLServer()
      .RegisterDbContext<ApplicationNotificationDBContext>(DbContextKind.Synchronized)
    .AddMutationType<MutationType>()
    .AddQueryType<QueryType>()
    .AddSubscriptionType<SubscriptionType>()
    .AddInMemorySubscriptions()
    .AddFiltering()
    .AddProjections()
    .AddSorting();


var app = builder.Build();

var logger = app.Services.GetRequiredService<ILogger<Program>>();
logger.LogInformation("Application starting up.");

// Initialize the database connection
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationNotificationDBContext>();
    try
    {
        logger.LogInformation("Opening database connection...");
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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();

//// Basic request logging middleware
//app.Use(async (context, next) =>
//{
//    var reqLogger = context.RequestServices.GetRequiredService<ILoggerFactory>().CreateLogger("HTTP");
//    reqLogger.LogInformation("Request: {Method} {Path}{QueryString}", context.Request.Method, context.Request.Path, context.Request.QueryString);
//    try
//    {
//        await next();
//        reqLogger.LogInformation("Response: {Method} {Path} => {StatusCode}", context.Request.Method, context.Request.Path, context.Response.StatusCode);
//    }
//    catch (Exception ex)
//    {
//        reqLogger.LogError(ex, "Unhandled exception while processing {Method} {Path}", context.Request.Method, context.Request.Path);
//        throw;
//    }
//});

app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();
app.MapGraphQL();

try
{
    logger.LogInformation("Application started and GraphQL endpoint mapped.");
    app.Run();
}
catch (Exception ex)
{
    logger.LogCritical(ex, "Host terminated unexpectedly.");
    throw;
}
finally
{
    logger.LogInformation("Application shutting down.");
}
