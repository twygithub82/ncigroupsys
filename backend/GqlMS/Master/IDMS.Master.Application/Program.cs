using AutoMapper;
using HotChocolate.Data;
using HotChocolate.Types.Pagination;
using IDMS.Customer.GqlTypes;
using IDMS.Customer.GqlTypes.LocalModel;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


namespace IDMS.Master.Application
{
    public class Program
    {
        public async static Task Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);
            builder.Services.AddHttpContextAccessor();

            string connectionString = builder.Configuration.GetConnectionString("default");
            // Add services to the container.
            var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
            var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
            var JWT_secretKey = await GqlUtils.GetJWTKey(connectionString);

            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<ApplicationMasterDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
                o.EnableSensitiveDataLogging(false);
            });


            var mappingConfig = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<CustomerRequest, customer_company>();
                //cfg.CreateMap<ContactPersonRequest, customer_company_contact_person>();
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

            builder.Services.AddGraphQLServer()
                       .InitializeOnStartup()
                       .RegisterDbContext<ApplicationMasterDBContext>(DbContextKind.Pooled)
                       .AddQueryType<TemplateEstQuery>()
                       .AddTypeExtension<CustomerQuery>()
                       .AddMutationType<TemplateEstMutation>()
                       .AddTypeExtension<CustomerMutation>()
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

            app.UseHttpsRedirection();
            app.UseAuthentication();
            //app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            app.Run();
        }
    }
}
