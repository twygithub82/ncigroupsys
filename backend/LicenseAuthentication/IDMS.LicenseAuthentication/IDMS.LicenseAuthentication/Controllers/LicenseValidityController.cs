using IDMS.LicenseAuthentication.DB;
using IDMS.LicenseAuthentication.DTO;
using IDMS.LicenseAuthentication.Models;
using IDMS.LicenseAuthentication.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace IDMS.LicenseAuthentication.Controllers
{
    [Authorize(AuthenticationSchemes = "BasicAuthentication")]
    [Route("api/[controller]")]
    [ApiController]
    public class LicenseValidityController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LicenseValidityController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/licensevalidity
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LicenseValidityReadDto>>> GetAll()
        {
            var items = await _context.license_validity
                .Where(v => v.delete_dt == null)
                .Select(v => new LicenseValidityReadDto
                {
                    LicValidId = v.valid_id,
                    LicSubcriptionId = v.lic_sub_id,
                    ValidFrom = v.valid_from,
                    ValidTo = v.valid_to,
                    Cost = v.cost,
                    Deactivated = v.deactivated,
                    DeactivateDt = v.deactivate_dt,
                    CreateDt = v.create_dt,
                    CreateBy = v.create_by ?? "",
                    UpdateDt = v.update_dt,
                    UpdateBy = v.update_by ?? ""
                }).ToListAsync();

            return Ok(items);
        }

        // GET: api/licensevalidity/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LicenseValidityReadDto>> GetById(string id)
        {
            var v = await _context.license_validity.FindAsync(id);

            if (v == null || v.delete_dt != null)
                return NotFound();

            var dto = new LicenseValidityReadDto
            {
                LicValidId = v.valid_id,
                LicSubcriptionId = v.lic_sub_id,
                ValidFrom = v.valid_from,
                ValidTo = v.valid_to,
                Cost = v.cost,
                Deactivated = v.deactivated,
                DeactivateDt = v.deactivate_dt,
                CreateDt = v.create_dt,
                CreateBy = v.create_by ?? "",
                UpdateDt = v.update_dt,
                UpdateBy = v.update_by ?? ""
            };

            return Ok(dto);
        }

        // POST: api/licensevalidity
        [HttpPost]
        public async Task<ActionResult<LicenseValidityReadDto>> Create(LicenseValidityCreateDto dto)
        {
            var entity = new license_validity
            {
                valid_id = Utils.GetGuidString(),
                lic_sub_id = dto.LicSubciptionId,
                valid_from = dto.ValidFrom,
                valid_to = dto.ValidTo,
                cost = dto.Cost,
                deactivated = false,
                create_dt = DateTime.UtcNow,
                create_by = dto.CreateBy
            };

            _context.license_validity.Add(entity);
            await _context.SaveChangesAsync();

            var resultDto = new LicenseValidityReadDto
            {
                LicValidId = entity.valid_id,
                LicSubcriptionId = entity.lic_sub_id,
                ValidFrom = entity.valid_from,
                ValidTo = entity.valid_to,
                Cost = entity.cost,
                Deactivated = entity.deactivated,
                CreateDt = entity.create_dt,
                CreateBy = entity.create_by
            };

            return CreatedAtAction(nameof(GetById), new { id = entity.valid_id }, resultDto);
        }

        // PUT: api/licensevalidity/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> Update(string id, LicenseValidityUpdateDto dto)
        {
            var entity = await _context.license_validity.FindAsync(id);
            if (entity == null || entity.delete_dt != null)
                return NotFound();

            entity.valid_from = dto.ValidFrom;
            entity.valid_to = dto.ValidTo;
            entity.cost = dto.Cost;
            entity.deactivated = dto.Deactivated;
            entity.deactivate_dt= dto.Deactivated ? Utils.GetCurrentDateTimeUTC() : null;
            entity.update_by = dto.UpdateBy;
            entity.update_dt = Utils.GetCurrentDateTimeUTC();

            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/licensevalidity/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDelete(string id)
        {
            var entity = await _context.license_validity.FindAsync(id);
            if (entity == null || entity.delete_dt != null)
                return NotFound();

            entity.delete_dt = Utils.GetCurrentDateTimeUTC();
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
