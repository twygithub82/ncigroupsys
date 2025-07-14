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
    public class LicenseClientController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public LicenseClientController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: api/license_clients
        [HttpGet]
        public async Task<ActionResult<IEnumerable<LicenseClientReadDto>>> GetClients()
        {
            try
            {
                var clients = await _context.license_clients
                    .Where(c => c.delete_dt == null)
                    .Select(c => new LicenseClientReadDto
                    {
                        ClientId = c.client_id,
                        Organization = c.organization,
                        Email = c.email,
                        CreateDt = c.create_dt,
                        CreateBy = c.create_by,
                        UpdateDt = c.update_dt,
                        UpdateBy = c.update_by
                    }).ToListAsync();

                return Ok(clients);
            }
            catch(Exception ex)
            {
                throw ex;
            }

        }

        // GET: api/license_clients/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<LicenseClientReadDto>> GetClient(string id)
        {
            try
            {
                var client = await _context.license_clients.FindAsync(id);

                if (client == null || client.delete_dt != null)
                    return NotFound();

                var dto = new LicenseClientReadDto
                {
                    ClientId = client.client_id,
                    Organization = client.organization,
                    Email = client.email,
                    CreateDt = client.create_dt,
                    CreateBy = client.create_by,
                    UpdateDt = client.update_dt,
                    UpdateBy = client.update_by
                };

                return Ok(dto);
            }
            catch(Exception ex)
            {
                throw ex;
            }
        }

        // POST: api/license_clients
        [HttpPost]
        public async Task<ActionResult<LicenseClientReadDto>> CreateClient(LicenseClientCreateDto dto)
        {
            try
            {
                var emailValidator = new EmailAddressAttribute();
                if (!emailValidator.IsValid(dto.Email))
                {
                    return BadRequest(new { message = "Invalid email address." });
                }

                var client = new license_clients
                {
                    client_id = Utils.GetGuidString(),
                    organization = dto.Organization,
                    email = dto.Email,
                    create_by = dto.CreateBy,
                    create_dt = Utils.GetCurrentDateTimeUTC()
                };

                _context.license_clients.Add(client);
                await _context.SaveChangesAsync();

                var resultDto = new LicenseClientReadDto
                {
                    ClientId = client.client_id,
                    Organization = client.organization,
                    Email = client.email,
                    CreateDt = client.create_dt,
                    CreateBy = client.create_by
                };

                return CreatedAtAction(nameof(GetClient), new { id = client.client_id }, resultDto);
            }
            catch (Exception ex)
            {
                throw ex;
            }
         
        }

        // PUT: api/license_clients/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateClient(string id, LicenseClientUpdateDto dto)
        {
            try
            {
                var emailValidator = new EmailAddressAttribute();
                if (!emailValidator.IsValid(dto.Email))
                {
                    return BadRequest(new { message = "Invalid email address." });
                }

                var client = await _context.license_clients.FindAsync(id);
                if (client == null || client.delete_dt != null)
                    return NotFound();

                client.organization = dto.Organization;
                client.email = dto.Email;
                client.update_by = dto.UpdateBy;
                client.update_dt = Utils.GetCurrentDateTimeUTC();

                await _context.SaveChangesAsync();
                return NoContent();
            }
            catch (Exception ex)
            {
                throw ex;

            }
        }

        // DELETE: api/license_clients/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> SoftDeleteClient(string id)
        {
            try
            {
                var client = await _context.license_clients.FindAsync(id);
                if (client == null || client.delete_dt != null)
                    return NotFound();

                client.delete_dt = Utils.GetCurrentDateTimeUTC();
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
