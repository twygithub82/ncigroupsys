using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
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
    }
}
