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
using System.ComponentModel.DataAnnotations;
using System.Data;


namespace IDMS.User.Authentication.API.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    //[ApiVersion("1.0")]
    //[Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    public class EmailsController : ControllerBase
    {

        //private readonly UserManager<ApplicationUser> _userManager;
        //private readonly SignInManager<ApplicationUser> _signInManager;
        //private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmailService _emailService;
        private readonly JwtTokenService _jwtTokenService;
        private readonly IRefreshTokenStore _refreshTokenStore;
        private readonly ApplicationDbContext _dbContext;

        public EmailsController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager,
            SignInManager<ApplicationUser> signInManager, IConfiguration configuration, IEmailService emailService,
            IRefreshTokenStore refreshTokenStore, ApplicationDbContext context)
        {
            //_userManager = userManager;
            //_roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            //_signInManager = signInManager;
            _dbContext = context;
            _jwtTokenService = new JwtTokenService(_configuration, _dbContext);
            _refreshTokenStore = refreshTokenStore;
        }

        [HttpPost]
        [AllowAnonymous]
        public async Task<IActionResult> SendMail([FromBody] EmailDto emailDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var invalidEmails = emailDto.receipient
                    .Where(e => string.IsNullOrWhiteSpace(e) || !new EmailAddressAttribute().IsValid(e))
                    .ToList();

                if (invalidEmails.Any())
                {
                    return BadRequest(new Response
                    {
                        Status = "ValidationError",
                        Message = invalidEmails.Select(e => $"Invalid email address: {e}").ToArray()
                    });
                }

                // Capture variables from the request
                string tankNumber = emailDto.tankNo ?? "_";
                List<string> recipient = emailDto.receipient;
                string eirGuid = emailDto.eirGroupGuid;

                string subject = EirMessage.GetEirSubject_InGate(tankNumber);
                string htmlBody = EirMessage.GetEirBody_InGate();

                string zipFileUrl = _configuration["ZipFileUrl"] ?? "";

                // Run email task in background (non-blocking)
                Task.Run(async () =>
                {
                    try
                    {
                        var zipBytes = await utils.GetZipFile(eirGuid, zipFileUrl);
                        await _emailService.SendEmailWithZipAttachmentAsync(recipient, subject, htmlBody, zipBytes, $"{tankNumber}.zip");
                    }
                    catch (Exception ex)
                    {
                        // Log exception or handle as needed
                        Console.WriteLine($"[BackgroundTaskError] {ex.Message}");
                    }
                });

                //var zipBytes = await utils.GetZipFile(eirGuid, zipFileUrl);
                //await _emailService.SendEmailWithZipAttachmentAsync(recipient, subject, htmlBody, zipBytes, "Document.zip");

                // Return immediate success response
                return StatusCode(StatusCodes.Status202Accepted, new Response
                {
                    Status = "Started",
                    Message = new[] { "Email is being processed in background." }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new Response
                {
                    Status = "Error",
                    Message = new[] { ex.Message }
                });
            }
        }
    }
}
