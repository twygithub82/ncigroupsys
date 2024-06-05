using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DWMS.User.Authentication.API.Utilities
{
    public class utils
    {

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
