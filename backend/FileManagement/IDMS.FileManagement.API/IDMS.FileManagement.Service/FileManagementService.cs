using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using IDMS.FileManagement.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;

namespace IDMS.FileManagement.Service
{
    public class FileManagementService : IFileManagement
    {

        BlobServiceClient _blobServiceClient;
        BlobContainerClient _blobImgContainerClient;
        BlobContainerClient _blobPdfContainerClient;

        string azureConnectionString = "";
        string rootImageContainerName = "images";
        string rootPdfContainerName = "pdf";

        public FileManagementService(IConfiguration config)
        {
            try
            {
                azureConnectionString = config.GetConnectionString("DefaultConnection");
                _blobServiceClient = new BlobServiceClient(azureConnectionString);

                //var img = $"{config["ContainersName:ImagesContainer"]}";
                //if (!string.IsNullOrEmpty(img))
                //    rootImageContainerName = img;

                //var pdf = $"{config["ContainersName:ImagesContainer"]}";
                //if (!string.IsNullOrEmpty(pdf))
                //    rootPdfContainerName = pdf;

                //_blobImgContainerClient = _blobServiceClient.GetBlobContainerClient(rootImageContainerName);
                //_blobPdfContainerClient = _blobServiceClient.GetBlobContainerClient(rootPdfContainerName);

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

        }

        //public async Task<List<BlobItem>> GetBlobItems(string containerName, CancellationToken cancellationToken = default)
        //{
        //    try
        //    {
        //        var blobItems = new List<BlobItem>();
        //        var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
        //        var uploadedFiles = blobContainerClient.GetBlobsAsync();
        //        await foreach (var file in uploadedFiles)
        //        {
        //            blobItems.Add(file);
        //        }
        //        return blobItems;
        //    }
        //    catch (Exception ex) 
        //    {
        //        throw;   
        //    }
        //}

        public async Task<List<BlobItem>> GetFiles(string containerName, CancellationToken cancellationToken = default)
        {
            try
            {
                var blobItems = new List<BlobItem>();
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var uploadedFiles = blobContainerClient.GetBlobsAsync();
                await foreach (var file in uploadedFiles)
                {
                    blobItems.Add(file);
                }
                return blobItems;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<string> GetFileUrl(string filename, string containerName)
        {
            try
            {
                string blobName = filename;
                DateTimeOffset expiryTime = DateTimeOffset.UtcNow.AddHours(1); // Example: Expires in 1 hour
                BlobSasBuilder sasBuilder = new BlobSasBuilder()
                {
                    BlobContainerName = containerName,
                    BlobName = blobName,
                    Resource = "b",
                    StartsOn = DateTimeOffset.UtcNow,
                    ExpiresOn = expiryTime,
                };
                sasBuilder.SetPermissions(BlobSasPermissions.Read);

                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                var blobClient = blobContainerClient.GetBlobClient(blobName);

                Uri sasUri = blobClient.GenerateSasUri(sasBuilder);
                string sasUrl = sasUri.ToString();

                Console.WriteLine("SAS URL for the blob:");
                Console.WriteLine(sasUrl);

                return sasUrl;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //public async Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, string type, CancellationToken cancellationToken = default)
        //{
        //    Response<BlobContentInfo> blobInfo = null;

        //    var azureResponce = new List<BlobContentInfo>();
        //    foreach (var file in files) { 
        //        string filename = file.FileName;
        //        using (var ms = new MemoryStream()) {
        //            file.CopyTo(ms);
        //            ms.Position = 0;

        //            if (FileTypes.PDF.ToLower().Equals(type.ToLower()))
        //                blobInfo = await _blobPdfContainerClient.UploadBlobAsync(filename, ms, cancellationToken);
        //            else if (FileTypes.IMG.ToLower().Equals(type.ToLower()) 
        //                   || FileTypes.IMAGE.ToLower().Equals(type.ToLower())
        //                   || FileTypes.IMAGES.ToLower().Equals(type.ToLower()))
        //                blobInfo = await _blobImgContainerClient.UploadBlobAsync(filename, ms, cancellationToken);

        //            if(blobInfo != null)
        //                azureResponce.Add(blobInfo);
        //        }
        //    }
        //    return azureResponce;
        //}

        public async Task<List<BlobContentInfo>> UploadFiles(List<IFormFile> files, string containerName, string filenameKey = "", CancellationToken cancellationToken = default)
        {
            Response<BlobContentInfo> blobInfo = null;

            try
            {
                var azureResponce = new List<BlobContentInfo>();
                foreach (var file in files)
                {

                    string filename = string.IsNullOrEmpty(filenameKey) ? file.FileName : filenameKey;
                    using (var ms = new MemoryStream())
                    {
                        file.CopyTo(ms);
                        ms.Position = 0;

                        var blobContainerClient = _blobServiceClient.GetBlobContainerClient(containerName);
                        await blobContainerClient.UploadBlobAsync(filename, ms, cancellationToken);

                        if (blobInfo != null)
                            azureResponce.Add(blobInfo);
                    }
                }
                return azureResponce;
            }
            catch (Exception ex)
            {
                throw;
            }

        }
    }
}
