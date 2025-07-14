using IDMS.LicenseAuthentication.DB;
using IDMS.LicenseAuthentication.DTO;
using IDMS.LicenseAuthentication.Models;
using IDMS.LicenseAuthentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public LicenseUserController(ApplicationDbContext context, JWTTokenService jWTTokenService)
        {
            _context = context;
            _jWTTokenService = jWTTokenService;
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
                        UserEmail = x.user_email,
                        LicenseKeyToken = x.license_key_token,
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
                throw ex;
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
                    UserEmail = entity.user_email,
                    LicenseKeyToken = entity.license_key_token,
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
                throw ex;
            }
        }

        // POST
        [HttpPost]
        public async Task<ActionResult> Create(LicenseUserCreateDto dto)
        {
            try
            {
                var emailValidator = new EmailAddressAttribute();
                if (!emailValidator.IsValid(dto.UserEmail))
                {
                    return BadRequest(new { message = "Invalid email address." });
                }


                string licToken = "";
                var licSub = await _context.license_sub.FindAsync(dto.SubId);
                if (licSub == null)
                    return NotFound(new { message = "Subcription Id not found" });
                else
                    licToken = _jWTTokenService.GenerateLicenseToken(licSub, dto.UserEmail);

                var entity = new license_user
                {
                    id = Guid.NewGuid().ToString(),
                    sub_id = dto.SubId,
                    user_email = dto.UserEmail,
                    license_key_token = licToken,
                    is_active = dto.IsActive,
                    create_by = dto.CreateBy == "" ? "system" : dto.CreateBy,
                    create_dt = DateTime.UtcNow
                };

                _context.license_user.Add(entity);
                await _context.SaveChangesAsync();

                return CreatedAtAction(nameof(GetById), new { id = entity.id }, entity);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // PUT
        [HttpPut("{id}")]
        public async Task<ActionResult> Update(string id, LicenseUserUpdateDto dto)
        {
            try
            {
                var emailValidator = new EmailAddressAttribute();
                if (!emailValidator.IsValid(dto.UserEmail))
                {
                    return BadRequest(new { message = "Invalid email address." });
                }

                var entity = await _context.license_user.FindAsync(id);
                if (entity == null || entity.delete_dt != null)
                    return NotFound();

                entity.user_email = dto.UserEmail;
                entity.license_key_token = dto.LicenseKeyToken;
                entity.is_active = dto.IsActive;
                entity.update_by = dto.UpdateBy == "" ? "system" : dto.UpdateBy;
                entity.update_dt = DateTime.UtcNow;

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                throw ex;
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
                throw ex;
            }
        }
    }
}
