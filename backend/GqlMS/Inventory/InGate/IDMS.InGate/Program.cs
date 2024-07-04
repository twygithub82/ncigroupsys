using IDMS.InGate.Class;

using IDMS.InGate.GqlTypes;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;


var builder = WebApplication.CreateBuilder(args); builder.Services.AddHttpContextAccessor();

var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration.GetConnectionString("DefaultConnection"));
builder.Services.AddDbContextPool<ApplicationInventoryDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
 new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

);
//builder.Services.AddPooledDbContextFactory<ApplicationDBContext>(options =>
//    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
// new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

//);
builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
                .AddAuthorization()
               .AddQueryType<InGate_QueryType>()
               .AddMutationType<InGate_MutationType>()
               .AddFiltering()
               .AddProjections()
               .AddSorting();

// .AddMutationType<InGate_MutationType>();



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
              ValidateLifetime=true,
              ValidateIssuerSigningKey = true,
              ValidAudience = JWT_validAudience,
              ValidIssuer = JWT_validIssuer,
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_secretKey))
          };
      });


var app = builder.Build();

app.UseWebSockets();
app.UseHttpsRedirection();
app.UseAuthentication();


//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();


app.Run();
