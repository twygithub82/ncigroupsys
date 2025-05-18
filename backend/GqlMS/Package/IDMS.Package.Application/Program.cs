using IDMS.Parameter.CleaningProcedure.Class;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.DB;
using IDMS.Models.Package.GqlTypes;
using Pomelo.EntityFrameworkCore.MySql.Storage.Internal;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("default");

var JWT_validAudience = builder.Configuration.GetSection("JWT").GetSection("VALIDAUDIENCE").Value.ToString();
var JWT_validIssuer = builder.Configuration.GetSection("JWT").GetSection("VALIDISSUER").Value.ToString();
//var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration["DBService:queryUrl"]);
var JWT_secretKey = await dbWrapper.GetJWTKey(connectionString);
string pingDurationMin = builder.Configuration.GetSection("PingDurationMin").Value ?? "3";


//builder.Services.AddPooledDbContextFactory<AppDbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));

builder.Services.AddPooledDbContextFactory<ApplicationPackageDBContext>(o =>
{
    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString),
              mySqlOptions => mySqlOptions.EnableRetryOnFailure(
                            maxRetryCount: 5,
                            maxRetryDelay: TimeSpan.FromSeconds(10),
                            errorNumbersToAdd: null)
              .ExecutionStrategy(c => new MySqlExecutionStrategy(c))
              ).LogTo(Console.WriteLine);
    o.EnableSensitiveDataLogging(false);
});

builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
                .InitializeOnStartup(keepWarm: true)
                .RegisterDbContext<ApplicationPackageDBContext>(DbContextKind.Pooled)
                .AddAuthorization()
                .AddQueryType<PackageQuery>()
                .AddMutationType<PackageMutation>()
                .AddFiltering()
                .AddProjections()
                .SetPagingOptions(new HotChocolate.Types.Pagination.PagingOptions
                {
                    MaxPageSize = 100
                })
               .AddSorting();


builder.Services.AddAuthentication(options =>
{
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
//builder.Services.AddEndpointsApiExplorer();
//builder.Services.AddSwaggerGen();
//builder.Services.AddCors(options =>
//{
//    options.AddPolicy("AllowAll",
//        builder => builder
//            .AllowAnyOrigin()
//            .AllowAnyMethod()
//            .AllowAnyHeader());
//});

var app = builder.Build();
dbWrapper.PingThread(app.Services.CreateScope(), int.Parse(pingDurationMin));

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.UseWebSockets();
app.UseHttpsRedirection();
app.UseAuthentication();


//app.MapGet("/", () => "Hello World!");
app.MapGraphQL();
//app.MapControllers();
//app.UseCors("AllowAll");
app.Run();
