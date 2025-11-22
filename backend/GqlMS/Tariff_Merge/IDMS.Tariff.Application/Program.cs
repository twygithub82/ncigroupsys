using IDMS.Parameter.CleaningProcedure.Class;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using IDMS.Models.Tariff.GqlTypes;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using IDMS.Models.Package.GqlTypes;
using Serilog;
using Serilog.Events;

var builder = WebApplication.CreateBuilder(args);

// Configure Serilog from configuration and add console + file sink as default
Log.Logger = new LoggerConfiguration()
    .ReadFrom.Configuration(builder.Configuration)
    .Enrich.FromLogContext()
    .MinimumLevel.Override("Microsoft", LogEventLevel.Information)
    .WriteTo.Console()
    //.WriteTo.File("Logs/log-.txt", rollingInterval: RollingInterval.Day)
    .CreateLogger();

builder.Host.UseSerilog();

try
{
    Log.Information("Starting application");

    string connectionString = builder.Configuration.GetConnectionString("default");
    var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
    var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
    var JWT_secretKey = await dbWrapper.GetJWTKey(connectionString);
    string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";

    builder.Services.AddPooledDbContextFactory<ApplicationTariffDBContext>(o =>
    {
        o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
        mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                      maxRetryCount: 5,
                      maxRetryDelay: TimeSpan.FromSeconds(10),
                      errorNumbersToAdd: null)
        .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
        );//.LogTo(message => Log.Information(message)); // route EF Core messages to Serilog

        o.EnableSensitiveDataLogging(false);
    });

    builder.Services.AddHttpContextAccessor();
    builder.Services.AddGraphQLServer()
                    .InitializeOnStartup(keepWarm: true)
                    .RegisterDbContext<ApplicationTariffDBContext>(DbContextKind.Pooled)
                    .AddAuthorization()
                    .AddQueryType<TariffQuery>()
                    .AddMutationType<TariffMutation>()
                    .AddTypeExtension<PackageQuery>()
                    .AddTypeExtension<PackageMutation>()
                    .AddFiltering()
                    .AddProjections()
                    .SetPagingOptions(new HotChocolate.Types.Pagination.PagingOptions
                    {
                        MaxPageSize = 100
                    })
                   .AddSorting();

    builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
    })
          .AddJwtBearer(options =>
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

    //dbWrapper.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

    app.UseHttpsRedirection();
    app.UseAuthentication();
    app.MapGraphQL();
    app.Run();
}
catch (Exception ex)
{
    Log.Fatal(ex, "Application start-up failed");
    throw;
}
finally
{
    Log.CloseAndFlush();
}
