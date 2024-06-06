using DWMS.Cleaning.GqlTypes;
using DWMS.DB.Implementation;
using DWMS.DB.Interface;
using DWMS.DBAccess;
using DWMS.DBAccess.Interface;

namespace DWMS.CleaningMS
{
    public class Program
    {
        //private static iDatabase mySqlDb;
        public static void Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.

            //builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();
            //builder.Services.AddScoped<IServiceProvider, ServiceProvider>();
            builder.Services.AddSingleton<iDBAccess, DBAccessService>();
            builder.Services.AddTransient<iDatabase, MySQLWrapper>();

            
            builder.Services.AddGraphQLServer()
                            .RegisterService<iDBAccess>()
                            .RegisterService<iDatabase>()
                            .AddQueryType<QueryType>()
                            .AddSubscriptionType<SubscriptionType>()
                            .AddMutationType<MutationType>()
                            .AddInMemorySubscriptions();// Must add this as well for websocket

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}

            //app.UseHttpsRedirection();

            //app.UseAuthorization();

            app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            //app.MapControllers();
            app.Run();
        }
    }
}
