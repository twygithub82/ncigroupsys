using IDMS.Billing.Application;
using IDMS.Billing.GqlTypes;
using IDMS.Models.DB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace IDMS.Billing.Applicaton
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();

            string connectionString = builder.Configuration.GetConnectionString("default");
            var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
            var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
            var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);

            builder.Services.AddPooledDbContextFactory<ApplicationBillingDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
                o.EnableSensitiveDataLogging(false);
            });

            // Add services to the container.
            builder.Services.AddGraphQLServer()
                            .InitializeOnStartup(keepWarm: true)
                            .RegisterDbContextFactory<ApplicationBillingDBContext>()
                            .AddFiltering()
                            .AddSorting()
                            .AddProjections()
                            .AddAuthorizationCore()
                            .ModifyPagingOptions(opt => opt.MaxPageSize = 100)
                            .AddQueryType<BillingQuery>();



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
            app.UseHttpsRedirection();
            app.UseAuthentication();
            app.MapGraphQL();
            app.Run();
        }
    }
}
