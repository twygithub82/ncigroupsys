using IDMS.Parameter.CleaningProcedure.Class;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using IDMS.Models.Tariff.Cleaning.GqlTypes;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Package.GqlTypes;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("default");
var JWT_validAudience = builder.Configuration["JWT_VALIDAUDIENCE"];
var JWT_validIssuer = builder.Configuration["JWT_VALIDISSUER"];
//var JWT_secretKey = await dbWrapper.GetJWTKey(builder.Configuration["DBService:queryUrl"]);
var JWT_secretKey = await dbWrapper.GetJWTKey(connectionString);


//builder.Services.AddPooledDbContextFactory<AppDbContext>(o => o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine));

builder.Services.AddPooledDbContextFactory<ApplicationPackageDBContext>(o =>
{
    o.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)).LogTo(Console.WriteLine);
    o.EnableSensitiveDataLogging(false);
});


//builder.Services.AddDbContextPool<ApplicationPackageDBContext>(options =>
//    options.UseMySql(builder.Configuration.GetConnectionString("DefaultConnection"),
// new MySqlServerVersion(new Version(8, 0, 21))).LogTo(Console.WriteLine)

//);

builder.Services.AddHttpContextAccessor();
builder.Services.AddGraphQLServer()
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
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        builder => builder
            .AllowAnyOrigin()
            .AllowAnyMethod()
            .AllowAnyHeader());
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var contextFactory = scope.ServiceProvider.GetRequiredService<IDbContextFactory<ApplicationPackageDBContext>>();

    // Create a new instance of ApplicationPackageDBContext
    using (var dbContext = await contextFactory.CreateDbContextAsync())
    {
        // Perform a simple query to initialize the connection
        await dbContext.Database.OpenConnectionAsync();
        // You can perform other operations here if needed
        await dbContext.Database.CloseConnectionAsync();
    }
}

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

app.UseCors("AllowAll");
app.Run();
