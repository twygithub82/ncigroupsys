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
using Newtonsoft.Json.Linq;
using System;
using System.Data;
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
    public class TeamsController : ControllerBase
    {

        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IRefreshTokenStore _refreshTokenStore;
        private readonly ApplicationDbContext _dbContext;

        public TeamsController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
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
        }

        // GET: api/team
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Team>>> GetTeams()
        {
            try
            {
                var result = await _dbContext.team.Where(t => t.delete_dt == null).ToListAsync();
                return StatusCode(StatusCodes.Status200OK, result);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

        }


        // GET: api/team/{guid}
        [HttpGet("{guid}")]
        public async Task<ActionResult<team>> GetTeam(string guid)
        {
            try
            {
                var team = await _dbContext.team.FirstOrDefaultAsync(r => r.guid == guid && r.delete_dt == null);
                if (team == null) return NotFound();
                return StatusCode(StatusCodes.Status200OK, team);
            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }


        // GET: api/team/{guid}
        [HttpGet("GetTeamByDescription")]
        public async Task<ActionResult<team>> GetTeamByDescription(string? description)
        {
            try
            {
                if (description == null)
                    description = "";
                var team = await _dbContext.team.Where(t => t.description.Contains(description.ToUpper()) && t.delete_dt == null).ToListAsync();

                if (team == null) return NotFound();
                return StatusCode(StatusCodes.Status200OK, team);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }


        // POST: api/team
        [HttpPost]
        public async Task<ActionResult<Team>> CreateTeam([FromBody] TeamDto dto)
        {
            try
            {
                var username = User?.Identity?.Name;
                var team = new team
                {
                    guid = utils.GetGuidString(),
                    description = dto.Description,
                    department_cv = dto.DepartmentCv,
                    create_dt = DateTimeOffset.UtcNow.ToUnixTimeSeconds(),
                    create_by = username // replace with logged-in user if available
                };

                _dbContext.team.Add(team);
                await _dbContext.SaveChangesAsync();

                return CreatedAtAction(nameof(GetTeam), new { guid = team.guid }, team);
            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }

        // PUT: api/team/{guid}
        [HttpPut("{guid}")]
        public async Task<IActionResult> UpdateTeam(string guid, [FromBody] TeamDto dto)
        {
            try
            {
                var username = User?.Identity?.Name;

                var team = await _dbContext.team.FirstOrDefaultAsync(t => t.guid == guid && t.delete_dt == null);
                if (team == null) return NotFound();

                team.description = dto.Description;
                team.department_cv = dto.DepartmentCv;
                team.update_dt = utils.GetNowEpochInSec();
                team.update_by = username; // replace with logged-in user

                await _dbContext.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
        }

        // DELETE: api/team/
        [HttpDelete]
        public async Task<IActionResult> DeleteTeam([FromBody] List<string> guid)
        {
            try
            {
                var username = User?.Identity?.Name;
                var currentDateTime = utils.GetNowEpochInSec();

                var teams = await _dbContext.team.Where(r => guid.Contains(r.guid) && r.delete_dt == null).ToListAsync();
                if (teams == null) return NotFound();

                foreach (var team in teams)
                {
                    team.delete_dt = currentDateTime;
                    team.update_dt = currentDateTime;
                    team.update_by = username;
                }

                await _dbContext.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
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

    }
}
