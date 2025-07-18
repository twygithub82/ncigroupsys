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
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IDMS.Inventory.Application;
using Pomelo.EntityFrameworkCore.MySql.Internal;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;

namespace IDMS.Inventory
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();
            
            // Add services to the container.
            string connectionString = builder.Configuration.GetConnectionString("default");
            var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
            var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
            var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);
            string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";


            connectionString += ";ConnectionIdlePingTime=30;";   // 30 seconds
                                //"Pooling=true;" +                 // Enable pooling
                                //"MinimumPoolSize=5;" +            // Minimum connections to maintain
                                //"MaximumPoolSize=100";            // Maximum connections in pool
                                //                                  //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));

            //builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(o =>
            //{
            //    o.UseMySql(
            //            connectionString,
            //            ServerVersion.AutoDetect(connectionString),
            //            mysqlOptions =>
            //            {
            //                // Transient error handling
            //                mysqlOptions.EnableRetryOnFailure(
            //                    maxRetryCount: 5,
            //                    maxRetryDelay: TimeSpan.FromSeconds(30),
            //                    errorNumbersToAdd: new List<int> { 1205, 1213, 2006, 2013, 1042 });

            //                // Connection resilience settings
            //                mysqlOptions.EnableCommandRetries(true);
            //                mysqlOptions.DefaultCommandTimeout(60); // 60 second command timeout

            //                // Connection validation
            //                mysqlOptions.EnableConnectionPreParing(true);
            //                mysqlOptions.ConnectionPreparationTimeout(TimeSpan.FromSeconds(5));

            //                // Connection lifetime management
            //                mysqlOptions.ConnectionIdleTimeout(TimeSpan.FromMinutes(10));
            //                mysqlOptions.ConnectionIdlePingTime(TimeSpan.FromMinutes(3));

            //                // Custom execution strategy
            //                mysqlOptions.ExecutionStrategy(dependencies =>
            //                    new CustomMySqlExecutionStrategy(dependencies));
            //            })
            //        .EnableDetailedErrors(true)
            //        .EnableSensitiveDataLogging(false)
            //        .LogTo(Console.WriteLine, LogLevel.Information);
            //});
            builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                    mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                                  maxRetryCount: 5,
                                  maxRetryDelay: TimeSpan.FromSeconds(10),
                                  errorNumbersToAdd: null)
                     .ExecutionStrategy(c => new MySqlExecutionStrategy(c))

                    ).LogTo(Console.WriteLine);
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
                    .ForMember(dest => dest.storing_order_tank, opt => opt.Ignore())
                    .ForMember(dest => dest.guid, opt => opt.Ignore())
                    .ForMember(dest => dest.create_dt, opt => opt.Ignore())
                    .ForMember(dest => dest.create_by, opt => opt.Ignore());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);
            builder.Services.AddHostedService<DbKeepAliveService>();
            //builder.Services.AddHostedService<KeepAliveService>();
            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup(keepWarm: true)
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
                       .AddAuthorization()
                       .SetPagingOptions(new PagingOptions
                       {
                           MaxPageSize = 100
                       })
                       .AddInMemorySubscriptions();// Must add this as well for websocket

            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

            }).AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    ValidAudience = JWT_validAudience,
                    ValidIssuer = JWT_validIssuer,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_secretKey))
                };
            });

            //builder.Services.AddCors(options =>
            //{
            //    options.AddPolicy("AllowAll",
            //        builder => builder
            //            .AllowAnyOrigin()
            //            .AllowAnyMethod()
            //            .AllowAnyHeader());
            //});

            var app = builder.Build();
            //Specially created to solve slow after idle for sometime
            //GqlUtils.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

            app.UseHttpsRedirection();
            app.UseAuthentication();
            //app.UseCors("AllowAll");
            app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            app.Run();
        }
    }
}
