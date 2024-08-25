using Asp.Versioning;
using Asp.Versioning.ApiExplorer;
using IDMS.FileManagement.API.swagger;
using IDMS.FileManagement.API.Swagger;
using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Service;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
                .AddApiVersioning(options => {
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

            // Add Swagger with API versioning support
            //builder.Services.AddSwaggerGen(options =>
            //{
            //    options.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });
            //    options.SwaggerDoc("v2", new OpenApiInfo { Title = "My API", Version = "v2" });

            //    // Enable filtering and versioning
            //    options.DocInclusionPredicate((version, apiDescription) =>
            //    {
            //        var versions = apiDescription.ActionDescriptor.EndpointMetadata
            //            .OfType<ApiVersionAttribute>()
            //            .SelectMany(attr => attr.Versions)
            //            .Select(v => v.ToString())
            //            .ToList();

            //        return versions.Any(v => $"v{v}" == version);
            //    });
            //});

            builder.Services.AddTransient<IConfigureOptions<SwaggerGenOptions>, ConfigureSwaggerOptions>();
            builder.Services.AddSwaggerGen(options =>
            {
                // Add a custom operation filter which sets default values
                options.OperationFilter<SwaggerDefaultValues>();
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath);
            });


            builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();
            builder.Services.AddScoped<IFileManagement, FileManagementService>();
            builder.Services.AddScoped<AppDBContext>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            if(true)
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
                //app.UseSwaggerUI(options =>
                //{
                //    options.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                //    options.SwaggerEndpoint("/swagger/v2/swagger.json", "My API V2");
                //});
            }

            app.UseHttpsRedirection();

            //app.UseAuthorization();

            app.MapControllers();

            app.Run();
        }
    }
}
