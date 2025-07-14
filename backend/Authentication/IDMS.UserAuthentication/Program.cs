using IDMS.User.Authentication.API.Models.RefreshToken;
using IDMS.User.Authentication.API.Utilities;
using IDMS.User.Authentication.Service.Models;
using IDMS.User.Authentication.Service.Services;
using IDMS.UserAuthentication.DB;
using IDMS.UserAuthentication.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;
using System.Text;
using System.Text.Json;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("default");
builder.Services.AddDbContext<ApplicationDbContext>(o =>

    //options.UseMySql(connectionString, new MySqlServerVersion(new Version(8, 0, 21)))
    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
                    mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                    maxRetryCount: 5,
                    maxRetryDelay: TimeSpan.FromSeconds(5),
                    errorNumbersToAdd: null)
                    .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
                ).LogTo(Console.WriteLine)
);

//For Identity
builder.Services.AddIdentity<ApplicationUser, IdentityRole>()
    .AddEntityFrameworkStores<ApplicationDbContext>()
    .AddDefaultTokenProviders();

builder.Services.Configure<IdentityOptions>(
    opts => opts.SignIn.RequireConfirmedEmail = true
);

//Generate the link for reseting password
builder.Services.Configure<DataProtectionTokenProviderOptions>(opts => opts.TokenLifespan = TimeSpan.FromHours(10));

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
              ValidateLifetime= true,
              ValidateIssuerSigningKey = true,
              ValidAudience = builder.Configuration["JWT:ValidAudience"],
              ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
              IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Secret"]))
          };
      });

//Add Email Configs
var emailConfig = builder.Configuration
        .GetSection("EmailConfiguration")
        .Get<EmailConfiguration>();

builder.Services.AddSingleton(emailConfig);
builder.Services.AddSingleton<IRefreshTokenStore, RefreshTokenStore>();
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddHostedService<KeepAliveService>();

// Add services to the container.
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowSpecificOrigin",
//           builder => builder.WithOrigins("https://example.com")
//                             .AllowAnyHeader()
//                             .AllowAnyMethod());
//    options.AddPolicy("AllowAllOrigins",
//       builder => builder
//           .AllowAnyOrigin()
//           .AllowAnyMethod()
//           .AllowAnyHeader()
//           .WithExposedHeaders("Access-Control-Allow-Origin", "Access-Control-Allow-Methods"));
//});

builder.Services.AddControllers().AddJsonOptions(opts =>
{
    opts.JsonSerializerOptions.PropertyNamingPolicy = JsonNamingPolicy.CamelCase;
}); 

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();


builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "IDMS Authentication API", Version = "v1" });

    // Define the BearerAuth scheme that's in use
    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "JWT Authorization header using the Bearer scheme."
    };

    c.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, securityScheme);

    var securityRequirement = new OpenApiSecurityRequirement
            {
                { new OpenApiSecurityScheme{ Reference=new OpenApiReference{ Type=ReferenceType.SecurityScheme,Id="Bearer"} },new string[]{ } }
            };

    c.AddSecurityRequirement(securityRequirement);
});


var app = builder.Build();
//app.UseCors("AllowAllOrigins");
// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.Use(async (context, next) =>
{
    Console.WriteLine("Request Path: " + context.Request.Path);
    await next();
    Console.WriteLine("Response Headers: " + string.Join(", ", context.Response.Headers.Select(h => h.Key + "=" + h.Value)));
});

//app.UseCors(builder =>
//{
//    builder
//    .AllowAnyOrigin()
//    .AllowAnyMethod()
//    .AllowAnyHeader();
//});

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
//app.UseCors("AllowAll");
app.MapControllers();

app.Run();
