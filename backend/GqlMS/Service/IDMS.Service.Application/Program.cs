using AutoMapper;
using HotChocolate.Types.Pagination;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Service.GqlTypes.DB;
using HotChocolate.Data;
using IDMS.Repair.GqlTypes;
using IDMS.Residue.GqlTypes;
using IDMS.Cleaning.GqlTypes;
using IDMS.Service.GqlTypes;
using IDMS.Repair;
using IDMS.Steaming.GqlTypes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using Microsoft.Extensions.Logging;

namespace IDMS.ServiceMS
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();

            // Configure logging
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.SetMinimumLevel(LogLevel.Information);

            string connectionString = builder.Configuration.GetConnectionString("default");
            string notificationUrl = builder.Configuration.GetSection("GlobalNotificationURL").Value.ToString();

            // Add services to the container.
            var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
            var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
            var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);
            string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";

            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<ApplicationServiceDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                            mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                                          maxRetryCount: 5,
                                          maxRetryDelay: TimeSpan.FromSeconds(10),
                                          errorNumbersToAdd: null)
                            .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
                            );//.LogTo(Console.WriteLine);
            });


            var loggerFactory = LoggerFactory.Create(builder => { });
            var mappingConfig = new MapperConfiguration(cfg =>
            {
            }, loggerFactory);



            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup(keepWarm: true)
                       .RegisterDbContext<ApplicationServiceDBContext>(DbContextKind.Pooled)
                       .AddQueryType<ServiceQuery>()
                       .AddMutationType<ServiceMutation>()
                       .AddTypeExtension<RepairQuery>()
                       .AddTypeExtension<RepairMutation>()
                       .AddTypeExtension<ResidueQuery>()
                       .AddTypeExtension<ResidueMutation>()
                       .AddTypeExtension<CleaningQuery>()
                       .AddTypeExtension<CleaningMutation>()
                       .AddTypeExtension<SteamingQuery>()
                       .AddTypeExtension<SteamingMutation>()
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

            //// Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}
            var app = builder.Build();

            // Resolve logger and log startup information
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Application starting up.");
            logger.LogInformation("GraphQL server initializing. Environment: {env}", app.Environment.EnvironmentName);
            logger.LogInformation($"Using database connection string: {connectionString.Split(";")[0]}");
            logger.LogInformation($"Global Notification URL: {notificationUrl}");


            //Specially created to solve slow after idle for sometime
            //GqlUtils.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));
            GqlUtils.Initialize(app.Services.GetRequiredService<ILoggerFactory>());

            app.UseHttpsRedirection();
            app.UseAuthentication();
            //app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();

            try
            {
                logger.LogInformation("Listening and serving GraphQL requests.");
                app.Run();
            }
            catch (Exception ex)
            {
                logger.LogCritical(ex, "Host terminated unexpectedly.");
                throw;
            }
            finally
            {
                logger.LogInformation("Application shutdown complete.");
            }
        }
    }
}
