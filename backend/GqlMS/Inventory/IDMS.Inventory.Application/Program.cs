using AutoMapper;
using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.Booking.GqlTypes;
using IDMS.Gate.GqlTypes;
using IDMS.Inventory.Application;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.StoringOrder.GqlTypes;
using IDMS.StoringOrder.GqlTypes.LocalModel;
using IDMS.Survey.GqlTypes;
using IDMS.Survey.GqlTypes.LocalModel;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using System.Text;

namespace IDMS.Inventory
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            // Configure host & logging first
            var builder = WebApplication.CreateBuilder(args);

            // Configure logging from configuration and add console + debug providers
            builder.Logging.ClearProviders();
            builder.Logging.AddConfiguration(builder.Configuration.GetSection("Logging"));
            builder.Logging.AddConsole();
            builder.Logging.AddDebug();
            ILogger<Program>? logger = null;

            builder.Services.AddHttpContextAccessor();
            
            try
            {
                // Add services to the container.
                string connectionString = builder.Configuration.GetConnectionString("default");
                var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value?.ToString();
                var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value?.ToString();
                var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);
                string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";
                var gNotificationUrl = builder.Configuration.GetSection("GlobalNotificationURL").Value ?? "";   

                connectionString += ";ConnectionIdlePingTime=30;";   // 30 seconds


                builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(o =>
                {
                    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                        mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                                      maxRetryCount: 5,
                                      maxRetryDelay: TimeSpan.FromSeconds(10),
                                      errorNumbersToAdd: null)
                         .ExecutionStrategy(c => new MySqlExecutionStrategy(c))

                        );//.LogTo(msg => efLogger.LogInformation(msg), LogLevel.Information);
                    o.EnableSensitiveDataLogging(false);
                });

                //var mappingConfig = new MapperConfiguration(cfg =>
                //{

                //    cfg.CreateMap<InGateSurveyRequest, in_gate_survey>()
                //        .ForMember(dest => dest.guid, opt => opt.Ignore());

                //    cfg.CreateMap<OutGateSurveyRequest, out_gate_survey>()
                //        .ForMember(dest => dest.guid, opt => opt.Ignore());

                //    cfg.CreateMap<StoringOrderTankRequest, storing_order_tank>();
                //    cfg.CreateMap<StoringOrderRequest, storing_order>();

                //    //cfg.CreateMap<tank_info, tank_info>()
                //    //    .ForMember(dest => dest.storing_order_tank, opt => opt.Ignore())
                //    //    .ForMember(dest => dest.guid, opt => opt.Ignore())
                //    //    .ForMember(dest => dest.create_dt, opt => opt.Ignore())
                //    //    .ForMember(dest => dest.create_by, opt => opt.Ignore());
                //});



                var loggerFactory = LoggerFactory.Create(builder => { });
                var mappingConfig = new MapperConfiguration(cfg =>
                {
                    cfg.AddProfile<MapperProfile>();
                }, loggerFactory);

                //mappingConfig.AssertConfigurationIsValid();
                IMapper mapper = mappingConfig.CreateMapper();    
                builder.Services.AddSingleton(mapper);

                //builder.Services.AddHostedService<DbKeepAliveService>();
                builder.Services.AddHostedService<KeepAliveService>();
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

                var app = builder.Build();
                logger = app.Services.GetRequiredService<ILogger<Program>>();
                logger.LogInformation("Application built; starting middleware.");

                logger?.LogInformation($"Dabatase Connection: {connectionString.Split(";")[0]}");
                logger?.LogInformation($"Notification Url: {gNotificationUrl}");

                //Specially created to solve slow after idle for sometime
                //GqlUtils.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

                app.UseHttpsRedirection();
                app.UseAuthentication();
                //app.UseCors("AllowAll");
                app.UseWebSockets();//Subscription using websockets, must add this middleware
                app.MapGraphQL();

                logger?.LogInformation("Starting web host (GraphQL mapped).");
                app.Run();
            }
            catch (Exception ex)
            {
                logger?.LogCritical(ex, "Application start-up failed");
                throw;
            }
            finally
            {
                logger?.LogInformation("Inventory application stopped.");
            }
        }
    }
}
