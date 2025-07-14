using IDMS.User.Authentication.API.Models.Authentication;
using IDMS.UserAuthentication.DB;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;

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
                var functionNames = from f in _dbContext.functions
                                    join rf in _dbContext.role_functions
                                    on f.guid equals rf.functions_guid
                                    where f.delete_dt == null && rf.delete_dt == null &&
                                    (from r in _dbContext.user_role
                                     where r.user_guid == userId
                                     select r.role_guid).Contains(rf.role_guid)
                                    select f.code;

                var addHocfunctionNames = from f in _dbContext.functions
                                          join uf in _dbContext.user_functions
                                          on f.guid equals uf.functions_guid
                                          where f.delete_dt == null && uf.delete_dt == null &&
                                          uf.user_guid == userId && uf.adhoc == true
                                          select f.code;

                JArray functionNamesArray = JArray.FromObject(functionNames);
                if (addHocfunctionNames != null)
                {
                    foreach (var item in JArray.FromObject(addHocfunctionNames))
                    {
                        functionNamesArray.Add(item);
                    }
                }
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
                                where ur.user_guid == userId && r.delete_dt == null && ur.delete_dt == null
                                select r.code;

                JArray roleNamesArray = JArray.FromObject(roleNames);
                return roleNamesArray;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static JArray GetTeamsByUser(ApplicationDbContext _dbContext, string userId)
        {
            try
            {
                var teamDetails = from t in _dbContext.team
                                  join ut in _dbContext.team_user
                                  on t.guid equals ut.team_guid
                                  where ut.userId == userId && t.delete_dt == null && ut.delete_dt == null
                                  //select t.description;

                                  select new
                                  {
                                      Description = t.description,
                                      Department = t.department_cv
                                  };

                JArray teamDetailsArray = JArray.FromObject(teamDetails);
                return teamDetailsArray;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task<(HttpStatusCode, string)> GetLicenseValidity(ApplicationDbContext _dbContext, string licKey, IConfiguration _config)
        {
            var httpClient = new HttpClient();

            string url = _config["License:Url"];

            // Read JSON string from appsettings.json
            //string jsonPayload = _config["License:ActivationKey"];

            string encoded = WebUtility.UrlEncode(licKey);
            string jsonEncoded = JsonSerializer.Serialize(encoded);

            // Wrap in StringContent for POST
            var content = new StringContent(jsonEncoded, Encoding.UTF8, "application/json");

            // Send HTTP POST request
            var response = await httpClient.PostAsync(url, content);
            var responseContent = await response.Content.ReadAsStringAsync();

            Console.WriteLine($"Status: {response.StatusCode}");
            Console.WriteLine($"Response: {responseContent}");

            return (response.StatusCode, responseContent);
        }
    }
}
