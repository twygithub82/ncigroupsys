using IDMS.User.Authentication.API.Models.Authentication;
using IDMS.User.Authentication.API.Models.Authentication.Login;
using IDMS.User.Authentication.API.Models.RefreshToken;
using IDMS.User.Authentication.API.Utilities;
using IDMS.User.Authentication.Service.Services;
using IDMS.UserAuthentication.DB;
using IDMS.UserAuthentication.Models;
using IDMS.UserAuthentication.Models.Authentication.Login;
using IDMS.UserAuthentication.Models.Authentication.SignUp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Bcpg;
using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Security.Claims;
using System.Security.Cryptography.Xml;
using static IDMS.User.Authentication.API.Models.StaticConstant;

namespace IDMS.User.Authentication.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    //[ApiVersion("1.0")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class StaffAuthenticationController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IRefreshTokenStore _refreshTokenStore;
        private readonly ApplicationDbContext _dbContext;

        public StaffAuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IEmailService emailService,
            IRefreshTokenStore refreshTokenStore, ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            _signInManager = signInManager;
            _dbContext = context;
            _jwtTokenService = new JwtTokenService(_configuration, _dbContext);
            _refreshTokenStore = refreshTokenStore;

            //InitDB();
        }

        [HttpGet("CheckLicenseValidity")]
        [AllowAnonymous]
        public async Task<IActionResult> HelloWorld(string email)
        {
            try
            {
                string userEmail = email;

                var userLic = await _dbContext.user_license.Where(u => u.user_email == userEmail).FirstOrDefaultAsync();
                if (userLic == null)
                    return Unauthorized("User license not found.");

                (var statusCode, var message) = await utils.GetLicenseValidity(_dbContext, userLic.license_key, _configuration);
                if (statusCode != System.Net.HttpStatusCode.OK)
                    return Unauthorized(message);

                //check token authentic
                JObject JWT = JObject.Parse(message);
                var claims = _jwtTokenService.GetPrincipalFromToken(JWT["token"].ToString());
                if (claims != null)
                {
                    var licStatusCode = claims.FindFirst("StatusCode")?.Value?.ToString() ?? "";
                    var statusMessage = claims.FindFirst("StatusMessage")?.Value?.ToString() ?? "";
                    var statusDesc = claims.FindFirst("StatusDescription")?.Value?.ToString() ?? "";

                    var licenseObject = new LicenseStatus();
                    licenseObject.StatusCode = int.Parse(licStatusCode);
                    licenseObject.StatusMessage = statusMessage;
                    licenseObject.StatusDescription = statusDesc;
                    if (Enum.TryParse(licStatusCode, out LicenseStatusEnum status) && status == LicenseStatusEnum.Valid)
                    {
                        //Continue to get actual user claims
                        return Ok(licenseObject);
                    }
                    else
                    {
                        return Unauthorized(licenseObject);
                    }
                }
                return Unauthorized("Invalid user claim");
            }
            catch (SecurityTokenException se)
            {
                return BadRequest(se.Message);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [HttpPost("GetUserClaims")]
        //[AllowAnonymous]
        public async Task<IActionResult> GetUserClaims([FromBody] UserClaimModel userClaimModel)
        {
            try
            {
                if (!string.IsNullOrEmpty(userClaimModel.UserId))
                {
                    //To be replace
                    JArray functionNamesArray = utils.GetFunctionsByUser(_dbContext, userClaimModel.UserId);
                    JArray roleNameArray = utils.GetRolesByUser(_dbContext, userClaimModel.UserId);

                    JObject userClaims = new JObject();
                    userClaims["roles"] = roleNameArray;
                    userClaims["functions"] = functionNamesArray;

                    return Ok(userClaims.ToString());

                }
                return Unauthorized();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

        }

        [HttpPost("StaffLogin")]
        [AllowAnonymous]
        public async Task<IActionResult> StaffSignIn([FromBody] LoginStaffModel staffModel)
        {
            try
            {
                //checking the staff
                var staff = await _userManager.FindByNameAsync(staffModel.Username);
                if (staff == null)
                    return NotFound(new { username = staffModel.Username });

                //validate the user password
                if (!await _userManager.CheckPasswordAsync(staff, staffModel.Password))
                    return Unauthorized(new { message = "Invalid username/password" });


                //Continue to get actual user claims
                var staffRoles = await _userManager.GetRolesAsync(staff);
                staff.CurrentSessionId = Guid.NewGuid();
                //generate the token with the claims
                //var authClaims = Utilities.utils.GetClaims(2,staff.UserName,staff.Email,staffRoles);
                var jwtToken = _jwtTokenService.GetToken(UserType.Staff, staff.UserName, staff.Email, staffRoles, staff.Id, $"{staff.CurrentSessionId}"); //Utilities.utils.GetToken(_configuration,authClaims);
                var refreshToken = new RefreshToken() { ExpiryDate = jwtToken.ValidTo, UserId = staff.UserName, Token = _jwtTokenService.GenerateRefreshToken() };

                _refreshTokenStore.AddToken(refreshToken);
                _dbContext.SaveChangesAsync();
                //returning the token
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo, refreshToken = refreshToken.Token });

            }
            catch (SecurityTokenException se)
            {
                return BadRequest(se.Message);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //[HttpPost("StaffLogin")]
        //[AllowAnonymous]
        //public async Task<IActionResult> StaffSignIn([FromBody] LoginStaffModel staffModel)
        //{
        //    try
        //    {
        //        //checking the staff
        //        var staff = await _userManager.FindByNameAsync(staffModel.Username);
        //        if (staff == null)
        //            return NotFound(new { username = staffModel.Username });

        //        //validate the user password
        //        if (!await _userManager.CheckPasswordAsync(staff, staffModel.Password))
        //            return Unauthorized(new { message = "Invalid username/password" });


        //        //validate user license
        //        var userLic = await _dbContext.user_license.Where(u => u.user_email == staff.Email).FirstOrDefaultAsync();
        //        if (userLic == null || string.IsNullOrEmpty(userLic?.license_key))
        //            return Unauthorized(new { message = "User license not found" });

        //        //Get User license validity
        //        (var statusCode, var message) = await utils.GetLicenseValidity(_dbContext, userLic.license_key, _configuration);
        //        if (statusCode != System.Net.HttpStatusCode.OK)
        //            return Unauthorized(message);

        //        //check JWT token authenticity
        //        JObject JWT = JObject.Parse(message);
        //        var claims = _jwtTokenService.GetPrincipalFromToken(JWT["token"].ToString());
        //        if (claims != null)
        //        {
        //            var licStatusCode = claims.FindFirst("StatusCode")?.Value?.ToString() ?? "";
        //            var statusMessage = claims.FindFirst("StatusMessage")?.Value?.ToString() ?? "";
        //            var statusDesc = claims.FindFirst("StatusDescription")?.Value?.ToString() ?? "";

        //            if (licStatusCode == LicenseStatusEnum.Valid.ToString())
        //            {
        //                //Continue to get actual user claims
        //                var staffRoles = await _userManager.GetRolesAsync(staff);

        //                //generate the token with the claims
        //                //var authClaims = Utilities.utils.GetClaims(2,staff.UserName,staff.Email,staffRoles);
        //                var jwtToken = _jwtTokenService.GetToken(UserType.Staff, staff.UserName, staff.Email, staffRoles, staff.Id); //Utilities.utils.GetToken(_configuration,authClaims);
        //                var refreshToken = new RefreshToken() { ExpiryDate = jwtToken.ValidTo, UserId = staff.UserName, Token = _jwtTokenService.GenerateRefreshToken() };

        //                _refreshTokenStore.AddToken(refreshToken);
        //                //returning the token
        //                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo, refreshToken = refreshToken.Token });
        //            }
        //            else
        //            {
        //                var licenseObject = new LicenseStatus();
        //                licenseObject.StatusCode = int.Parse(licStatusCode);
        //                licenseObject.StatusMessage = statusMessage;
        //                licenseObject.StatusDescription = statusDesc;

        //                return Unauthorized(licenseObject);
        //            }
        //        }
        //        return Unauthorized(new { message = "Invalid user claim" });
        //    }
        //    catch (SecurityTokenException se)
        //    {
        //        return BadRequest(se.Message);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}


        //[HttpPost("AssignStaffRolesAndTeams")]
        //public async Task<IActionResult> AssignUserCredential([FromBody] AssignRolesTeams assignRolesTeamsToUser)
        //{
        //    //string role = "Customer";
        //    try
        //    {
        //        var primarygroupSid = User.FindFirstValue("PrimaryGroupSid");
        //        if (primarygroupSid != "a1")
        //            return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });


        //        var Username = assignRolesTeamsToUser.UserName;
        //        var roles = assignRolesTeamsToUser.Roles;
        //        var teams = assignRolesTeamsToUser.Teams;

        //        var staffExist = await _userManager.FindByNameAsync(Username!);
        //        if (staffExist == null) return StatusCode(StatusCodes.Status204NoContent, new Response() { Status = "Error", Message = new string[] { "The user not found" } });

        //        var result = await AssignRolesTeams(staffExist.Id, roles, teams);
        //        if (!(result is ObjectResult objectResult && objectResult.StatusCode == StatusCodes.Status200OK
        //           || result is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode == StatusCodes.Status200OK))
        //        {
        //            return result;
        //        }

        //        return StatusCode(StatusCodes.Status200OK,
        //           new Response { Status = "Success", Message = new string[] { $"Staff roles and teams  successfully assigned - {Username}  !" } });

        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
        //    }
        //}


        [HttpPost("CreateStaffCredential")]
        public async Task<IActionResult> CreateStaffCredential([FromBody] RegisterStaff registerStaff)
        {
            try
            {
                var primarygroupSid = User.FindFirstValue("primarygroupsid");
                if (primarygroupSid != "a1")
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });

                var staffExist = await _userManager.FindByIdAsync(registerStaff.Username!);
                if (staffExist != null)
                    return StatusCode(StatusCodes.Status302Found, new Response() { Status = "Error", Message = new string[] { "The email had been registered previously" } });

                ApplicationUser staff = new()
                {
                    UserName = registerStaff.Username,
                    Email = registerStaff.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    CorporateID = registerStaff.CorporateId.Value,
                    isStaff = true,
                    EmailConfirmed = true,
                };

                var result = await _userManager.CreateAsync(staff, registerStaff.Password);
                if (!result.Succeeded)
                {
                    var Errors = result.Errors.Select(e => e.Description);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = Errors });
                }

                var userGuid = staff.Id;
                var rst = await AssignRolesTeams(userGuid, registerStaff.Roles, registerStaff.Teams);
                if (!(rst is ObjectResult objectResult && objectResult.StatusCode == StatusCodes.Status200OK
                                   || rst is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode == StatusCodes.Status200OK))
                    return rst;

                return StatusCode(StatusCodes.Status200OK,
                   new Response { Status = "Success", Message = new string[] { $"Staff created  successfully - {staff.UserName}  !" } });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }

        [HttpDelete("RemoveStaff")]
        public async Task<IActionResult> RemoveStaff([FromBody] QueryStaff removeStaff)
        {
            try
            {
                var loginUser = User.FindFirstValue("name");
                var primarygroupSid = User.FindFirstValue("primarygroupsid");

                if (primarygroupSid != "a1")
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });

                ApplicationUser? staffUser = null;
                if (!string.IsNullOrEmpty(removeStaff.Username))
                    staffUser = await _userManager.FindByNameAsync(removeStaff.Username!);
                else if (string.IsNullOrEmpty(removeStaff.Email))
                    staffUser = await _userManager.FindByEmailAsync(removeStaff.Email!);

                if (staffUser == null) return StatusCode(StatusCodes.Status404NotFound, new Response() { Status = "Error", Message = new string[] { "The user not found" } });

                var staffGuid = staffUser.Id;
                var rst = await _userManager.DeleteAsync(staffUser);
                if (rst.Succeeded)
                {
                    var userTeams = from tu in _dbContext.team_user where tu.userId == staffGuid select tu;
                    if (userTeams.Any())
                    {
                        foreach (var t in userTeams)
                        {
                            t.delete_dt = utils.GetNowEpochInSec();
                            t.update_dt = utils.GetNowEpochInSec();
                            t.update_by = loginUser;
                        }
                        _dbContext.SaveChanges();
                    }
                }

                return StatusCode(StatusCodes.Status200OK, new Response() { Status = "Error", Message = new string[] { "The user has been removed successfully" } });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }

        [HttpPost("QueryStaff")]
        public async Task<IActionResult> QueryStaff([FromBody] QueryStaff staff)
        {
            try
            {
                var primarygroupSid = User.FindFirstValue("primarygroupsid");
                if (primarygroupSid != "a1")
                {
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });
                }

                List<QueryStaffResult> result = new List<QueryStaffResult>();

                // Start the query with users filtered by role and isStaff flag
                var usersQuery = _dbContext.Users.Where(u => u.UserName != "admin" && u.isStaff == true);

                // Apply username filter if provided
                if (!string.IsNullOrEmpty(staff.Username))
                {
                    usersQuery = usersQuery.Where(u => u.UserName == staff.Username);
                }
                else if (!string.IsNullOrEmpty(staff.Email))
                {
                    usersQuery = usersQuery.Where(u => u.Email.Contains(staff.Email));
                }

                var users = await usersQuery.ToListAsync();
                foreach (var usr in users)
                {
                    QueryStaffResult s = new QueryStaffResult()
                    {
                        Email = usr.Email,
                        Username = usr.UserName,
                        Name = usr.NormalizedUserName,
                        ContactNo = usr.PhoneNumber,
                    };

                    //var roles = await _userManager.GetRolesAsync(usr);
                    //s.Roles = roles?.ToList();

                    var roles = utils.GetRolesByUser(_dbContext, usr.Id);
                    s.Roles = roles.ToObject<List<string>>();

                    var teamDetails = utils.GetTeamsByUser(_dbContext, usr.Id);
                    s.Teams = teamDetails.ToObject<List<string>>();

                    //var userTeams = from tu in _dbContext.team_user
                    //                join t in _dbContext.team on tu.team_guid equals t.guid
                    //                where tu.userId == usr.Id && tu.delete_dt == null
                    //                select new { t.description, Department = t.department_cv };

                    //s.Teams = userTeams.Select(ut => new Team
                    //{
                    //    Description = ut.description,
                    //    Department = ut.Department
                    //}).ToList();
                    // Filter roles if provided
                    result.Add(s);
                }

                return StatusCode(StatusCodes.Status200OK, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }

        [HttpPost("UpdateStaff")]
        public async Task<IActionResult> UpdateStaff(string userId, [FromBody] UpdateStaff staff)
        {
            try
            {
                var primarygroupSid = User.FindFirstValue("primarygroupsid");
                var username = User.FindFirstValue("name");
                var currentDateTime = utils.GetNowEpochInSec();

                if (primarygroupSid != "a1")
                {
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });
                }

                List<QueryStaffResult> result = new List<QueryStaffResult>();
                // Start the query with users filtered by role and isStaff flag
                var user = await _dbContext.Users.Where(u => u.Id == userId && u.isStaff == true).FirstOrDefaultAsync();
                if (user == null)
                    return NotFound(new { message = "User not found." });

                //user.Email = staff.Email;
                //user.NormalizedEmail = staff.Email.ToUpper();
                if (!string.IsNullOrEmpty(staff.ContactNumber))
                    user.PhoneNumber = staff.ContactNumber;

                foreach (var item in staff.Roles)
                {
                    if (item.action.ToUpper() == "NEW")
                    {
                        var newUserRole = new user_role();
                        newUserRole.guid = utils.GetGuidString();
                        newUserRole.user_guid = user.Id;
                        newUserRole.role_guid = item.guid;
                        newUserRole.create_by = username;
                        newUserRole.update_by = username;
                        newUserRole.create_dt = currentDateTime;
                        newUserRole.update_dt = currentDateTime;
                        await _dbContext.user_role.AddAsync(newUserRole);
                    }

                    if (item.action.ToUpper() == "CANCEL")
                    {
                        var delUserRole = new user_role() { guid = item.guid };
                        delUserRole.update_by = username;
                        delUserRole.update_dt = currentDateTime;
                        delUserRole.delete_dt = currentDateTime;
                    }
                }

                foreach (var item in staff.Teams)
                {
                    if (item.action.ToUpper() == "NEW")
                    {
                        var newUserTeam = new team_user();
                        newUserTeam.guid = utils.GetGuidString();
                        newUserTeam.userId = user.Id;
                        newUserTeam.team_guid = item.guid;
                        newUserTeam.create_by = username;
                        newUserTeam.update_by = username;
                        newUserTeam.create_dt = currentDateTime;
                        newUserTeam.update_dt = currentDateTime;
                        await _dbContext.team_user.AddAsync(newUserTeam);
                    }

                    if (item.action.ToUpper() == "CANCEL")
                    {
                        var delUserRole = new team_user() { guid = item.guid };
                        delUserRole.update_by = username;
                        delUserRole.update_dt = currentDateTime;
                        delUserRole.delete_dt = currentDateTime;
                    }
                }
                var ret = await _dbContext.SaveChangesAsync();
                return StatusCode(StatusCodes.Status200OK, new { message = "Record update successfully." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

            return Unauthorized();

        }

        private async Task<IActionResult> AssignRolesTeams(string userGuid, List<string> roles, List<Team> teams)
        {
            try
            {
                var result = await AssignUserToRoles(userGuid, roles);
                if (result is ObjectResult objectResult && objectResult.StatusCode == StatusCodes.Status200OK
                    || result is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode == StatusCodes.Status200OK)
                {
                    return await AssignUserToTeams(userGuid, teams);
                }
                else
                {
                    return result;
                }

                //return StatusCode(StatusCodes.Status200OK,
                //     new Response { Status = "Success", Message = new string[] { $"Assign roles and teams to staff  successfully !" } }); ;
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                     new Response { Status = "Success", Message = new string[] { $"{ex.Message}" } }); ;
            }
        }

        private async Task<IActionResult> AssignUserToRoles(string userGuid, List<string> roles)
        {
            try
            {
                //var roles = registerStaff.Roles;
                ApplicationUser user = await _userManager.FindByIdAsync(userGuid);
                var userRoles = await _userManager.GetRolesAsync(user);
                if (user == null)
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                          new Response { Status = "Error", Message = new string[] { "This staff not found!" } });
                }

                foreach (var role in roles)
                {
                    if (string.IsNullOrEmpty(role))
                    { continue; }

                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        var ctRoleRes = await this.CreateRole(role);

                        if (ctRoleRes == -1)
                        {
                            return StatusCode(StatusCodes.Status403Forbidden,
                           new Response { Status = "Error", Message = new string[] { "This role fail to create!" } });
                        }
                    }
                }


                foreach (var role in roles)
                {
                    if (string.IsNullOrEmpty(role))
                    { continue; }

                    if (!userRoles.Contains(role))
                    {
                        await _userManager.AddToRoleAsync(user, role);
                    }
                }

                foreach (var role in userRoles)
                {
                    if (!roles.Contains(role))
                    {
                        await _userManager.RemoveFromRoleAsync(user, role);
                    }
                }
            }
            catch { }

            return StatusCode(StatusCodes.Status200OK,
                       new Response { Status = "Success", Message = new string[] { $"Assign roles to staff  successfully !" } }); ;
        }

        private async Task<IActionResult> AssignUserToTeams(string userGuid, List<Team> teams)
        {

            try
            {
                var UserName_action = User.FindFirstValue("name");
                var userTeams = from tu in _dbContext.team_user
                                join t in _dbContext.team
                                on tu.team_guid equals t.guid
                                where (from u in _dbContext.Users where u.Id == userGuid select u.Id).Contains(tu.userId) && tu.delete_dt == null
                                select new { team_user_guid = tu.guid, team_guid = t.guid, userId = tu.userId, t.description, department = t.department_cv };

                var teamList = teams.ToList();
                var newTeamIds = _dbContext.team
                         .AsEnumerable() // Switch to client evaluation
                         .Where(t => teamList.Any(a => a.Department == t.department_cv && a.Description == t.description))
                         .Select(t => t.guid) // Assuming `guid` is the ID of the team
                         .ToList();

                var removedUserTeams = _dbContext.team_user
                   .Where(tu => tu.userId == userGuid && tu.delete_dt == null && !newTeamIds.Contains(tu.team_guid))
                   .ToList();

                List<team_user> assignedUserTeams = new List<team_user>();
                List<team> newTeams = new List<team>();
                foreach (var team in teams)
                {
                    if (string.IsNullOrEmpty(team.Description) || string.IsNullOrEmpty(team.Description))
                    { continue; }

                    team_user tu = null;
                    var newTeam = from t in _dbContext.team where (t.description == team.Description && t.department_cv == team.Department) select t;
                    if (!newTeam.Any())
                    {
                        var nt = new team();
                        nt.guid = Utilities.utils.GetGuidString();
                        nt.description = team.Description;
                        nt.department_cv = team.Department;
                        nt.create_by = UserName_action;
                        nt.create_dt = Utilities.utils.GetNowEpochInSec();

                        newTeams.Add(nt);

                        tu = new team_user()
                        {
                            guid = Utilities.utils.GetGuidString(),
                            userId = userGuid,
                            team_guid = nt.guid,
                            create_by = UserName_action,
                            create_dt = Utilities.utils.GetNowEpochInSec()
                        };
                    }
                    else
                    {
                        var team_guid = newTeam?.First().guid;
                        var tus = from u in userTeams where (u.userId == userGuid && u.team_guid == team_guid) select u;

                        if (!tus.Any())
                        {
                            tu = new team_user();
                            tu.guid = Utilities.utils.GetGuidString();
                            tu.userId = userGuid;
                            tu.team_guid = newTeam?.First().guid;
                            tu.create_by = UserName_action;
                            tu.create_dt = Utilities.utils.GetNowEpochInSec();
                        }
                    }
                    if (tu != null) assignedUserTeams.Add(tu);

                }
                // Add discrepancies (teams not in 'teams' input) to the removedUserTeams
                foreach (var t in removedUserTeams)
                {
                    t.delete_dt = Utilities.utils.GetNowEpochInSec();
                    t.update_dt = Utilities.utils.GetNowEpochInSec();
                    t.update_by = UserName_action;
                }


                await _dbContext.team_user.AddRangeAsync(assignedUserTeams);
                await _dbContext.team.AddRangeAsync(newTeams);
                await _dbContext.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                      new Response { Status = "Success", Message = new string[] { $"{ex.Message}" } });
            }

            return StatusCode(StatusCodes.Status200OK,
                      new Response { Status = "Success", Message = new string[] { $"Assign teams to staff  successfully !" } }); ;
        }

        private async Task<int> CreateRole(string roleName)
        {
            int retval = 0;
            // if (!_roleManager.RoleExistsAsync(roleName))
            {
                var role = new IdentityRole(roleName);
                var result = await _roleManager.CreateAsync(role);
                if (result.Succeeded)
                {
                    return 0;
                }
                else
                {
                    return -1;
                }
            }

            //return retval;
        }

        [HttpPost("ChangePassword")]
        public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordModel model)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (model.NewPassword != model.ConfirmPassword)
            {
                return BadRequest(new { Errors = new[] { "New password and confirmation password do not match." } });
            }

            var username = User.FindFirstValue("name");
            var user = await _userManager.FindByNameAsync(username);
            if (user == null)
            {
                return NotFound(new { Errors = new[] { "User not found." } });
            }

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok(new Response() { Status = "OK", Message = new string[] { "Password changed successfully." } });
            }

            return BadRequest(new Response() { Status = "Error", Message = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestModel refreshRequest)
        {

            try
            {
                // var principal = _jwtTokenService.GetPrincipalFromExpiredToken(refreshRequest.Token);
                var userName = User.Claims.FirstOrDefault(x => x.Type == "name")?.Value;
                var sessionId = User.Claims.FirstOrDefault(x => x.Type == "sessionId")?.Value;
                var refreshTokenKey = _refreshTokenStore.GetToken(userName);
                var user = await _userManager.FindByNameAsync(userName);
                if (userName == null || refreshTokenKey.Token != refreshRequest.RefreshToken || $"{sessionId}" != $"{user?.CurrentSessionId}")
                {
                    return Unauthorized();
                }


                var userRoles = await _userManager.GetRolesAsync(user);

                var newJwtToken = _jwtTokenService.GetToken(UserType.Staff, user.UserName, user.Email, userRoles, user.Id, $"{user.CurrentSessionId}");
                var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

                var refreshToken = new RefreshToken() { ExpiryDate = newJwtToken.ValidTo, UserId = user.UserName, Token = newRefreshToken };

                _refreshTokenStore.AddToken(refreshToken);
                _refreshTokenStore.RemoveToken(refreshRequest.RefreshToken);
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(newJwtToken),
                    expiration = newJwtToken.ValidTo,
                    refreshToken = newRefreshToken
                });

            }
            catch(Exception ex)
            {
                var userName = User.Claims.FirstOrDefault(x => x.Type == "name")?.Value;
                var user = await _userManager.FindByNameAsync(userName);

                var userRoles = await _userManager.GetRolesAsync(user);

                var newJwtToken = _jwtTokenService.GetToken(UserType.Staff, user.UserName, user.Email, userRoles, user.Id, $"{user.CurrentSessionId}");
                var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

                var refreshToken = new RefreshToken() { ExpiryDate = newJwtToken.ValidTo, UserId = user.UserName, Token = newRefreshToken };

                _refreshTokenStore.AddToken(refreshToken);
                _refreshTokenStore.RemoveToken(refreshRequest.RefreshToken);
                return Ok(new
                {
                    token = new JwtSecurityTokenHandler().WriteToken(newJwtToken),
                    expiration = newJwtToken.ValidTo,
                    refreshToken = newRefreshToken
                });

            }

           
        }

    }
}
