using IDMS.LicenseAuthentication.DB;
using IDMS.LicenseAuthentication.DTO;
using IDMS.LicenseAuthentication.Models;
using IDMS.LicenseAuthentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.ComponentModel.DataAnnotations;

namespace IDMS.LicenseAuthentication.Controllers
{
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    [ApiController]
    [Route("api/[controller]")]
    public class LicenseSubController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly LicenseKeyService _keyGen;
        private readonly JWTTokenService _jWTTokenService;

        public LicenseSubController(ApplicationDbContext context, LicenseKeyService keyGen, JWTTokenService jWTTokenService)
        {
            _context = context;
            _keyGen = keyGen;
            _jWTTokenService = jWTTokenService;
        }

        // GET: api/license_sub
        [HttpGet]
        public async Task<ActionResult<IEnumerable<license_sub>>> GetAll()
        {
            try
            {
                return await _context.license_sub.Where(ls => ls.delete_dt == null).ToListAsync();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        // GET: api/license_sub/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<license_sub>> GetById(string id)
        {
            try
            {
                var license_sub = await _context.license_sub.FirstOrDefaultAsync(ls => ls.id == id && ls.delete_dt == null);

                if (license_sub == null)
                    return NotFound();

                return license_sub;
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        // POST: api/license_sub
        [HttpPost]
        public async Task<ActionResult<license_sub>> Create([FromBody] LicenseSubCreateDto dto)
        {
            try
            {
                //var licenseKey = GenerateUniqueKey(existsInDb: key => _context.license_sub.Any(k => k.license_key == key), dto.SecrectKey);
                var licenseKey = _keyGen.GenerateKey();
                var entity = new license_sub
                {
                    id = Utils.GetGuidString(),
                    client_id = dto.ClientId,
                    lic_id = dto.LicId,
                    license_key = licenseKey,
                    license_type = dto.LicenseType,
                    num_users = dto.NumUsers,
                    is_active = dto.IsActive,
                    dms_secret_key = dto.SecrectKey,
                    create_dt = Utils.GetCurrentDateTimeUTC(),
                    create_by = "system" // Replace with current user if available
                };

                _context.license_sub.Add(entity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = entity.id }, entity);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        // POST: api/license_sub
        [HttpPost("CreateLicenseJWTBySubID")]
        public async Task<ActionResult<license_sub>> CreateLicenseJWTBySubID([FromBody] JWTDTO jWTDTO)
        {
            try
            {
                //var licenseKey = GenerateUniqueKey(existsInDb: key => _context.license_sub.Any(k => k.license_key == key), dto.SecrectKey);

                var licSub = await _context.license_sub.FindAsync(jWTDTO.LicSubId);
                if (licSub != null)
                {
                    var licenseToken = _jWTTokenService.GenerateLicenseToken(licSub, jWTDTO.UserEmail);
                    return CreatedAtAction(nameof(CreateLicenseJWTBySubID), new { token = licenseToken });
                }
                else
                    return NotFound();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        // POST: api/license_sub
        [AllowAnonymous]
        [HttpPost("GetValidity")]
        public async Task<ActionResult<license_sub>> GetValidity([FromBody] string payload)
        {
            try
            {

                var claim = _jWTTokenService.GetPrincipalFromToken(payload);

                DateTime curDateTime = Utils.GetCurrentDateTimeUTC();
                var licStatus = new LicenseStatus();

                //Check the license key file is authentic
                //var licSub = await _context.license_sub.Include(l=>l.license_validity).Where(l=> l.lice)

                var licKey = claim.FindFirst("LicenseKey")?.Value?.ToString() ?? "";
                var userEmail = claim.FindFirst("LicenseEmail")?.Value?.ToString() ?? "";

                //----------------------------------------------
                //Second verification check
                //Can disbale 
                //-----------------------------------------------
                //var valid = _keyGen.ValidateKey(licKey);
                //if (!valid)
                //    return StatusCode(StatusCodes.Status200OK, (licStatus.StatusCode = (int)LicenseStatusEnum.InvalidKey, licStatus.StatusMessage = "Invalid License Key File"));


                var user = await _context.license_user.Where(u => u.user_email == userEmail && (u.delete_dt == null)).FirstOrDefaultAsync();
                if (user == null)
                    return StatusCode(StatusCodes.Status400BadRequest, "License User Not Found");


                var result = await _context.license_sub.Include(l => l.license_validity.Where(v => v.deactivated == false && v.delete_dt == null))
                                          .Where(l => l.license_key == licKey && (l.delete_dt == null))
                                          .FirstOrDefaultAsync();

                if (result == null || string.IsNullOrEmpty(result.dms_secret_key))
                    return StatusCode(StatusCodes.Status400BadRequest, "License Subcription Not Found");

                var licValidity = result?.license_validity?.FirstOrDefault();
                if (licValidity != null)
                {
                    if (curDateTime >= licValidity.valid_from)
                    {
                        //Check license key is valid
                        if (curDateTime <= licValidity.valid_to)
                        {
                            licStatus.StatusCode = (int)LicenseStatusEnum.Valid;
                            licStatus.StatusMessage = "License Valid";
                            licStatus.StatusDescription = licValidity.valid_to.ToString();
                        }
                        else
                        {
                            licStatus.StatusCode = (int)LicenseStatusEnum.Expired;
                            licStatus.StatusMessage = "License Expired";
                            licStatus.StatusDescription = licValidity.valid_to.ToString();
                        }
                    }
                    else if (licValidity.deactivated)
                    {
                        licStatus.StatusCode = (int)LicenseStatusEnum.Deactivated;
                        licStatus.StatusMessage = "License Deactivated";
                        licStatus.StatusDescription = licValidity.deactivate_dt.ToString();
                    }
                    else if (!result.is_active)
                    {
                        licStatus.StatusCode = (int)LicenseStatusEnum.Inactive;
                        licStatus.StatusMessage = "License Inactive";
                    }
                    else
                    {
                        licStatus.StatusCode = (int)LicenseStatusEnum.HaventStart;
                        licStatus.StatusMessage = "License Havent Start";
                        licStatus.StatusDescription = licValidity.valid_from.ToString();
                    }

                    //Last Override Check on User Level
                    //Can disable this if dont want to check
                    if (!user.is_active)
                    {
                        licStatus.StatusCode = (int)LicenseStatusEnum.Inactive;
                        licStatus.StatusMessage = "License User Inactive";
                    }
                }
                else
                {
                    licStatus.StatusCode = (int)LicenseStatusEnum.SubNotFound;
                    licStatus.StatusMessage = "License Validity Not Found";
                }

                var resultToken = _jWTTokenService.GenerateResultToken(result?.dms_secret_key, licStatus);

                return StatusCode(StatusCodes.Status200OK, new { token = resultToken });
            }
            catch (SecurityTokenException se)
            {
                return Unauthorized(se.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }


        }

        // PUT: api/license_sub/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, [FromBody] LicenseSubUpdateDto dto)
        {
            try
            {
                var entity = await _context.license_sub.FirstOrDefaultAsync(ls => ls.id == id && ls.delete_dt == null);

                if (entity == null) return NotFound();

                //entity.validity_id = dto.ValidityId;
                entity.client_id = dto.ClientId;
                entity.lic_id = dto.LicId;
                entity.license_key = dto.LicenseKey;
                entity.license_type = dto.LicenseType;
                entity.num_users = (int)dto.NumUsers;
                entity.is_active = dto.IsActive ?? false;
                entity.update_dt = Utils.GetCurrentDateTimeUTC();
                entity.update_by = "system"; // Replace with logged-in user

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }
        }

        // DELETE: api/license_sub/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(string id)
        {
            try
            {
                var entity = await _context.license_sub.FirstOrDefaultAsync(ls => ls.id == id && ls.delete_dt == null);

                if (entity == null) return NotFound();

                entity.delete_dt = Utils.GetCurrentDateTimeUTC();
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = ex });
            }

        }

        private string GenerateUniqueKey(Func<string, bool> existsInDb, string SecrectKey, int length = 20, int maxAttempts = 5)
        {
            for (int i = 0; i < maxAttempts; i++)
            {
                var key = _keyGen.GenerateKey(SecrectKey, length);
                if (!existsInDb(key))
                    return key;
            }

            throw new Exception("Failed to generate a unique key after multiple attempts.");
        }
    }
}
