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
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using static IDMS.User.Authentication.API.Models.StaticConstant;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace IDMS.UserAuthentication.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserAuthenticationController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly SignInManager<ApplicationUser> _signInManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IRefreshTokenStore _refreshTokenStore;
        private readonly ApplicationDbContext _dbContext;
        private readonly string _companyName;
        private readonly string _resetUrl;

        public UserAuthenticationController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
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

            _companyName = _configuration["EmailConfiguration:CompanyName"] ?? "IDMS Support Team";
            _resetUrl = _configuration["ResetLinkConfiguration:Url"] ?? "http://localhost:4200/#/authentication/reset-password";
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

            var email = User.FindFirstValue("email");
            if(email == null)
                email = User.FindFirstValue(ClaimTypes.Email);

            var user = await _userManager.FindByEmailAsync(email);
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

        [HttpPost("UserLogin")]
        [AllowAnonymous]
        public async Task<IActionResult> UserSignIn([FromBody] LoginUserModel loginModel)
        {
            //checking the user
            var user = await _userManager.FindByEmailAsync(loginModel.Email);
            if (user == null)
                return NotFound(new { username = loginModel.Email });

            //validate the user password
            if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
            {
                if (!user.EmailConfirmed)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new Response() { Status = "Error", Message = new string[] { "The user account is not yet activated. Please activate the account with the link sent previously" } });
                }

                var userRoles = await _userManager.GetRolesAsync(user);
                user.CurrentSessionId = Guid.NewGuid();
                var jwtToken = _jwtTokenService.GetToken(UserType.User, user.UserName, user.Email, userRoles, user.Id, $"{user.CurrentSessionId}"); //DWMS.User.Authentication.API.Utilities.utils.GetToken(_configuration, authClaims);
                var refreshToken = new RefreshToken() { ExpiryDate = jwtToken.ValidTo, UserId = user.UserName, Token = _jwtTokenService.GenerateRefreshToken() };

                _refreshTokenStore.AddToken(refreshToken);
                // _refreshTokens[user.UserName] = refreshToken;
                //returning the token
                return Ok(new { token = new JwtSecurityTokenHandler().WriteToken(jwtToken), expiration = jwtToken.ValidTo, refreshToken = refreshToken.Token });
            }

            return Unauthorized();
        }

        [HttpPost("RefreshToken")]
        public async Task<IActionResult> Refresh([FromBody] RefreshRequestModel refreshRequest)
        {
            //var principal = _jwtTokenService.GetPrincipalFromExpiredToken(refreshRequest.Token);
            //var userName = User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value;
            var userName = User.FindFirstValue("name");
            var refreshTokenKey = _refreshTokenStore.GetToken(userName);
            if (userName == null || refreshTokenKey.Token != refreshRequest.RefreshToken)
            {
                return Unauthorized();
            }

            var user = await _userManager.FindByNameAsync(userName);
            var userRoles = await _userManager.GetRolesAsync(user);

            var newJwtToken = _jwtTokenService.GetToken(UserType.User, user.UserName, user.Email, userRoles, user.Id, $"{user.CurrentSessionId}");
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
                    var confirmationLink1 = Url.Action(nameof(ConfirmEmail), "UserAuthentication", new { token1, email = userExist.Email }, Request.Scheme);
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
                var confirmationLink = Url.Action(nameof(ConfirmEmail), "UserAuthentication", new { token, email = user.Email }, Request.Scheme);
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


        [HttpPost("CreateUserByAdmin")]
        public async Task<IActionResult> CreateUserByAdmin([FromBody] CreateUser createUser)
        {
            try
            {
                var primarygroupSid = User.FindFirstValue("primarygroupsid");
                if (primarygroupSid == null)
                    primarygroupSid = User.FindFirstValue(ClaimTypes.PrimaryGroupSid);


                if (primarygroupSid != "a1")
                    return Unauthorized(new Response() { Status = "Error", Message = new string[] { "Only administrators are allowed to create staff credential" } });

                var staffExist = await _userManager.FindByIdAsync(createUser.Username!);
                if (staffExist != null)
                    return StatusCode(StatusCodes.Status302Found, new Response() { Status = "Error", Message = new string[] { "The username had been registered previously" } });

                ApplicationUser user = new()
                {
                    UserName = createUser.Username,
                    Email = createUser.Email,
                    SecurityStamp = Guid.NewGuid().ToString(),
                    CorporateID = createUser.CorporateId.Value,
                    isStaff = false,
                    EmailConfirmed = true,
                };

                var result = await _userManager.CreateAsync(user, createUser.Password);
                if (!result.Succeeded)
                {
                    var Errors = result.Errors.Select(e => e.Description);
                    return StatusCode(StatusCodes.Status500InternalServerError,
                        new Response { Status = "Error", Message = Errors });
                }

                //var userGuid = user.Id;
                //var rst = await AssignRolesTeams(userGuid, createUser.Roles, createUser.Teams);
                //if (!(rst is ObjectResult objectResult && objectResult.StatusCode == StatusCodes.Status200OK
                //                   || rst is StatusCodeResult statusCodeResult && statusCodeResult.StatusCode == StatusCodes.Status200OK))
                //    return rst;

                return StatusCode(StatusCodes.Status200OK,
                   new Response { Status = "Success", Message = new string[] { $"Staff created  successfully - {user.UserName}  !" } });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response() { Status = "Error", Message = new string[] { $"{ex.Message}" } });
            }
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


        [HttpPost("forgot-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ForgotPassword([Required] string mail)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(mail);
                if (user != null)
                {
                    var token = await _userManager.GeneratePasswordResetTokenAsync(user);
                    var encodedToken = WebUtility.UrlEncode(token); // or Uri.EscapeDataString(token)
                    var resetPasswordLink = $"{_resetUrl}?token={encodedToken}&email={user.Email}&username={user.UserName}";

                    //var message = new Message(new string[] { user.Email! }, "Reset Password Link", resetPasswordLink);

                    var messageBody = ResetLinkBody.MessageBody2;
                    // Replace placeholders
                    messageBody = messageBody.Replace("{{UserName}}", WebUtility.HtmlEncode(user.NormalizedUserName));
                    messageBody = messageBody.Replace("{{ResetLink}}", WebUtility.HtmlEncode(resetPasswordLink));
                    messageBody = messageBody.Replace("{{CompanyName}}", WebUtility.HtmlEncode(_companyName));


                    var res = await _emailService.SendResetLinkAsync(user.Email, "Reset Password", messageBody);
                    if (res)
                        return StatusCode(StatusCodes.Status200OK, new Response { Status = "Success", Message = new string[] { $"Password reset request is sent on Email {user.Email}" } });
                    else
                        return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "Error", Message = new string[] { "Password reset request fail" } });


                }
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "Error", Message = new string[] { "The email is not yet registered" } });

            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "Error", Message = new string[] { ex.Message } });
            }

        }

        [HttpPost("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(ResetPassword resetPassword)
        {
            try
            {
                var user = await _userManager.FindByEmailAsync(resetPassword.Email);
                if (user != null)
                {
                    var resetPassResult = await _userManager.ResetPasswordAsync(user, resetPassword.Token, resetPassword.Password);
                    if (!resetPassResult.Succeeded)
                    {
                        foreach (var error in resetPassResult.Errors)
                        {
                            ModelState.AddModelError(error.Code, error.Description);
                        }
                        return Ok(ModelState);
                    }

                    return StatusCode(StatusCodes.Status200OK, new Response { Status = "Success", Message = new string[] { $"Password has been changed" } });
                }
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "Error", Message = new string[] { "The email is not yet registered" } });
            }
            catch (Exception ex) 
            {
                return StatusCode(StatusCodes.Status400BadRequest, new Response { Status = "Error", Message = new string[] { ex.Message } });
            }
        }


        [HttpGet("reset-password")]
        [AllowAnonymous]
        public async Task<IActionResult> ResetPassword(string token, string email)
        {
            var model = new ResetPassword { Token = token, Email = email };

            return Ok(model);
        }



    }
}
