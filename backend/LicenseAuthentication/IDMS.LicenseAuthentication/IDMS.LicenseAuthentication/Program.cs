
using IDMS.LicenseAuthentication.DB;
using IDMS.LicenseAuthentication.Models;
using IDMS.LicenseAuthentication.Services;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using System.Text;
using System.Text.Json;

namespace IDMS.LicenseAuthentication
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            string connectionString = builder.Configuration.GetConnectionString("Default");
            builder.Services.AddDbContext<ApplicationDbContext>(o =>

                //options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)))
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                                mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                                maxRetryCount: 5,
                                maxRetryDelay: TimeSpan.FromSeconds(5),
                                errorNumbersToAdd: null)
                                .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
                            ).LogTo(Console.WriteLine)
            );

            //Generate the link for reseting password
            builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(10));

            builder.Services.AddSingleton(sp =>
            {
                var config = sp.GetRequiredService<IConfiguration>();
                var secret = config["LicenseKey:Secret"];
                return new LicenseKeyService(secret);
            });
            builder.Services.AddSingleton<JWTTokenService>();

            builder.Services.Configure<BasicAuth>(
                builder.Configuration.GetSection("BasicAuth"));

            //builder.Services.AddAuthentication(options => {

            //    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

            //})
            //.AddJwtBearer(options =>
            //{
            //    options.SaveToken = true;
            //    options.RequireHttpsMetadata = false;
            //    options.TokenValidationParameters = new TokenValidationParameters
            //    {
            //        ValidateIssuer = true,
            //        ValidateAudience = true,
            //        ValidateLifetime = true,
            //        ValidateIssuerSigningKey = true,
            //        ValidAudience = builder.Configuration["JWT:ValidAudience"],
            //        ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
            //        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
            //    };
            //});

            builder.Services.AddAuthentication("BasicAuthentication")
                    .AddScheme<AuthenticationSchemeOptions, BasicAuthenticationHandler>("BasicAuthentication", null);


            builder.Services.AddControllers().AddJsonOptions(opts =>
            {
                opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
            });

            builder.Services.AddControllers();

            //builder.Services.AddSwaggerGen(c =>
            //{
            //    c.SwaggerDoc("v1", new OpenApiInfo { Title = "TLX License Authentication API", Version = "v1" });

            //    // Define the BearerAuth scheme that's in use
            //    var securityScheme = new OpenApiSecurityScheme
            //    {
            //        Name = "Authorization",
            //        Type = SecuritySchemeType.Http,
            //        Scheme = "Bearer",
            //        BearerFormat = "JWT",
            //        In = ParameterLocation.Header,
            //        Description = "JWT Authorization header using the Bearer scheme."
            //    };

            //    c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, securityScheme);

            //    var securityRequirement = new OpenApiSecurityRequirement
            //    {
            //        { new OpenApiSecurityScheme{ Reference=new OpenApiReference{ Type=ReferenceType.SecurityScheme,Id="Bearer"} },new string[]{ } }
            //    };

            //    c.AddSecurityRequirement(securityRequirement);
            //});


            builder.Services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "TLX License Authentication API", Version = "v1" });

                //Define Basic Auth scheme
                c.AddSecurityDefinition("basic", new OpenApiSecurityScheme
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    Scheme = "basic",
                    In = ParameterLocation.Header,
                    Description = "Enter your username and password"
                });

                //Require Basic Auth on all operations
                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "basic"
                            }
                        },
                        Array.Empty<string>()
                    }
                });
            });



            var app = builder.Build();
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.Use(async (context, next) =>
            {
                Console.WriteLine("Request Path: " + context.Request.Path);
                await next();
                Console.WriteLine("Response Headers: " + string.Join(", ", context.Response.Headers.Select(h => h.Key + "=" + h.Value)));
            });

            app.UseHttpsRedirection();
            app.UseAuthorization();
            app.MapControllers();

            app.Run();
        }
    }
}
