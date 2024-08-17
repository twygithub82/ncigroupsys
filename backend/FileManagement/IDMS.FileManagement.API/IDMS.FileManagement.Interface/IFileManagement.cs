using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;

namespace IDMS.FileManagement.Interface
{
    public interface IFileManagement
    {
        public Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, string fileType, string filenameKey = "", CancellationToken cancellationToken = default);
        //public Task<List<BlobItem>> GetBlobItems(string containerName, CancellationToken cancellationToken = default);
        public Task<List<BlobItem>> GetFiles(string containerName, CancellationToken cancellationToken = default);
        public Task<string> GetFileUrl(string filename, string containerName);
    }
}
