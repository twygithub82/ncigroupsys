using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace DWMS.User.Authentication.API.Utilities
{
    public class JwtTokenService
    {
        private readonly string _secret;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly double _duration;
        private readonly IDictionary<string, string> _refreshTokens = new Dictionary<string, string>();

        public JwtTokenService(IConfiguration config)
        {
            _duration = 0.5;
            _secret = config["JWT:Secret"];
            _issuer = config["JWT:ValidIssuer"];
            _audience = config["JWT:ValidAudience"];
            string sDuration = config["JWT:duration"];
            double.TryParse(sDuration, out _duration);
            
        }

        public ClaimsPrincipal GetPrincipalFromExpiredToken(string token)
        {
            var tokenValidationParameters = new TokenValidationParameters
            {
                ValidateAudience = false,
                ValidateIssuer = false,
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(_secret)),
                ValidateLifetime = false // Ignore expiration for this validation step
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var principal = tokenHandler.ValidateToken(token, tokenValidationParameters, out var securityToken);

            if (!(securityToken is JwtSecurityToken jwtSecurityToken) ||
                !jwtSecurityToken.Header.Alg.Equals(SecurityAlgorithms.HmacSha256, StringComparison.InvariantCultureIgnoreCase))
            {
                throw new SecurityTokenException("Invalid token");
            }

            return principal;
        }
        public JwtSecurityToken GetToken(int userType, string loginId, string email, IList<string> roles)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            var exp = DateTime.Now.AddHours(_duration);
            List<Claim> authClaims = GetClaims(userType, loginId, email, roles);
            var token = new JwtSecurityToken(
                  issuer: _issuer,
                  audience: _audience,
                  expires: exp,
                  claims: authClaims,
                  signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return token;
        }

         List<Claim> GetClaims(int userType, string loginId, string email, IList<string> roles)
        {
            var authClaims = new List<Claim>();

            authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            authClaims.Add(new Claim(ClaimTypes.Name, loginId));
            authClaims.Add(new Claim(ClaimTypes.Email, email));
            if (userType == 1)
            {

                authClaims.Add(new Claim(ClaimTypes.GroupSid, "c1"));
            }

            else if (userType == 2)
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

        public string GenerateRefreshToken()
        {
            var randomNumber = new byte[32];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(randomNumber);
                return Convert.ToBase64String(randomNumber);
            }
        }

    }
}
