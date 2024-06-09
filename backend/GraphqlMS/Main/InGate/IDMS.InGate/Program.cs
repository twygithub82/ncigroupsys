using IDMS.InGate.GqlTypes;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args); builder.Services.AddHttpContextAccessor();

var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
builder.Services.AddGraphQLServer()
                .AddAuthorization()
                .AddQueryType<QueryType>();


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
              ValidAudience = JWT_validAudience,
              ValidIssuer = JWT_validIssuer,
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
          };
      });



var app = builder.Build();



//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();


app.Run();
