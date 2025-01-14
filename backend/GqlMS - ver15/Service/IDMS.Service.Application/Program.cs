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

namespace IDMS.ServiceMS
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
            string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";

            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddPooledDbContextFactory<ApplicationServiceDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
            });


            var mappingConfig = new MapperConfiguration(cfg =>
            {
                //cfg.CreateMap<InGateSurveyRequest, in_gate_survey>()
                //    .ForMember(dest => dest.guid, opt => opt.Ignore());
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            //builder.Services.AddControllers();
            //// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();

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
            //Specially created to solve slow after idle for sometime
            GqlUtils.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

            app.UseHttpsRedirection();
            app.UseAuthentication();
            //app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            app.Run();
        }
    }
}
