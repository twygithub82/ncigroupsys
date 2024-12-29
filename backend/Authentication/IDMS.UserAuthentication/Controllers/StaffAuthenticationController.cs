using IDMS.User.Authentication.API.Models.Authentication;
using IDMS.User.Authentication.API.Models.Authentication.Login;
using IDMS.User.Authentication.API.Models.RefreshToken;
using IDMS.User.Authentication.API.Utilities;
using IDMS.User.Authentication.Service.Models;
using IDMS.User.Authentication.Service.Services;
using IDMS.UserAuthentication.DB;
using IDMS.UserAuthentication.Models;
using IDMS.UserAuthentication.Models.Authentication.Login;
using IDMS.UserAuthentication.Models.Authentication.SignUp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography.Xml;

namespace IDMS.User.Authentication.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
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
            _refreshTokenStore= refreshTokenStore;
        }

        [HttpGet("Hello")]
        [AllowAnonymous]
        public async Task<string> HelloWorld()
        {
            return "Hello World";
        }

        [HttpPost("Hello")]
        [AllowAnonymous]
        public async Task<IActionResult> HelloWorld_Post([FromBody] LoginStaffModel staffModel)
        {
            staffModel.Username = "Hello";
            staffModel.Password = "OK";
            return Ok(staffModel);
        }

        [HttpPost("StaffLogin")]
        [AllowAnonymous]
        public async Task<IActionResult> StaffSignIn([FromBody] LoginStaffModel staffModel)
        {
            //checking the staff
            var staff = await _userManager.FindByNameAsync(staffModel.Username);



            //validate the user password

            if (staff != null && await _userManager.CheckPasswordAsync(staff, staffModel.Password))
            {
               
             

                var staffRoles = await _userManager.GetRolesAsync(staff);
          
                //generate the token with the claims
                //var authClaims = Utilities.utils.GetClaims(2,staff.UserName,staff.Email,staffRoles);
                var jwtToken = _jwtTokenService.GetToken(2, staff.UserName, staff.Email, staffRoles, staff.Id); //Utilities.utils.GetToken(_configuration,authClaims);
                var refreshToken = new RefreshToken() { ExpiryDate = jwtToken.ValidTo, UserId = staff.UserName, Token = _jwtTokenService.GenerateRefreshToken() };

                _refreshTokenStore.AddToken(refreshToken);
                //returning the token
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo, refreshToken= refreshToken.Token });
            }

            return Unauthorized();
        }



        [HttpPost("AssignStaffRolesAndTeams")]
        public async Task<IActionResult> AssignUserCredential([FromBody] AssignRolesTeams assignRolesTeamsToUser)
        {
            //string role = "Customer";
            try
            {
                var primarygroupSid = User.FindFirstValue(ClaimTypes.PrimaryGroupSid);

                if (primarygroupSid != "a1")
                {
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });
                }

                var Username = assignRolesTeamsToUser.UserName;
                var roles = assignRolesTeamsToUser.Roles;
                var teams = assignRolesTeamsToUser.Teams;

                var staffExist = await _userManager.FindByNameAsync(Username!);
                if (staffExist == null) return StatusCode(StatusCodes.Status204NoContent, new Response() { Status = "Error", Message = new string[] { "The user not found" } });

                var result = await AssignRolesTeams(staffExist.Id, roles, teams);
                if (!(result is ObjectResult objectResult && objectResult.StatusCode == StatusCodes.Status200OK
                   || result is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode == StatusCodes.Status200OK))
                {
                    return result;
                }
                
                    return StatusCode(StatusCodes.Status200OK,
                       new Response { Status = "Success", Message = new string[] { $"Staff roles and teams  successfully assigned - {Username}  !" } });

                }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

            return Unauthorized();

        }


        [HttpPost("CreateStaffCredential")]
        public async Task<IActionResult> CreateStaffCredential([FromBody] RegisterStaff registerStaff)
        {
            //string role = "Customer";
            try
            {
                var primarygroupSid = User.FindFirstValue(ClaimTypes.PrimaryGroupSid);

                if(primarygroupSid!="a1")
                {
                    return Unauthorized(new Response(){Status="Error",Message=new string[] { "Only administrators are allowed to create staff credential" } });
                }

                var staffExist = await _userManager.FindByIdAsync(registerStaff.Username!);
                if (staffExist != null)
                {
                   // if (userExist.EmailConfirmed)
                    {
                        return StatusCode(StatusCodes.Status302Found, new Response() { Status = "Error", Message = new string[] { "The email had been registered previously" } });

                    }

                }

                ApplicationUser staff = new()
                {
                    UserName = registerStaff.Username,
                    Email = registerStaff.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    CorporateID = registerStaff.CorporateId.Value,
                    isStaff = true,
                    EmailConfirmed=true
                };

            

                
                var result = await _userManager.CreateAsync(staff, registerStaff.Password);
                if (!result.Succeeded)
                {
                    var Errors = result.Errors.Select(e => e.Description);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = Errors });
                }
                
                var userGuid = staff.Id;

                var rst= await AssignRolesTeams(userGuid, registerStaff.Roles, registerStaff.Teams);
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

            return Unauthorized();

        }



        [HttpDelete("RemoveStaff")]
        public async Task<IActionResult> RemoveStaff([FromBody] string Username)
        {
            //string role = "Customer";
            try
            {
                var UserName_action = User.Identity.Name;
                var primarygroupSid = User.FindFirstValue(ClaimTypes.PrimaryGroupSid);

                if (primarygroupSid != "a1")
                {
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });
                }
                var staffExist = await _userManager.FindByNameAsync(Username!);
                if (staffExist == null) return StatusCode(StatusCodes.Status204NoContent, new Response() { Status = "Error", Message = new string[] { "The user not found" } });

                var staffGuid = staffExist.Id;

                var rst = await _userManager.DeleteAsync(staffExist);
                if (rst.Succeeded)
                {
                    var userTeams = from tu in _dbContext.team_user where tu.userId == staffGuid select tu;
                    if (userTeams.Any())
                    {
                        foreach (var t in userTeams)
                        {
                            t.delete_dt = Utilities.utils.GetNowEpochInSec();
                            t.update_dt = Utilities.utils.GetNowEpochInSec();
                            t.update_by = UserName_action;
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

            return Unauthorized();

        }


        [HttpPost("QueryStaff")]
        public async Task<IActionResult> QueryStaff([FromBody] QueryStaff staff)
        {
            //string role = "Customer";
            try
            {
                var primarygroupSid = User.FindFirstValue(ClaimTypes.PrimaryGroupSid);

                if (primarygroupSid != "a1")
                {
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });
                }

                List<QueryStaffResult> result = new List<QueryStaffResult>();

                // Start the query with users filtered by role and isStaff flag
                var usersQuery = _dbContext.Users
                    .Where(u => u.UserName != "admin" && u.isStaff == true);

                // Apply email filter if provided
                if (!string.IsNullOrEmpty(staff.Email))
                {
                    usersQuery = usersQuery.Where(u => u.Email.Contains(staff.Email));
                }

                // Apply username filter if provided
                if (!string.IsNullOrEmpty(staff.Username))
                {
                    usersQuery = usersQuery.Where(u => u.UserName == staff.Username);
                }

                var users = await usersQuery.ToListAsync();

                foreach (var usr in users)
                {
                    QueryStaffResult s = new QueryStaffResult()
                    {
                        Email = usr.Email,
                        Username = usr.UserName,
                    };

                    var roles =await _userManager.GetRolesAsync(usr);
                    s.Roles = roles?.ToList();

                    var userTeams = from tu in _dbContext.team_user
                                    join t in _dbContext.team on tu.team_guid equals t.guid
                                    where tu.userId == usr.Id && tu.delete_dt == null
                                    select new { t.description, Department = t.department_cv };

                    s.Teams = userTeams.Select(ut => new Team
                    {
                        Description = ut.description,
                        Department = ut.Department
                    }).ToList();

                    // Filter roles if provided
                    result.Add(s);
                }

                if (!string.IsNullOrEmpty(staff.Role))
                {
                    result = result.Where(r => r.Roles != null && r.Roles.Contains(staff.Role)).ToList();
                }

                if (!string.IsNullOrEmpty(staff.TeamDescription))
                {
                    result = result.Where(r => r.Teams != null && r.Teams.Any(t=>t.Description==staff.TeamDescription)).ToList();
                }

                return StatusCode(StatusCodes.Status200OK, result);

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

            return Unauthorized();

        }

        private async Task<IActionResult> AssignRolesTeams(string userGuid, List<string> roles ,List<Team>teams)
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
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError,
                     new Response { Status = "Success", Message = new string[] { $"{ex.Message}" } }); ;
            }

            return StatusCode(StatusCodes.Status200OK,
                      new Response { Status = "Success", Message = new string[] { $"Assign roles and teams to staff  successfully !" } }); ;
        }
        private async Task<IActionResult> AssignUserToRoles(string userGuid, List<string> roles)
        {
            

            try
            {
                //var roles = registerStaff.Roles;
                ApplicationUser user = await _userManager.FindByIdAsync(userGuid);
                var userRoles = await _userManager.GetRolesAsync(user);
                if (user == null) {
                    return StatusCode(StatusCodes.Status403Forbidden,
                          new Response { Status = "Error", Message = new string[] { "This staff not found!" } });
                }

                foreach (var role in roles)
                {

                    if (!await _roleManager.RoleExistsAsync(role))
                    {
                        var ctRoleRes = await this.CreateRole(role);

                        if (ctRoleRes == -1)
                        {
                            return StatusCode(StatusCodes.Status403Forbidden,
                           new Response { Status = "Error", Message = new string[] { "This role fail to create!" } });
                        }
                        //_roleManager.

                    }
                }


                foreach (var role in roles)
                {
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



        private async Task<IActionResult> AssignUserToTeams(string userGuid,  List<Team> teams)
        {
            
            try
            {
                var UserName_action = User.Identity.Name;
                

                var userTeams = from tu in _dbContext.team_user
                            join t in _dbContext.team
                            on tu.team_guid equals t.guid
                            where (from u in _dbContext.Users where u.Id == userGuid select u.Id).Contains(tu.userId) && tu.delete_dt == null
                                select new { team_user_guid=tu.guid, team_guid=t.guid, userId=tu.userId,  t.description,department= t.department_cv };

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
                        var team_guid= newTeam?.First().guid;
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
                    if(tu!=null)assignedUserTeams.Add(tu);
                    
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

            var username = User.FindFirstValue(ClaimTypes.Name);
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


           // var principal = _jwtTokenService.GetPrincipalFromExpiredToken(refreshRequest.Token);
            var userName = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value;

            var refreshTokenKey = _refreshTokenStore.GetToken(userName);
            if (userName == null || refreshTokenKey.Token != refreshRequest.RefreshToken)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);

            var newJwtToken = _jwtTokenService.GetToken(2, user.UserName, user.Email, userRoles, user.Id);
            var newRefreshToken = _jwtTokenService.GenerateRefreshToken();

            var refreshToken = new RefreshToken() { ExpiryDate = newJwtToken.ValidTo, UserId = user.UserName, Token = newRefreshToken };

            _refreshTokenStore.AddToken(refreshToken);

            return Ok(new
            {
                token = new JwtSecurityTokenHandler().WriteToken(newJwtToken),
                expiration = newJwtToken.ValidTo,
                refreshToken = newRefreshToken
            });
        }
    }
}
