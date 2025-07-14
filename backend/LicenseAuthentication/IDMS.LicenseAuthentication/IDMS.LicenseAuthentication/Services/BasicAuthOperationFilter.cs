//using Microsoft.AspNetCore.Authorization;
//using Microsoft.OpenApi.Models;
//using Swashbuckle.AspNetCore.SwaggerGen;

//namespace IDMS.LicenseAuthentication.Services
//{
//    public class BasicAuthOperationFilter : IOperationFilter
//    {
//        public void Apply(OpenApiOperation operation, OperationFilterContext context)
//        {
//            var hasAuthorize = context.MethodInfo.GetCustomAttributes(true)
//                .OfType<AuthorizeAttribute>()
//                .Any(a => a.AuthenticationSchemes == "Basic");

//            if (hasAuthorize)
//            {
//                operation.Security = new List<OpenApiSecurityRequirement>
//            {
//                new OpenApiSecurityRequirement
//                {
//                    {
//                        new OpenApiSecurityScheme
//                        {
//                            Reference = new OpenApiReference
//                            {
//                                Type = ReferenceType.SecurityScheme,
//                                Id = "basic"
//                            }
//                        },
//                        new string[] { }
//                    }
//                }
//            };
//            }
//        }
//    }

//}
