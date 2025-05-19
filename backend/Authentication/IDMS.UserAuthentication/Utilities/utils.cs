using IDMS.UserAuthentication.DB;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace IDMS.User.Authentication.API.Utilities
{

    
    public class utils
    {
        public static string GetGuidString()
        {
            return Guid.NewGuid().ToString("N");
        }
        public static long GetNowEpochInSec()
        {
            DateTimeOffset now = DateTimeOffset.UtcNow;

            // Get the epoch time
            return now.ToUnixTimeSeconds();
        }

        public static JArray GetFunctionsByUser(ApplicationDbContext _dbContext, string userId)
        {
            try
            {
                var functionNames = from f in _dbContext.functions_new
                                    join rf in _dbContext.role_functions_new
                                    on f.guid equals rf.functions_guid
                                    where (from r in _dbContext.user_role where r.user_guid == userId select r.role_guid).Contains(rf.role_guid)
                                    select f.code;

                JArray functionNamesArray = JArray.FromObject(functionNames);
                return functionNamesArray;

            }
            catch (Exception ex) 
            {
                throw ex;
            }
        }

        public static JArray GetRolesByUser(ApplicationDbContext _dbContext, string userId)
        {
            try
            {
                var roleNames = from r in _dbContext.role
                                    join ur in _dbContext.user_role
                                    on r.guid equals ur.role_guid
                                //where (from r in _dbContext.user_role where r.user_guid == userId select r.role_guid).Contains(ur.role_guid)
                                    where ur.user_guid == userId 
                                    select r.code;

                JArray roleNamesArray = JArray.FromObject(roleNames);
                return roleNamesArray;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
    }
}
