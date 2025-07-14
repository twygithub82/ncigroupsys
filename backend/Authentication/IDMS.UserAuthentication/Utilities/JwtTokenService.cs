using IDMS.UserAuthentication.DB;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.InteropServices;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Nodes;

namespace IDMS.User.Authentication.API.Utilities
{
    public class JwtTokenService
    {
        private readonly string _secret;
        private readonly string _issuer;
        private readonly string _audience;
        private readonly double _duration;
        private readonly string _roleMeta;

        private readonly IDictionary<string, string> _refreshTokens = new Dictionary<string, string>();

        private readonly ApplicationDbContext _dbContext;

        public JwtTokenService(IConfiguration config, ApplicationDbContext context)
        {
            _duration = 10;
            _secret = config["JWT:Secret"];
            _issuer = config["JWT:ValidIssuer"];
            _audience = config["JWT:ValidAudience"];
            string sDuration = config["JWT:duration"];
            double.TryParse(sDuration, out _duration);
            _dbContext = context;
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
        public JwtSecurityToken GetToken(int userType, string loginId, string email, IList<string> roles, string userId,string currentSessionId)
        {
            //var functionNames = from f in _dbContext.functions
            //                    join rf in _dbContext.role_function
            //                    on f.guid equals rf.function_guid
            //                    where (from r in _dbContext.UserRoles where r.UserId == userId select r.RoleId).Contains(rf.role_guid)
            //                    select f.name;

            //var functionNamesNew = from f in _dbContext.functions_new
            //                    join rf in _dbContext.role_functions_new
            //                    on f.guid equals rf.functions_guid
            //                    where (from r in _dbContext.user_role where r.user_guid == userId select r.role_guid).Contains(rf.role_guid)
            //                    select f.code;


            var teams = from tu in _dbContext.team_user
                        join t in _dbContext.team
                        on tu.team_guid equals t.guid
                        where (from u in _dbContext.Users where u.Id == userId select u.Id).Contains(tu.userId)
                        select new { t.description, department= t.department_cv };

            JArray teamsArray =  JArray.FromObject(teams);
            JArray functionNamesArray = new JArray(); //JArray.FromObject(functionNamesNew);

            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_secret));
            //var exp = DateTime.Now.AddHours(_duration);
            //var exp = DateTime.Now.AddYears(1);
            var exp = DateTime.Now.AddMinutes(_duration);
            List<Claim> authClaims = GetClaims(userType, userId, loginId, email, roles, functionNamesArray, teamsArray, currentSessionId);
            var token = new JwtSecurityToken(
                  issuer: _issuer,
                  audience: _audience,
                  expires: exp,
                  claims: authClaims,
                  signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return token;
        }

         List<Claim> GetClaims(int userType, string userId, string loginId, string email, IList<string> roles, JArray functionsRight,JArray teams,string currentSessionId)
        {
            var authClaims = new List<Claim>();

            authClaims.Add(new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()));
            authClaims.Add(new Claim(ClaimTypes.Name, loginId));
            authClaims.Add(new Claim(ClaimTypes.Email, email));
            authClaims.Add(new Claim(ClaimTypes.Sid, userId));
            authClaims.Add(new Claim(ClaimTypes.UserData, functionsRight.ToString()));
            authClaims.Add(new Claim(ClaimTypes.UserData, teams.ToString()));
            authClaims.Add(new Claim("sessionId", currentSessionId.ToString()));
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

                //var userRole = _dbContext.UserRoles.FindAsync()
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
