using Asp.Versioning;
using IDMS.FileManagement.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Swashbuckle.AspNetCore.Annotations;
using System;
using System.ComponentModel.DataAnnotations;
using System.Text.Json;
using System.Threading.Tasks.Dataflow;

namespace IDMS.FileManagement.API.Controllers
{
    [ApiController]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiVersion("1.0")]
    [ApiVersion("2.0")]
    public class AzureBlobController : ControllerBase
    {

        private IFileManagement _fileManagementService;
        private readonly ILogger<AzureBlobController> _logger;

        public AzureBlobController(ILogger<AzureBlobController> logger, IFileManagement fileManagement)
        {
            _logger = logger;
            _fileManagementService = fileManagement;
        }

        [HttpGet("GetFileUrl_SAS")]
        [MapToApiVersion("1.0")]
        public async Task<IActionResult> GetUrl(string filename, [Required] string fileType)
        {
            string containerName = Util.GetContainerName(fileType);

            var response = await _fileManagementService.GetFileUrl_SAS(filename, containerName);
            return Ok(response);
        }


        [HttpPost("UploadFiles")]
        [MapToApiVersion("1.0")]
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

        //[HttpGet("GetFiles")]
        //public async Task<IActionResult> GetFiles([Required] string fileType)
        //{
        //    string containerName = Util.GetContainerName(fileType);
        //    var response = await _fileManagementService.GetFiles(containerName);
        //    return Ok(response);
        //}


        /// <remarks>
        /// metadata format:
        ///   {"TableName":"in-gate", "FileType":"img", "GroupGuid":"abc124bsda2342","Description":"Top View"},
        /// </remarks>
        [HttpPost("UploadFiles")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> UploadFiles([FromForm] IList<IFormFile> files, [FromForm] IList<string> metadata)
        {
            if (files.Count == 0 || metadata.Count == 0)
                return BadRequest("No files or metadata provided.");

            if (files.Count != metadata.Count)
                return BadRequest("The number of files and metadata must match.");

            try
            {
                var response = await _fileManagementService.UploadFiles(files, metadata);

                var data = new FileReturnData()
                {
                    affected = response.Item1,
                    url = response.Item2
                };

                // Serialize the class object
                var json = JsonConvert.SerializeObject(data, Formatting.Indented);
                return Ok(json);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("GetFileUrl")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetFileUrl([FromBody] List<string> guid)
        {
            try
            {
                var response = await _fileManagementService.GetFileUrlFromDB(guid);
                return Ok(response);
            }
            catch (Exception ex) 
            {
                return BadRequest($"{ex.Message}"); 
            }
        }


        [HttpPost("GetFileUrlByGroupGuid")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> GetFileUrlByGroupGuid([FromBody] List<string> guid)
        {
            try
            {
                var response = await _fileManagementService.GetGroupFileUrlFromDB(guid);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}");
            }
        }

        [HttpDelete("DeleteFile")]
        [MapToApiVersion("2.0")]
        public async Task<IActionResult> DeleteFile([FromBody] List<string> guid)
        {
            try
            {
                var response = await _fileManagementService.DeleteFile(guid);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest($"{ex.Message}");
            }
        }
    }
}
