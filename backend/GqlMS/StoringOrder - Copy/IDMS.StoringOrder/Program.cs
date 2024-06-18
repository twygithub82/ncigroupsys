using IDMS.StoringOrder.GqlTypes;
using IDMS.DBAccess;
using IDMS.DBAccess.Interface;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

namespace IDMS.StoringOrder
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

            // Add services to the container.
            //builder.Services.AddControllers();
            // Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
            //builder.Services.AddEndpointsApiExplorer();
            //builder.Services.AddSwaggerGen();
            //builder.Services.AddScoped<IServiceProvider, ServiceProvider>();
            builder.Services.AddSingleton<IDBAccess, DBAccessService>();
            //builder.Services.AddTransient<iDatabase, MySQLWrapper>();

            
            builder.Services.AddGraphQLServer()
                            .RegisterService<IDBAccess>()
                            //.RegisterService<iDatabase>()
                            .AddQueryType<QueryType>()
                            .AddSubscriptionType<SubscriptionType>()
                            .AddMutationType<MutationType>()
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
