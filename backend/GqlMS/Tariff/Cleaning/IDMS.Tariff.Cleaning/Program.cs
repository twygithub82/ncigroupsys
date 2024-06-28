using IDMS.Parameter.CleaningProcedure.Class;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IDMS.Models.Tariff.Cleaning.GqlTypes;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using HotChocolate.Data;

var builder = WebApplication.CreateBuilder(args);

var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
//var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration["DBService:queryUrl"]);
var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddDbContextPool<ApplicationTariffDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
 new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

);

builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
                .RegisterDbContext<ApplicationTariffDBContext>(DbContextKind.Synchronized)
                .AddAuthorization()
               .AddQueryType<IDMS.Models.Tariff.Cleaning.GqlTypes.TariffCleaning_QueryType>()
               .AddMutationType<IDMS.Models.Tariff.Cleaning.GqlTypes.TariffCleanning_MutationType>()
               .AddFiltering()
               .AddProjections()
               .AddSorting();



builder.Services.AddAuthentication(options => {

    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

})
      .AddJwtBearer(options =>
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


// Add services to the container.

//builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();
app.UseHttpsRedirection();
app.UseAuthentication();


//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();
//app.MapControllers();

app.Run();
