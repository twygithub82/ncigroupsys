using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Security.Claims;

namespace IDMS.StoringOrder.GqlTypes
{
    internal class GqlUtils
    {
        public static bool IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            bool result = false;
            try
            {
                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirst(ClaimTypes.GroupSid)?.Value; //authUser.FindFirstValue(ClaimTypes.GroupSid);

                //var c = authUser.FindFirst(ClaimTypes.GroupSid).Value;
                if (primarygroupSid != "s1")
                {
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }
            }
            catch
            {
                throw;
            }
            return result;
        }
    }
}
