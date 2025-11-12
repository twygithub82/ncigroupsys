using Asp.Versioning;
using Azure;
using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using IDMS.FileManagement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using static Google.Protobuf.WireFormat;
using Response = IDMS.FileManagement.Interface.Model.Response;

namespace IDMS.FileManagement.API.Controllers
{

    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiVersion("2.0")]
    public class EmailController : ControllerBase
    {

        //private readonly UserManager<ApplicationUser> _userManager;
        //private readonly SignInManager<ApplicationUser> _signInManager;
        //private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly IEmail _emailService;
        private readonly IReport _reportService;
        private readonly IFileManagement _fileManagement;
        //private readonly JwtTokenService _jwtTokenService;
        //private readonly IRefreshTokenStore _refreshTokenStore;
        private readonly AppDBContext _dbContext;

        public EmailController(IConfiguration configuration, IEmail emailService, IFileManagement fileManagement, IReport reportService, AppDBContext context)
        {
            //_userManager = userManager;
            //_roleManager = roleManager;
            _configuration = configuration;
            _emailService = emailService;
            _fileManagement = fileManagement;
            _reportService = reportService;
            //_signInManager = signInManager;
            _dbContext = context;
            //_jwtTokenService = new JwtTokenService(_configuration, _dbContext);
            //_refreshTokenStore = refreshTokenStore;
        }

        [HttpPost("NewEirEmail")]
        [MapToApiVersion("2.0")]
        //This is for Add-hoc send eir email job
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

                var ccList = emailDto.ccReceipient;
                var bccList = emailDto.bccReceipient;

                string subject = EirMessage.GetEirSubject_InGate(tankNumber);
                string htmlBody = EirMessage.GetEirBody_InGate();

                if (emailDto.type.ToLower().Equals("out_gate"))
                {
                    subject = EirMessage.GetEirSubject_InGate(tankNumber);
                    htmlBody = EirMessage.GetEirBody_InGate();
                }


                // Run email task in background (non-blocking)
                Task.Run(async () =>
                {
                    try
                    {
                        ZipFileRequest zipFileRequest = new ZipFileRequest();
                        zipFileRequest.GroupGuid = eirGuid;
                        zipFileRequest.TankNo = tankNumber;

                        //var zipBytes = await utils.GetZipFile(eirGuid, zipFileUrl);
                        await using var responseStream = await _fileManagement.GetZipBlobFolderAsync(zipFileRequest);
                        var zipBytes = responseStream.ToArray();
                        await _emailService.SendEmailWithZipAttachmentAsync(recipient, ccList, bccList, subject, htmlBody, zipBytes, $"{tankNumber}.zip");
                    }
                    catch (Exception ex)
                    {
                        // Log exception or handle as needed
                        Console.WriteLine($"[BackgroundTaskError] {ex.Message}");
                    }
                });


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

        [HttpPost("NewEmailJob")]
        [MapToApiVersion("2.0")]
        //This is for FE publish ingate, then call this to insert new send eir email job
        public async Task<IActionResult> NewEmailJob([FromBody] newEmailJobDto emailJobDto)
        {
            try
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                var invalidEmails = new List<string>();

                // Validate To addresses (required)
                if (emailJobDto.to_addresses == null || !emailJobDto.to_addresses.Any())
                {
                    return BadRequest(new Response
                    {
                        Status = "ValidationError",
                        Message = new[] { "At least one recipient (To address) is required." }
                    });
                }

                invalidEmails.AddRange(emailJobDto.to_addresses
                                         .Where(e => string.IsNullOrWhiteSpace(e) || !new EmailAddressAttribute().IsValid(e))
                                         .Select(e => $"Invalid To address: {e}"));

                //Validate CC if provided
                if (emailJobDto.cc_addresses != null)
                {
                    invalidEmails.AddRange(
                        emailJobDto.cc_addresses
                            .Where(e => !string.IsNullOrWhiteSpace(e) && !new EmailAddressAttribute().IsValid(e))
                            .Select(e => $"Invalid CC address: {e}")
                    );
                }

                //Validate BCC if provided
                if (emailJobDto.bcc_addresses != null)
                {
                    invalidEmails.AddRange(
                        emailJobDto.bcc_addresses
                            .Where(e => !string.IsNullOrWhiteSpace(e) && !new EmailAddressAttribute().IsValid(e))
                            .Select(e => $"Invalid BCC address: {e}")
                    );
                }

                if (invalidEmails.Any())
                {
                    return BadRequest(new Response
                    {
                        Status = "ValidationError",
                        Message = invalidEmails.ToArray()
                    });
                }

                var res = await _emailService.InsertNewEmailJob(emailJobDto);
                if (res)
                    return StatusCode(StatusCodes.Status201Created, new Response
                    {
                        Status = "Created",
                        Message = new[] { "Email job created." }
                    });
                else
                    return BadRequest(new Response
                    {
                        Status = "Error",
                        Message = new[] { "Fail to create email job." }
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

        //[Authorize(AuthenticationSchemes = "AppJwt,AzureAd")]
        //[Authorize(AuthenticationSchemes = "AppJwt,AzureAd")]
        [HttpPost("StartEirEmailJob")]
        [MapToApiVersion("2.0")]
        //This is for Schdeuler to call, check any outgate Eir job to send email
        public async Task<IActionResult> StartEirEmailJob(string EirType)
        {
            try
            {
                var res = await _emailService.ScheduleEirEmailTask(int.Parse(EirType));
                var type = EirType == "1" ? "In_Gate" : "Out_Gate";

                return Ok(new { Message = $"{type} - Eir Email Job Started" });
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

        //[Authorize(AuthenticationSchemes = "AppJwt")]
        [HttpPost("StartEirEmailJobExternal")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> StartEirEmailJobExternal(string EirType)
        {
            return await EirEmailJob(EirType);
        }



        [HttpPost("StartTankActivityJob")]
        [MapToApiVersion("2.0")]
        //This is for Schdeuler to call, check any outgate Eir job to send email
        public async Task<IActionResult> StartTankActivityJob(string customer)
        {
            try
            {
                await _reportService.GenerateTankActivityReport();

                return Ok(new { Message = $"Tank Activity Email Job Started" });
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

        private async Task<IActionResult> EirEmailJob(string EirType)
        {
            try
            {
                var res = await _emailService.ScheduleEirEmailTask(int.Parse(EirType));
                var type = EirType == "1" ? "In_Gate" : "Out_Gate";

                return Ok(new { Message = $"{type} - Eir Email Job Started" });
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

