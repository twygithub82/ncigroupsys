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
    public class LicensesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LicensesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/licenses
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LicenseReadDto>>> GetLicenses()
        {
            try
            {
                var licenses = await _context.license
               .Where(l => l.delete_dt == null)
               .Select(l => new LicenseReadDto
               {
                   LicId = l.lic_id,
                   ProductCode = l.product_code,
                   ProductCost = l.product_cost,
                   CreateDt = l.create_dt,
                   CreateBy = l.create_by ?? "",
                   UpdateDt = l.update_dt,
                   UpdateBy = l.update_by ?? "",
               }).ToListAsync();

                return licenses;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // GET: api/licenses/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LicenseReadDto>> GetLicense(string id)
        {
            try
            {
                var lic = await _context.license.Where(l => l.lic_id == id).FirstOrDefaultAsync();

                if (lic == null || lic.delete_dt != null)
                    return NotFound();

                return new LicenseReadDto
                {
                    LicId = lic.lic_id,
                    ProductCode = lic.product_code ?? "",
                    ProductCost = lic.product_cost,
                    CreateDt = lic.create_dt,
                    CreateBy = lic.create_by ?? "",
                    UpdateDt = lic.update_dt,
                    UpdateBy = lic.update_by ?? ""
                };
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/licenses
        [HttpPost]
        public async Task<ActionResult<LicenseReadDto>> CreateLicense([FromBody]  LicenseCreateDto dto)
        {
            try
            {
                var newLicense = new license
                {
                    lic_id = Utils.GetGuidString(),
                    product_code = dto.ProductCode,
                    product_cost = dto.ProductCost,
                    create_by = dto.CreateBy,
                    create_dt = Utils.GetCurrentDateTimeUTC()
                };

                _context.license.Add(newLicense);
                await _context.SaveChangesAsync();

                var resultDto = new LicenseReadDto
                {
                    LicId = newLicense.lic_id,
                    ProductCode = newLicense.product_code,
                    ProductCost = newLicense.product_cost,
                    CreateDt = newLicense.create_dt,
                    CreateBy = newLicense.create_by
                };

                return CreatedAtAction(nameof(GetLicense), new { id = newLicense.lic_id }, resultDto);
            }
            catch (Exception ex) 
            {
                throw ex;
            }
        }

        // PUT: api/licenses/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateLicense(string id, LicenseUpdateDto dto)
        {
            try
            {
                var license = await _context.license.FindAsync(id);

                if (license == null || license.delete_dt != null)
                    return NotFound();

                license.product_code = dto.ProductCode;
                license.product_cost = dto.ProductCost;
                license.update_by = dto.UpdateBy;
                license.update_dt = Utils.GetCurrentDateTimeUTC();

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        // DELETE: api/licenses/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteLicense(string id)
        {
            var license = await _context.license.FindAsync(id);

            if (license == null || license.delete_dt != null)
                return NotFound();

            license.delete_dt = Utils.GetCurrentDateTimeUTC();
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
