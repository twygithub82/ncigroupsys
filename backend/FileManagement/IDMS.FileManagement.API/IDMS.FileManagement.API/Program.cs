using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using IDMS.Email.Service;
using IDMS.FileManagement.API.swagger;
using IDMS.FileManagement.API.Swagger;
using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Interface.Model;
using IDMS.FileManagement.Service;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.Identity.Web;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace IDMS.FileManagement.API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            // Add services to the container.
            var emailProvider = builder.Configuration["EmailProvider"] ?? "Domain";
            var currentEnv = builder.Configuration["Env"] ?? "Staging";

            // Configure logging
            builder.Logging.ClearProviders();
            builder.Logging.AddConsole();
            builder.Logging.SetMinimumLevel(LogLevel.Information);

            string connectionString = builder.Configuration.GetConnectionString("DbConnection");
            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<AppDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));
                o.EnableSensitiveDataLogging(false);
            });

            builder.Services
                .AddApiVersioning(options =>
                {
                    //indicating whether a default version is assumed when a client does
                    // does not provide an API version.
                    options.DefaultApiVersion = new ApiVersion(2, 0);
                    options.AssumeDefaultVersionWhenUnspecified = true;
                })
                .AddApiExplorer(options =>
                {
                    // Add the versioned API explorer, which also adds IApiVersionDescriptionProvider service
                    // note: the specified format code will format the version as "'v'major[.minor][-status]"
                    options.GroupNameFormat = "'v'VVV";

                    // note: this option is only necessary when versioning by url segment. the SubstitutionFormat
                    // can also be used to control the format of the API version in route templates
                    options.SubstituteApiVersionInUrl = true;
                });

            // Add your normal app JWT authentication (frontend)
            builder.Services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer("AppJwt", options =>
            {
                options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
                {
                    ValidIssuer = builder.Configuration["Jwt:Issuer"],
                    ValidAudience = builder.Configuration["Jwt:Audience"],
                    IssuerSigningKey = new SymmetricSecurityKey(
                        System.Text.Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]!)
                    )
                };
            })

            // Add Azure AD authentication for Logic App
            .AddMicrosoftIdentityWebApi(options =>
            {
                builder.Configuration.Bind("AzureAd", options);
            }, options =>
            {
                builder.Configuration.Bind("AzureAd", options);
            }, "AzureAd");

            builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            builder.Services.AddSwaggerGen(options =>
            {
                // Add a custom operation filter which sets default values
                options.OperationFilter<SwaggerDefaultValues>();
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);

                // Define the BearerAuth scheme that's in use
                var securityScheme = new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme."
                };

                options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, securityScheme);

                var securityRequirement = new OpenApiSecurityRequirement
                {
                    { new OpenApiSecurityScheme{ Reference=new OpenApiReference{ Type=ReferenceType.SecurityScheme,Id="Bearer"} },new string[]{ } }
                };

                    options.AddSecurityRequirement(securityRequirement);
                });


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();


            var reportConfig = builder.Configuration
                    .GetSection("ReportSettings")
                    .Get<ReportSettings>();

            if(emailProvider.Equals("Domain", StringComparison.OrdinalIgnoreCase))
            {
                //Add Email Configs Doamin
                var emailConfig = builder.Configuration
                        .GetSection("EmailConfigurationDomain")
                        .Get<EmailConfigurationDomain>();
                builder.Services.AddSingleton(emailConfig);
                builder.Services.AddScoped<IEmail, EmailServiceDomain>();
            }
            else
            {
                //Add Email Configs
                var emailConfig = builder.Configuration
                        .GetSection("EmailConfiguration")
                        .Get<EmailConfiguration>();
                builder.Services.AddSingleton(emailConfig);
                builder.Services.AddScoped<IEmail, EmailService>();
            }

            
            builder.Services.AddSingleton(reportConfig);
            builder.Services.AddScoped<IFileManagement, FileManagementService>();
            //builder.Services.AddScoped<IReport, ReportService>();

            builder.Services.AddScoped<IReport>(provider =>
            {

                var reportSettings = provider.GetRequiredService<ReportSettings>();
                var dbContext = provider.GetRequiredService<AppDBContext>();
                var emailService = provider.GetRequiredService<IEmail>();
                var scopeService = provider.GetRequiredService<IServiceScopeFactory>();
                var env = provider.GetRequiredService<IWebHostEnvironment>();
                var logger = provider.GetRequiredService<ILogger<ReportService>>();

                return new ReportService(reportSettings, dbContext, emailService, scopeService, env.WebRootPath, logger);

            });
                

            builder.Services.AddScoped<AppDBContext>();
            builder.Services.AddAuthorization();

            var app = builder.Build();
            var logger = app.Services.GetRequiredService<ILogger<Program>>();
            logger.LogInformation("Application starting up.");
            logger.LogInformation("Environment:{env}", app.Environment.EnvironmentName);
            logger.LogInformation($"Using database connection string: {connectionString?.Split(";")[0]}");
            logger.LogInformation("ZipFileUrl: " + builder.Configuration["ZipFileUrl"]);
            logger.LogInformation("ResetLinkConfiguration: " + builder.Configuration["ResetLinkConfiguration:Url"]);
            logger.LogInformation("License_Url_Validity: " + builder.Configuration["License:Url_Validity"]);
            logger.LogInformation("License_Url_Activation: " + builder.Configuration["License:Url_Activation"]);


            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment() || "Staging".Equals(currentEnv, StringComparison.CurrentCultureIgnoreCase))
            {
                app.UseSwagger();
                app.UseSwaggerUI(options =>
                {
                    var descriptions = app.DescribeApiVersions();
                    // Build a swagger endpoint for each discovered API version
                    foreach (var description in descriptions)
                    {
                        var url = $"/swagger/{description.GroupName}/swagger.json";
                        var name = description.GroupName.ToUpperInvariant();
                        options.SwaggerEndpoint(url, name);
                    }
                });
            }
            app.UseStaticFiles();
            app.UseHttpsRedirection();

            //app.UseAuthentication();
            //app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
