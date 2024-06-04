using DWMS.User.Authentication.API.Models.Authentication.Login;
using DWMS.User.Authentication.Service.Models;
using DWMS.User.Authentication.Service.Services;
using DWMS.UserAuthentication.Models;
using DWMS.UserAuthentication.Models.Authentication.Login;
using DWMS.UserAuthentication.Models.Authentication.SignUp;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace DWMS.UserAuthentication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;

        public AuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IEmailService emailService)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            _signInManager = signInManager;
            
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
            
            var email = User.FindFirstValue(ClaimTypes.Email);
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null)
            {
                return NotFound(new { Errors = new[] { "User not found." } });
            }

            var result = await _userManager.ChangePasswordAsync(user, model.OldPassword, model.NewPassword);

            if (result.Succeeded)
            {
                return Ok( new Response() { Status = "OK", Message = new string[] { "Password changed successfully." } });
            }

            return BadRequest(new Response(){ Status="Error" , Message = result.Errors.Select(e => e.Description) });
        }

        [HttpPost("UserLogin")]
        [AllowAnonymous]
        public async Task<IActionResult> UserSignUp([FromBody] LoginUserModel loginModel)
        {
            //checking the user
            var user = await _userManager.FindByEmailAsync(loginModel.Email);

            

            //validate the user password

            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                if(!user.EmailConfirmed)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new Response() { Status = "Error", Message = new string[] { "The user account is not yet activated. Please activate the account with the link sent previously" } });
                }

                // claimlist creation
                var authClaims = new List<Claim>
                    {
                        new Claim(ClaimTypes.Email, user.Email),
                        new Claim(ClaimTypes.GroupSid, "c1"),
                        new Claim(JwtRegisteredClaimNames.Jti,Guid.NewGuid().ToString()),

                    };


                var userRoles = await _userManager.GetRolesAsync(user);
                foreach (var role in userRoles)
                {
                    authClaims.Add(new Claim(ClaimTypes.Role, role));
                }

                //generate the token with the claims

                var jwtToken = GetToken(authClaims);
                //returning the token
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo });
            }

            return Unauthorized();
        }


        [HttpPost("UserSignUp")]
        [AllowAnonymous]
        public async Task<IActionResult> UserSignUp([FromBody] RegisterUser registerUser)
        {
            string role = "Customer";
            try
            {

                var userExist = await _userManager.FindByEmailAsync(registerUser.Email!);
                if (userExist != null)
                {
                    if (userExist.EmailConfirmed)
                    {
                        return StatusCode(StatusCodes.Status302Found, new Response() { Status = "Error", Message = new string[] { "The email had been registered previously" } });

                    }

                    var token1 = await _userManager.GenerateEmailConfirmationTokenAsync(userExist);
                    var confirmationLink1 = Url.Action(nameof(ConfirmEmail), "Authentication", new { token1, email = userExist.Email }, Request.Scheme);
                    var message1 = new Message(new string[] { userExist.Email! }, "Confirmation email link", confirmationLink1);
                    _emailService.SendMail(message1);

                    return StatusCode(StatusCodes.Status200OK,
                      new Response { Status = "Success", Message = new string[] { $"The activation email has been sent again successfully to {userExist.Email} for confirmation !" } });

                }

                    ApplicationUser user = new()
                {
                    UserName = registerUser.Email,
                    Email = registerUser.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    CorporateID = registerUser.CorporateId.Value
                };

                if (!await _roleManager.RoleExistsAsync(role))
                {
                    return StatusCode(StatusCodes.Status403Forbidden,
                       new Response { Status = "Error", Message = new string[] { "This role doesn't  exists!" } });
                }

                var result = await _userManager.CreateAsync(user, registerUser.Password);
                if (!result.Succeeded)
                {
                    var Errors = result.Errors.Select(e => e.Description);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = Errors });
                }


                await _userManager.AddToRoleAsync(user, role);

                //add token to verify the email
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "Authentication", new { token, email = user.Email }, Request.Scheme);
                var message = new Message(new string[] { user.Email! }, "Confirmation email link", confirmationLink);
                _emailService.SendMail(message);

                return StatusCode(StatusCodes.Status200OK,
                       new Response { Status = "Success", Message = new string[] { $"User created & Email Sent successfully to {user.Email} for confirmation !" } });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
            
            return Unauthorized();

        }

        [HttpGet("ConfirmEmail")]
        [AllowAnonymous]
        public async Task<IActionResult> ConfirmEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user != null)
            {
                var result = await _userManager.ConfirmEmailAsync(user, token);
                if (result.Succeeded)
                {
                    return StatusCode(StatusCodes.Status200OK,
                        new Response { Status = "Success", Message = new string[] { "Email verified Successfully" } });
                }
            }
            return StatusCode(StatusCodes.Status500InternalServerError, new Response { Status = "Error", Message = new string[] { "This user doesn't exist!" } });
        }


        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                  issuer: _configuration["JWT:ValidIssuer"],
                  audience: _configuration["JWT:ValidAudience"],
                  expires: DateTime.Now.AddHours(5),
                  claims: authClaims,
                  signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );
            return token;
        }
    }
}
