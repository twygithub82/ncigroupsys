using GlobalMQ.GqlTypes;
using IDMS.Models.DB;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContextPool<ApplicationNotificationDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
 new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

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

// Initialize the database connection
using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<ApplicationNotificationDBContext>();
    // Perform a simple query to initialize the connection
    //dbContext.Database.CanConnect();
    dbContext.Database.OpenConnection();
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseWebSockets();
app.UseHttpsRedirection();

//app.UseAuthorization();

//app.MapControllers();
app.MapGraphQL();

app.Run();
