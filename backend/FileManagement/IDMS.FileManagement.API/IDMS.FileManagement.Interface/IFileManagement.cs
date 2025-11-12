using Azure.Storage.Blobs.Models;
using IDMS.FileManagement.Interface.DB;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json.Linq;
using System.Runtime.InteropServices.JavaScript;

namespace IDMS.FileManagement.Interface
{
    public interface IFileManagement
    {
        public Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, string fileType, string filenameKey = "", CancellationToken cancellationToken = default);
        public Task<(int, List<string>)> UploadFiles(IList<IFormFile> files, IList<string> metadata, CancellationToken cancellationToken = default);
        //public Task<List<BlobItem>> GetBlobItems(string containerName, CancellationToken cancellationToken = default);
        public Task<List<BlobItem>> GetFiles(string containerName, CancellationToken cancellationToken = default);
        public Task<string> GetFileUrl_SAS(string filename, string containerName);
        public Task<List<string>> GetFileUrlFromDB(List<string> guid);

        public Task<List<FileManagementDto>> GetGroupFileUrlFromDB(List<string> groupGuid);
        public Task<List<FileManagementDto>> GetGroupFileUrlFromDB(List<string> groupGuid, AppDBContext context);

        public Task<MemoryStream> GetZipBlobFolderAsync(ZipFileRequest zipFileRequest, AppDBContext? context = null, CancellationToken cancellationToken = default);

        public Task<int> DeleteFile(List<string> guid);

    }
}
