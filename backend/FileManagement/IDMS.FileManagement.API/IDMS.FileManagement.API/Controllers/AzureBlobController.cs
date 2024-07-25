using IDMS.FileManagement.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace IDMS.FileManagement.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AzureBlobController : ControllerBase
    {

        private IFileManagement _fileManagementService;

        private readonly ILogger<AzureBlobController> _logger;

        public AzureBlobController(ILogger<AzureBlobController> logger, IFileManagement fileManagement)
        {
            _logger = logger;
            _fileManagementService = fileManagement;
        }

        [HttpGet("Hello")]
        [AllowAnonymous]
        public async Task<IActionResult> HelloWorld()
        {
            var response = await _fileManagementService.GetUrl();
            return Ok(response);
        }


        [HttpPost("UploadFiles")]
        public async Task<IActionResult> UploadFiles(List<IFormFile> files, CancellationToken cancellationToken = default)
        {
            var response = await _fileManagementService.UploadFiles(files, cancellationToken);
            return Ok();
        }

        [HttpGet("GetBlobList")]
        public async Task<IActionResult> GetBlobList()
        {
            var response = await _fileManagementService.GetBlobItems();
            return Ok(response);
        }
    }
}
