using AutoMapper;
using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.Customer.GqlTypes;
using IDMS.Customer.GqlTypes.LocalModel;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Parameter.GqlTypes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using Serilog;
using Serilog.Events;
using System.Text;


namespace IDMS.Master.Application
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Configure Serilog early so we capture startup logs
            Log.Logger = new LoggerConfiguration()
                .ReadFrom.Configuration(builder.Configuration)
                .Enrich.FromLogContext()
                .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
                .WriteTo.Console()
                //.WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
                .CreateLogger();

            // Replace default host logging with Serilog
            builder.Host.UseSerilog();
            builder.Logging.ClearProviders();
            builder.Logging.AddSerilog();

            try
            {
                Log.Information("Starting up IDMS.Master.Application");

                builder.Services.AddHttpContextAccessor();

                string connectionString = builder.Configuration.GetConnectionString("default");
                // Add services to the container.
                var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value?.ToString();
                var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value?.ToString();
                var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);
                string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "5";

                builder.Services.AddPooledDbContextFactory<ApplicationMasterDBContext>(o =>
                {
                    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                           mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(5),
                            errorNumbersToAdd: null)
                           .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
                        );

                    o.EnableSensitiveDataLogging(false);
                });

                var mappingConfig = new MapperConfiguration(cfg =>
                {
                    cfg.CreateMap<CustomerRequest, customer_company>();
                });

                IMapper mapper = mappingConfig.CreateMapper();
                builder.Services.AddSingleton(mapper);

                builder.Services.AddGraphQLServer()
                           .InitializeOnStartup(keepWarm: true)
                           .RegisterDbContext<ApplicationMasterDBContext>(DbContextKind.Pooled)
                           .AddQueryType<TemplateEstQuery>()
                           .AddTypeExtension<CustomerQuery>()
                           .AddMutationType<TemplateEstMutation>()
                           .AddTypeExtension<CustomerMutation>()
                           .AddTypeExtension<CleanningMethodMutation>()
                           .AddTypeExtension<CleaningMethodQuery>()
                           .AddFiltering()
                           .AddSorting()
                           .AddProjections()
                           .AddAuthorization()
                           .SetPagingOptions(new PagingOptions
                           {
                               MaxPageSize = 100
                           })
                           .AddInMemorySubscriptions();

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

                // Request logging middleware (Serilog)
                app.UseSerilogRequestLogging();

                Log.Information("Application built successfully");
                //GqlUtils.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

                app.UseHttpsRedirection();
                app.UseAuthentication();
                //app.UseWebSockets();//Subscription using websockets, must add this middleware
                app.MapGraphQL();

                Log.Information("Running web host");
                await app.RunAsync();
            }
            catch (Exception ex)
            {
                Log.Fatal(ex, "Host terminated unexpectedly");
                throw;
            }
            finally
            {
                Log.Information("Shutting down Serilog");
                Log.CloseAndFlush();
            }
        }
    }
}
