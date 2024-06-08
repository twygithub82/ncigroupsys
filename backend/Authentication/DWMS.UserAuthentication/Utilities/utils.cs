using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DWMS.User.Authentication.API.Utilities
{
    public class utils
    {
        public static List<Claim> GetClaims(int userType,string loginId,string email , IList<string> roles)
        {
            var authClaims = new List<Claim>();

            authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            authClaims.Add(new Claim(ClaimTypes.Name, loginId));
            authClaims.Add(new Claim(ClaimTypes.Email, email));
            if (userType == 1)
            {
                
                authClaims.Add(new Claim(ClaimTypes.GroupSid, "c1"));
            }
                        
            else if(userType==2)
            {
                
                authClaims.Add(new Claim(ClaimTypes.GroupSid, "s1"));
                
            }


           
            foreach (var role in roles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, role));
                if (userType == 2)
                {
                    if (role.Trim().ToLower() == "admin")
                        authClaims.Add(new Claim(ClaimTypes.PrimaryGroupSid, "a1"));
                }
            }

            return authClaims;
        }
        
        public static JwtSecurityToken GetToken(IConfiguration configuration, List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                  issuer: configuration["JWT:ValidIssuer"],
                  audience: configuration["JWT:ValidAudience"],
                  expires: DateTime.Now.AddHours(5),
                  claims: authClaims,
                  signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return token;
        }
    }
}
