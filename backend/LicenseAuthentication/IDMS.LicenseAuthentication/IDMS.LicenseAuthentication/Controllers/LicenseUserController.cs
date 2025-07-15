using IDMS.LicenseAuthentication.DB;
using IDMS.LicenseAuthentication.DTO;
using IDMS.LicenseAuthentication.Models;
using IDMS.LicenseAuthentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.JSInterop.Infrastructure;
using System.ComponentModel.DataAnnotations;

namespace IDMS.LicenseAuthentication.Controllers
{
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseUserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly JWTTokenService _jWTTokenService;
        private readonly LicenseKeyService _licenseKeyService;

        public LicenseUserController(ApplicationDbContext context, JWTTokenService jWTTokenService, LicenseKeyService licenseKeyService)
        {
            _context = context;
            _jWTTokenService = jWTTokenService;
            _licenseKeyService = licenseKeyService;
        }

        // GET all
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LicenseUserDto>>> GetAll()
        {
            try
            {
                return await _context.license_user
                    .Where(x => x.delete_dt == null)
                    .Select(x => new LicenseUserDto
                    {
                        Id = x.id,
                        SubId = x.sub_id,
                        UserTag = x.user_tag,
                        LicenseKeyToken = x.license_key_token,
                        ActivationCode = x.activation_code ?? "",
                        IsActive = x.is_active,
                        CreateDt = x.create_dt,
                        CreateBy = x.create_by ?? "",
                        UpdateDt = x.update_dt,
                        UpdateBy = x.update_by ?? "",
                        DeleteDt = x.delete_dt
                    })
                    .ToListAsync();
            }
            catch (Exception ex)
            {
                throw;
            }

        }

        // GET by id
        [HttpGet("{id}")]
        public async Task<ActionResult<LicenseUserDto>> GetById(string id)
        {
            try
            {
                var entity = await _context.license_user.FindAsync(id);
                if (entity == null || entity.delete_dt != null)
                    return NotFound();

                return new LicenseUserDto
                {
                    Id = entity.id,
                    SubId = entity.sub_id,
                    UserTag = entity.user_tag,
                    LicenseKeyToken = entity.license_key_token,
                    ActivationCode = entity.activation_code ?? "",
                    IsActive = entity.is_active,
                    CreateDt = entity.create_dt,
                    CreateBy = entity.create_by ?? "",
                    UpdateDt = entity.update_dt,
                    UpdateBy = entity.update_by ?? "",
                    DeleteDt = entity.delete_dt
                };
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // POST
        [HttpPost]
        public async Task<ActionResult> Create(LicenseUserCreateDto dto)
        {
            try
            {
                //var emailValidator = new EmailAddressAttribute();
                //if (!emailValidator.IsValid(dto.UserTag))
                //{
                //    return BadRequest(new { message = "Invalid email address." });
                //}

                //string licToken = "";
                var licSub = await _context.license_sub.FindAsync(dto.SubId);
                if (licSub == null)
                    return NotFound(new { message = "Subcription Id not found" });
                //else
                //    licToken = _jWTTokenService.GenerateLicenseToken(licSub, dto.UserTag);

                string acvtCode = GenerateUniqueKey(existsInDb: key => _context.license_user.Any(k => k.activation_code == key), "");

                var entity = new license_user
                {
                    id = Guid.NewGuid().ToString(),
                    sub_id = dto.SubId,
                    user_tag = dto.UserTag,
                    activation_code = acvtCode,
                    license_key_token = "",
                    is_active = false,
                    create_by = "system",
                    create_dt = DateTime.UtcNow
                };

                _context.license_user.Add(entity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(Create), new { id = entity.id }, entity);
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        [AllowAnonymous]
        [HttpPost("UserActivation")]
        public async Task<ActionResult> UserActivation(UserActivateDTO dto)
        {
            try
            {
                var valid = _licenseKeyService.ValidateKey(dto.ActivationCode);
                if (!valid)
                    return Forbid("Invalid Activation Code.");

                var licUser = await _context.license_user.Include(l => l.license_sub).Where(l => l.activation_code == dto.ActivationCode && (l.delete_dt == null)).FirstOrDefaultAsync();
                if (licUser == null)
                    return Forbid("Activate Code Not Found.");

                string licToken = _jWTTokenService.GenerateLicenseToken(licUser.license_sub, dto.UserTag, dto.ActivationCode);

                licUser.user_tag = dto.UserTag;
                licUser.license_key_token = licToken;
                licUser.is_active = true;
                licUser.update_by = "system";
                licUser.update_dt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return Ok(new { token = licToken });
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, LicenseUserUpdateDto dto)
        {
            try
            {
                var emailValidator = new EmailAddressAttribute();
                if (!emailValidator.IsValid(dto.UserTag))
                {
                    return BadRequest(new { message = "Invalid email address." });
                }

                var entity = await _context.license_user.FindAsync(id);
                if (entity == null || entity.delete_dt != null)
                    return NotFound();

                entity.user_tag = dto.UserTag;
                entity.license_key_token = dto.LicenseKeyToken;
                entity.is_active = dto.IsActive;
                entity.update_by = dto.UpdateBy == "" ? "system" : dto.UpdateBy;
                entity.update_dt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        // DELETE (Soft Delete)
        [HttpDelete("{id}")]
        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var entity = await _context.license_user.FindAsync(id);
                if (entity == null || entity.delete_dt != null)
                    return NotFound();

                entity.delete_dt = DateTime.UtcNow;
                await _context.SaveChangesAsync();

                return NoContent();
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private string GenerateUniqueKey(Func<string, bool> existsInDb, string SecrectKey, int length = 20, int maxAttempts = 5)
        {
            for (int i = 0; i < maxAttempts; i++)
            {
                var key = _licenseKeyService.GenerateKey(SecrectKey, length);
                if (!existsInDb(key))
                    return key;
            }

            throw new Exception("Failed to generate a unique key after multiple attempts.");
        }
    }
}
