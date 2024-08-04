using DWMS.User.Authentication.API.Models.Authentication;
using DWMS.User.Authentication.API.Models.Authentication.Login;
using DWMS.User.Authentication.API.Models.RefreshToken;
using DWMS.User.Authentication.API.Utilities;
using DWMS.User.Authentication.Service.Models;
using DWMS.User.Authentication.Service.Services;
using DWMS.UserAuthentication.Models;
using DWMS.UserAuthentication.Models.Authentication.Login;
using DWMS.UserAuthentication.Models.Authentication.SignUp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

namespace DWMS.User.Authentication.API.Controllers
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

        public StaffAuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, 
            SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IEmailService emailService,
            IRefreshTokenStore refreshTokenStore)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            _signInManager = signInManager;
            _jwtTokenService = new JwtTokenService(_configuration);
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
               
                // claimlist creation
                //var authClaims = new List<Claim>
                //    {
                //        new Claim(ClaimTypes.Name , staff.UserName),
                //        new Claim(ClaimTypes.Email, staff.Email),
                //        new Claim(ClaimTypes.GroupSid, "s1"),
                //        new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),

                //    };

                var staffRoles = await _userManager.GetRolesAsync(staff);

                
                //foreach (var role in staffRoles)
                //{
                //    authClaims.Add(new Claim(ClaimTypes.Role, role));
                //    if (role.Trim().ToLower() == "admin")
                //        authClaims.Add(new Claim(ClaimTypes.PrimaryGroupSid, "a1"));
                //}

                //generate the token with the claims
                //var authClaims = Utilities.utils.GetClaims(2,staff.UserName,staff.Email,staffRoles);
                var jwtToken = _jwtTokenService.GetToken(2, staff.UserName, staff.Email, staffRoles); //Utilities.utils.GetToken(_configuration,authClaims);
                var refreshToken = new RefreshToken() { ExpiryDate = jwtToken.ValidTo, UserId = staff.UserName, Token = _jwtTokenService.GenerateRefreshToken() };

                _refreshTokenStore.AddToken(refreshToken);
                //returning the token
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo, refreshToken= refreshToken.Token });
            }

            return Unauthorized();
        }

        [HttpPost("CreateStaffCredential")]
        public async Task<IActionResult> CreateStaffCredential([FromBody] RegisterStaff registerStaff,string role)
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

                    //var token1 = await _userManager.GenerateEmailConfirmationTokenAsync(userExist);
                    //var confirmationLink1 = Url.Action(nameof(ConfirmEmail), "Authentication", new { token1, email = userExist.Email }, Request.Scheme);
                    //var message1 = new Message(new string[] { userExist.Email! }, "Confirmation email link", confirmationLink1);
                    //_emailService.SendMail(message1);

                    //return StatusCode(StatusCodes.Status200OK,
                    //  new Response { Status = "Success", Message = new string[] { $"The activation email has been sent again successfully to {userExist.Email} for confirmation !" } });

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

                if (!await _roleManager.RoleExistsAsync(role))
                {
                   var ctRoleRes= await this.CreateRole(role);

                    if(ctRoleRes==-1)
                    {
                        return StatusCode(StatusCodes.Status403Forbidden,
                       new Response { Status = "Error", Message = new string[] { "This role doesn't  exists!" } });
                    }
                    //_roleManager.
                    
                }

                
                var result = await _userManager.CreateAsync(staff, registerStaff.Password);
                if (!result.Succeeded)
                {
                    var Errors = result.Errors.Select(e => e.Description);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = Errors });
                }


                await _userManager.AddToRoleAsync(staff, role);

                
              

                return StatusCode(StatusCodes.Status200OK,
                       new Response { Status = "Success", Message = new string[] { $"Staff created  successfully - {staff.UserName}  !" } });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }

            return Unauthorized();

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

            var newJwtToken = _jwtTokenService.GetToken(2, user.UserName, user.Email, userRoles);
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
