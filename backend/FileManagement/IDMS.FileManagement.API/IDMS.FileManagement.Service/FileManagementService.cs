using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using IDMS.FileManagement.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace IDMS.FileManagement.Service
{
    public class FileManagementService: IFileManagement
    {

        BlobServiceClient _blobServiceClient;
        BlobContainerClient _blobContainerClient;

        string azureConnectionString = "";
        string rootContainerName = "images";

        public FileManagementService(IConfiguration config)
        {
            azureConnectionString = config.GetConnectionString("DefaultConnection");
            _blobServiceClient = new BlobServiceClient(azureConnectionString);
            _blobContainerClient = _blobServiceClient.GetBlobContainerClient(rootContainerName);

     


        }

        public async Task<List<BlobItem>> GetBlobItems(CancellationToken cancellationToken = default)
        {
            var blobItems = new List<BlobItem>();
            var uploadedFiles = _blobContainerClient.GetBlobsAsync();
            await foreach (var file in uploadedFiles)
            {
                blobItems.Add(file);
            }
            return blobItems;
        }

        public async Task<List<BlobItem>> GetFiles(CancellationToken cancellationToken = default)
        {
            var blobItems = new List<BlobItem>();
            var uploadedFiles = _blobContainerClient.GetBlobsAsync();
            await foreach (var file in uploadedFiles)
            {
                blobItems.Add(file);
            }
            return blobItems;
        }

        public async Task<string> GetUrl()
        {
            string blobName = "Mic.jpg";
            BlobClient blobClient = _blobContainerClient.GetBlobClient(blobName);

            DateTimeOffset expiryTime = DateTimeOffset.UtcNow.AddHours(1); // Example: Expires in 1 hour
            BlobSasBuilder sasBuilder = new BlobSasBuilder()
            {
                BlobContainerName = "images",
                BlobName = blobName,
                Resource = "b",
                StartsOn = DateTimeOffset.UtcNow,
                ExpiresOn = expiryTime,
            };
            sasBuilder.SetPermissions(BlobSasPermissions.Read);

            Uri sasUri = blobClient.GenerateSasUri(sasBuilder);
            string sasUrl = sasUri.ToString();

            Console.WriteLine("SAS URL for the blob:");
            Console.WriteLine(sasUrl);

            return sasUrl;
        }

        public async Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, CancellationToken cancellationToken = default)
        {
            var azureResponce = new List<BlobContentInfo>();
            foreach (var file in files) { 
                string filename = file.FileName;
                using (var ms = new MemoryStream()) {
                    file.CopyTo(ms);
                    ms.Position = 0;

                    var client = await _blobContainerClient.UploadBlobAsync(filename, ms, cancellationToken);
                    azureResponce.Add(client);
                }
            }
            return azureResponce;
        }
    }
}
