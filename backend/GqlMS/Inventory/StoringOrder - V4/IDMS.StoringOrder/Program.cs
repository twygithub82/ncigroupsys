using IDMS.StoringOrder.GqlTypes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore;
using HotChocolate.Data;
using AutoMapper;
using IDMS.StoringOrder.Model.Request;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.StoringOrder.GqlTypes.Repo;
using HotChocolate.Types.Pagination;

namespace IDMS.StoringOrder.Application
{
    public class Program
    {
        //private static iDatabase mySqlDb;
        public static void Main(string[] args)
        {

            var builder = WebApplication.CreateBuilder(args);
                builder.Services.AddHttpContextAccessor();

            var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
            var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
            var JWT_secretKey = "";//await dbWrapper.GetJWTKey(builder.Configuration["DBService:queryUrl"]);


            string connectionString = builder.Configuration.GetConnectionString("default");
            //builder.Services.AddPooledDbContextFactory<AppDbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));

            builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(o =>
            {
                o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
                o.EnableSensitiveDataLogging(false);
            });
              

            //builder.Services.AddDbContext<AppDbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));

            //builder.Services.AddDbContextPool<ApplicationInventoryDBContext>(o =>
            //{
            //    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
            //    o.EnableSensitiveDataLogging(false);
            //});

            var mappingConfig = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<StoringOrderTankRequest, storing_order_tank>();
                cfg.CreateMap<StoringOrderRequest, storing_order>();
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);


            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowSpecificOrigin",
                    builder =>
                    {
                        builder.WithOrigins("http://localhost:4200") // Allow only this domain
                               .AllowAnyMethod()
                               .AllowAnyHeader()
                               .AllowCredentials();
                    });
            });

            builder.Services.AddGraphQLServer()
                            .InitializeOnStartup()
                            .RegisterDbContext<ApplicationInventoryDBContext>(DbContextKind.Pooled)
                            .AddQueryType<Query>()
                            .AddTypeExtension<SOQuery>()
                            .AddSubscriptionType<SOSubscription>()
                            .AddMutationType<SOMutation>()
                            .AddTypeExtension<SOTMutation>()
                            .AddFiltering()
                            .AddSorting()
                            .AddProjections()
                            .SetPagingOptions(new PagingOptions
                            {
                                MaxPageSize = 100
                            })
                            .AddInMemorySubscriptions();// Must add this as well for websocket



            //------------------------------------------------------------------------------
            //This portion is for Authentication matter
            //builder.Services.AddAuthentication(options => {

            //    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            //    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

            //})
            //    .AddJwtBearer(options =>
            //    {
            //        options.SaveToken = true;
            //        options.RequireHttpsMetadata = false;
            //        options.TokenValidationParameters = new TokenValidationParameters
            //        {
            //            ValidateIssuer = true,
            //            ValidateAudience = true,
            //            ValidateLifetime = true,
            //            ValidateIssuerSigningKey = true,
            //            ValidAudience = JWT_validAudience,
            //            ValidIssuer = JWT_validIssuer,
            //            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_secretKey))
            //        };
            //    });
            //--------------------------------------------------------------------------------------------

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            //if (app.Environment.IsDevelopment())
            //{
            //    app.UseSwagger();
            //    app.UseSwaggerUI();
            //}

            //app.UseHttpsRedirection();

            //app.UseAuthorization();
            app.UseCors("AllowSpecificOrigin"); // Apply CORS policy
            //app.UseAuthentication();
            app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            //app.MapControllers();
            app.Run();
        }
    }
}
