using AutoMapper;
using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.Customer.GqlTypes;
using IDMS.Customer.GqlTypes.LocalModel;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.EntityFrameworkCore;


namespace IDMS.Master.Application
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


            var mappingConfig = new MapperConfiguration(cfg =>
            {

                //cfg.CreateMap<InGateSurveyRequest, in_gate_survey>()
                //    .ForMember(dest => dest.guid, opt => opt.Ignore());

                //cfg.CreateMap<OutGateSurveyRequest, out_gate_survey>()
                //    .ForMember(dest => dest.guid, opt => opt.Ignore());

                cfg.CreateMap<CustomerRequest, customer_company>();
                //cfg.CreateMap<StoringOrderRequest, storing_order>();
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup()
                       .RegisterDbContext<ApplicationMasterDBContext>(DbContextKind.Pooled)
                       .AddQueryType<TemplateEstQuery>()
                       .AddTypeExtension<CustomerQuery>()
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
