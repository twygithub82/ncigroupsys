//using Microsoft.Extensions.Options;
//using Swashbuckle.AspNetCore.SwaggerGen;
//using Microsoft.OpenApi.Models;
//using Asp.Versioning.ApiExplorer;
//using Microsoft.AspNetCore.Authentication.JwtBearer;

//namespace IDMS.User.Authentication.API
//{
//    public class ConfigureSwaggerOptions : IConfigureOptions<SwaggerGenOptions>
//    {
//        private readonly IApiVersionDescriptionProvider _provider;

//        public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider)
//        {
//            _provider = provider;
//        }

//        public void Configure(SwaggerGenOptions options)
//        {
//            foreach (var description in _provider.ApiVersionDescriptions)
//            {
//                options.SwaggerDoc(
//                    description.GroupName,
//                    new OpenApiInfo
//                    {
//                        Title = $"IDMS Authentication API {description.ApiVersion}",
//                        Version = description.ApiVersion.ToString()
//                    });
//            }
//            //// Define the BearerAuth scheme that's in use
//            //var securityScheme = new OpenApiSecurityScheme
//            //{
//            //    Name = "Authorization",
//            //    Type = SecuritySchemeType.Http,
//            //    Scheme = "Bearer",
//            //    BearerFormat = "JWT",
//            //    In = ParameterLocation.Header,
//            //    Description = "JWT Authorization header using the Bearer scheme."
//            //};

//            //options.AddSecurityDefinition(JwtBearerDefaults.AuthenticationScheme, securityScheme);

//            //var securityRequirement = new OpenApiSecurityRequirement
//            //{
//            //    { new OpenApiSecurityScheme{ Reference=new OpenApiReference{ Type=ReferenceType.SecurityScheme,Id="Bearer"} },new string[]{ } }
//            //};

//            //options.AddSecurityRequirement(securityRequirement);
//        }
//    }
//}
