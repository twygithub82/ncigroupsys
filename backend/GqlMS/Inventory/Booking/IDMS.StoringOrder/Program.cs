using IDMS.Booking.GqlTypes;
using Microsoft.EntityFrameworkCore;
//using IDMS.Booking.GqlTypes.Repo;
using HotChocolate.Data;
using AutoMapper;
using IDMS.Booking.Model.Request;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;

namespace IDMS.Booking.Application
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
            //builder.Services.AddPooledDbContextFactory<SODbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));
            builder.Services.AddDbContextPool<ApplicationInventoryDBContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));


            var mappingConfig = new MapperConfiguration(cfg =>
            {
                cfg.CreateMap<booking, BookingWithTanks>();
                //cfg.CreateMap<SOType, storing_order>();
            });

            IMapper mapper = mappingConfig.CreateMapper();
            builder.Services.AddSingleton(mapper);

            //builder.Services.AddDbContext<ApplicationDbContext>(
            //        options => options.UseSqlServer("YOUR_CONNECTION_STRING"));

            //builder.Services.AddScoped<SORepository>();

            // Add services to the container.
            //builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();
            //builder.Services.AddScoped<IServiceProvider, ServiceProvider>();
            //builder.Services.AddTransient<iDatabase, MySQLWrapper>();


            builder.Services.AddGraphQLServer()
                            .InitializeOnStartup()
                            //.RegisterDbContext<ApplicationInventoryDBContext>(DbContextKind.Synchronized)
                            .AddQueryType<BookingQuery>()
                            .AddSubscriptionType<BookingSubscription>()
                            .AddMutationType<BookingMutation>()
                            .AddFiltering()
                            .AddSorting()
                            .AddProjections()
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

            //app.UseAuthentication();
            app.UseWebSockets();//Subscription using websockets, must add this middleware
            app.MapGraphQL();
            //app.MapControllers();
            app.Run();
        }
    }
}