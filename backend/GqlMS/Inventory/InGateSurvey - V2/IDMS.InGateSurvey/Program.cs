using IDMS.InGateSurvey.Class;
using IDMS.InGateSurvey.GqlTypes;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using AutoMapper;
using IDMS.Models.Inventory;
using IDMS.InGateSurvey.Model.Request;
using HotChocolate.Data;
using IDMS.InGate.GqlTypes;


var builder = WebApplication.CreateBuilder(args); builder.Services.AddHttpContextAccessor();

//var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
//var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
//var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration.GetConnectionString("DefaultConnection"));

builder.Services.AddPooledDbContextFactory<ApplicationInventoryDBContext>(options =>
    options.UseMySql(builder.Configuration.GetConnectionString("Default"),
 new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

);

var mappingConfig = new MapperConfiguration(cfg =>
{

    cfg.CreateMap<InGateSurveyRequest, in_gate_survey>()
        .ForMember(dest => dest.guid, opt => opt.Ignore());

    cfg.CreateMap<OutGateSurveyRequest, out_gate_survey>()
        .ForMember(dest => dest.guid, opt => opt.Ignore());
    //cfg.CreateMap<StoringOrderRequest, storing_order>();
});

IMapper mapper = mappingConfig.CreateMapper();
builder.Services.AddSingleton(mapper);


//);
builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
               .InitializeOnStartup()
               .RegisterDbContext<ApplicationInventoryDBContext>(DbContextKind.Pooled)
               .AddQueryType<Query>()
               .AddTypeExtension<SurveyQuery>()
               .AddTypeExtension<InGate_QueryType>()
               .AddTypeExtension<OutGate_QueryType>()
               .AddTypeExtension<InGate_MutationType>()
               .AddTypeExtension<OutGate_MutationType>()
               .AddMutationType<IGSurveyMutation>()
               .AddTypeExtension<OGSurveyMutationType>()
               .AddFiltering()
               .AddProjections()
               .AddSorting();

// .AddMutationType<InGate_MutationType>();
//builder.Services.AddAuthentication(options => {

//    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
//    options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;

//})
//      .AddJwtBearer(options =>
//      {
//          options.SaveToken = true;
//          options.RequireHttpsMetadata = false;
//          options.TokenValidationParameters = new TokenValidationParameters
//          {
//              ValidateIssuer = true,
//              ValidateAudience = true,
//              ValidateLifetime=true,
//              ValidateIssuerSigningKey = true,
//              ValidAudience = JWT_validAudience,
//              ValidIssuer = JWT_validIssuer,
//              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(JWT_secretKey))
//          };
//      });


//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin",
//        builder =>
//        {
//            builder.WithOrigins("http://localhost:4200") // Allow only this domain
//                   .AllowAnyMethod()
//                   .AllowAnyHeader()
//                   .AllowCredentials();
//        });
//});

var app = builder.Build();

app.UseWebSockets();
app.UseHttpsRedirection();
//app.UseAuthentication();
//app.UseCors("AllowSpecificOrigin"); // Apply CORS policy
app.MapGraphQL();
app.Run();
