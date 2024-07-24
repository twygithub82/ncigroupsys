using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Http;

namespace IDMS.FileManagement.Interface
{
    public interface IFileManagement
    {
        public Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, CancellationToken cancellationToken = default);
        public Task<List<BlobItem>> GetBlobItems(CancellationToken cancellationToken = default);
        public Task<List<BlobItem>> GetFiles(CancellationToken cancellationToken = default);
        public Task<string> GetUrl();
    }
}
