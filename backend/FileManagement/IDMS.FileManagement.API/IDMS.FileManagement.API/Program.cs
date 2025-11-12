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

            string connectionString = builder.Configuration.GetConnectionString("DbConnection");
            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<AppDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
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

            //Add Email Configs
            var emailConfig = builder.Configuration
                    .GetSection("EmailConfiguration")
                    .Get<EmailConfiguration>();

            var reportConfig = builder.Configuration
                                .GetSection("ReportSettings")
                                .Get<ReportSettings>();

            builder.Services.AddSingleton(emailConfig);
            builder.Services.AddSingleton(reportConfig);
            builder.Services.AddScoped<IFileManagement, FileManagementService>();
            builder.Services.AddScoped<IEmail, EmailService>();
            //builder.Services.AddScoped<IReport, ReportService>();

            builder.Services.AddScoped<IReport>(provider =>
            {

                var reportSettings = provider.GetRequiredService<ReportSettings>();
                var dbContext = provider.GetRequiredService<AppDBContext>();
                var emailService = provider.GetRequiredService<IEmail>();
                var scopeService = provider.GetRequiredService<IServiceScopeFactory>();
                var env = provider.GetRequiredService<IWebHostEnvironment>();

                return new ReportService(reportSettings, dbContext, emailService, scopeService, env.WebRootPath);

            });
                

            builder.Services.AddScoped<AppDBContext>();
            builder.Services.AddAuthorization();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            if (true)
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
