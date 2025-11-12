using IDMS.User.Authentication.API.Models.Authentication;
using IDMS.UserAuthentication.DB;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.IO.Compression;
using System.Net;
using System.Net.Http;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

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

        public static byte[] CreateZipFromFiles(string pdfPath, List<string> imagePaths)
        {
            using var memoryStream = new MemoryStream();
            using (var archive = new ZipArchive(memoryStream, ZipArchiveMode.Create, true))
            {
                // Add PDF file
                if (File.Exists(pdfPath))
                {
                    var pdfEntry = archive.CreateEntry(Path.GetFileName(pdfPath));
                    using var pdfStream = File.OpenRead(pdfPath);
                    using var entryStream = pdfEntry.Open();
                    pdfStream.CopyTo(entryStream);
                }

                // Add up to 10 JPEG images
                foreach (var imagePath in imagePaths.Take(10))
                {
                    if (File.Exists(imagePath))
                    {
                        var imageEntry = archive.CreateEntry(Path.GetFileName(imagePath));
                        using var imageStream = File.OpenRead(imagePath);
                        using var entryStream = imageEntry.Open();
                        imageStream.CopyTo(entryStream);
                    }
                }
            }

            return memoryStream.ToArray();
        }

        public static async Task<byte[]> GetZipFile(string eirGuid, string url)
        {
            HttpClient _httpClient = new HttpClient();
            try
            {
                string endpointUrl = url;  //"http://localhost:5176/api/v2/AzureBlob/GetZipFilesByGroupGuid";

                var jsonBody = JsonSerializer.Serialize(eirGuid);

                var content = new StringContent(jsonBody, Encoding.UTF8, "application/json");

                var response = await _httpClient.PostAsync(endpointUrl, content);

                if (!response.IsSuccessStatusCode)
                {
                    throw new Exception($"Failed to fetch ZIP: {response.StatusCode}");
                }

                var zipBytes = await response.Content.ReadAsByteArrayAsync();
                return zipBytes;
            }
            catch(Exception ex)
            {
                throw ex;

            }
        }

        public static async Task<JArray> GetFunctionsByUser(ApplicationDbContext _dbContext, string userId)
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

                var result = await functionNames.ToListAsync();
                JArray functionNamesArray = new JArray();

                if (result != null)
                    functionNamesArray = JArray.FromObject(result);

                var addHocfunctionNames = from f in _dbContext.functions
                                          join uf in _dbContext.user_functions
                                          on f.guid equals uf.functions_guid
                                          where f.delete_dt == null && uf.delete_dt == null &&
                                          uf.user_guid == userId && uf.adhoc == true
                                          select f.code;

                if (addHocfunctionNames != null)
                {
                    var resultNames = await addHocfunctionNames.ToArrayAsync();
                    foreach (var item in JArray.FromObject(resultNames))
                    {
                        functionNamesArray.Add(item);
                    }
                }

                var adHocFuncDisable = from f in _dbContext.user_functions
                                       where f.delete_dt == null && f.user_guid == userId && f.adhoc == false
                                       join func in _dbContext.functions on f.functions_guid equals func.guid
                                       select func.code;

                if (adHocFuncDisable != null)
                {
                    var resultNames = await adHocFuncDisable.ToArrayAsync();

                    foreach (var disabled in JArray.FromObject(resultNames))
                    {
                        Console.WriteLine(disabled.ToString());
                        //var token = functionNamesArray.FirstOrDefault(t => t.ToString() == disabled);
                        //if (token != null)
                        //{
                        //    functionNamesArray.Remove(token);
                        //}
                    }
                }

                return functionNamesArray;

            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                Debug.WriteLine(ex.StackTrace);
                throw ex;
            }
        }

        public static async Task<JArray> GetRolesByUser(ApplicationDbContext _dbContext, string userId)
        {
            try
            {
                var roleNames = from r in _dbContext.role
                                join ur in _dbContext.user_role
                                on r.guid equals ur.role_guid
                                where ur.user_guid == userId && r.delete_dt == null && ur.delete_dt == null
                                select r.code;

                var result = await roleNames.ToListAsync();
                JArray roleNamesArray = new JArray();
                if (result != null)
                    roleNamesArray = JArray.FromObject(result);

                return roleNamesArray;

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static List<string> GetTeamsByUser(ApplicationDbContext _dbContext, string userId)
        {
            try
            {
                //var teamDetails = from t in _dbContext.team
                //                  join ut in _dbContext.team_user
                //                  on t.guid equals ut.team_guid
                //                  where ut.userId == userId && t.delete_dt == null && ut.delete_dt == null
                //                  select t.description;

                //                  //select new
                //                  //{
                //                  //    Description = t.description,
                //                  //    Department = t.department_cv
                //                  //};

                //JArray teamDetailsArray = JArray.FromObject(teamDetails);
                //return teamDetailsArray;

                var teamDetails = (from t in _dbContext.team
                                   join ut in _dbContext.team_user on t.guid equals ut.team_guid
                                   where ut.userId == userId && t.delete_dt == null && ut.delete_dt == null
                                   select new
                                   {
                                       Description = t.description,
                                       Department = t.department_cv
                                   }).ToList();
                var result = teamDetails
                .Select(t => $"{t.Description} - {t.Department}")
                .ToList();

                return result;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public static async Task<(HttpStatusCode, string)> GetLicenseValidity(ApplicationDbContext _dbContext, string licKey, IConfiguration _config)
        {
            var httpClient = new HttpClient();

            string url = _config["License:Url_Validity"];

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

        public static async Task<(HttpStatusCode, string)> ActivateUserLicense(ApplicationDbContext _dbContext, StaffActivateDTO staffInfo, IConfiguration _config)
        {
            var httpClient = new HttpClient();

            string url = _config["License:Url_Activation"];

            // Read JSON string from appsettings.json
            //string jsonPayload = _config["License:ActivationKey"];

            //string encoded = WebUtility.UrlEncode(licKey);
            string jsonEncoded = JsonSerializer.Serialize(staffInfo);

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
