using AutoMapper;
using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.Booking.GqlTypes;
using IDMS.Gate.GqlTypes;
using IDMS.Survey.GqlTypes;
using IDMS.Survey.GqlTypes.LocalModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.StoringOrder.GqlTypes;
using IDMS.StoringOrder.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Shared;

namespace IDMS.Inventory
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
            builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
                o.EnableSensitiveDataLogging(false);
            });

            var mappingConfig = new MapperConfiguration(cfg =>
            {

                cfg.CreateMap<InGateSurveyRequest, in_gate_survey>()
                    .ForMember(dest => dest.guid, opt => opt.Ignore());

                cfg.CreateMap<OutGateSurveyRequest, out_gate_survey>()
                    .ForMember(dest => dest.guid, opt => opt.Ignore());

                cfg.CreateMap<StoringOrderTankRequest, storing_order_tank>();
                cfg.CreateMap<StoringOrderRequest, storing_order>();

                cfg.CreateMap<tank_info, tank_info>()
                    .ForMember(dest => dest.guid, opt => opt.Ignore())
                    .ForMember(dest => dest.create_dt, opt => opt.Ignore())
                    .ForMember(dest => dest.create_by, opt => opt.Ignore());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);
            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup()
                       .RegisterDbContext<ApplicationInventoryDBContext>(DbContextKind.Pooled)
                       .AddQueryType<InventoryQuery>()
                       .AddMutationType<InventoryMutation>()
                       .AddTypeExtension<SOQuery>()
                       .AddTypeExtension<ReleaseOrderQuery>()
                       .AddTypeExtension<SchedulingQuery>()
                       .AddTypeExtension<BookingQuery>()
                       .AddTypeExtension<InGateQuery>()
                       .AddTypeExtension<OutGateQuery>()
                       .AddTypeExtension<SurveyQuery>()
                       .AddTypeExtension<SOMutation>()
                       .AddTypeExtension<SOTMutation>()
                       .AddTypeExtension<SchedulingMutation>()
                       .AddTypeExtension<ReleaseOrderMutation>()
                       .AddTypeExtension<BookingMutation>()
                       .AddTypeExtension<InGateMutation>()
                       .AddTypeExtension<OutGateMutation>()
                       .AddTypeExtension<IGSurveyMutation>()
                       .AddTypeExtension<OGSurveyMutation>()
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
