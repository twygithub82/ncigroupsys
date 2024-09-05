using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.EntityFrameworkCore;


namespace IDMS.MasterMS
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();

            // Add services to the container.
            var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
            var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
            var JWT_secretKey = "";//await dbWrapper.GetJWTKey(builder.Configuration["DBService:queryUrl"]);


            string connectionString = builder.Configuration.GetConnectionString("default");
            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<ApplicationMasterDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
                o.EnableSensitiveDataLogging(false);
            });


            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup()
                       .RegisterDbContext<ApplicationMasterDBContext>(DbContextKind.Pooled)
                       .AddQueryType<TemplateEstQuery>()
                       //.AddTypeExtension<BookingQuery>()
                       //.AddTypeExtension<SchedulingQuery>()
                       //.AddTypeExtension<ReleaseOrderQuery>()
                       //.AddSubscriptionType<BookingSubscription>()
                       .AddMutationType<TemplateEstMutation>()
                       //.AddTypeExtension<ReleaseOrderMutation>()
                       //.AddTypeExtension<SchedulingMutation>()
                       .AddFiltering()
                       .AddSorting()
                       .AddProjections()
                       .SetPagingOptions(new PagingOptions
                       {
                           MaxPageSize = 100
                       })
                       .AddInMemorySubscriptions();// Must add this as well for websocket

            var app = builder.Build();

            //// Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}

            //app.UseHttpsRedirection();
            //app.UseAuthorization();
            //app.MapControllers();

            app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();

            app.Run();
        }
    }
}
