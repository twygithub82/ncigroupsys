using IDMS.FileManagement.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.ComponentModel.DataAnnotations;

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

        [HttpGet("GetFileUrl")]
        public async Task<IActionResult> GetUrl(string filename, [Required] string fileType)
        {
            string containerName = Util.GetContainerName(fileType);
            var response = await _fileManagementService.GetFileUrl(filename, containerName);
            return Ok(response);
        }


        [HttpPost("UploadFiles")]
        public async Task<IActionResult> UploadFiles(
            [SwaggerParameter(Description = "The list of files to upload.")]
            List<IFormFile> files,
            [Required]
            [SwaggerParameter(Description = "The type of the files being uploaded. compulsory parameter with possible values: 'img', 'image', 'pdf'")]
            string fileType,
            string filename,
            CancellationToken cancellationToken = default)
        {
            string containerName = Util.GetContainerName(fileType);
            var response = await _fileManagementService.UploadFiles(files, containerName, filename, cancellationToken);
            return Ok();
        }

        //[HttpGet("GetBlobList")]
        //public async Task<IActionResult> GetBlobList()
        //{
        //    var response = await _fileManagementService.GetBlobItems();
        //    return Ok(response);
        //}

        [HttpGet("GetFiles")]
        public async Task<IActionResult> GetFiles([Required] string fileType)
        {
            string containerName = Util.GetContainerName(fileType);
            var response = await _fileManagementService.GetFiles(containerName);
            return Ok(response);
        }
    }
}
