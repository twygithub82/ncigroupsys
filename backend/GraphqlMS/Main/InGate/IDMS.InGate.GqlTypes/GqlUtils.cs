using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGate.GqlTypes
{
    internal class GqlUtils
    {

        public static bool IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            bool result = false;
            try
            {
                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirstValue(ClaimTypes.GroupSid);

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
