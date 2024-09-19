using Azure;
using Azure.Storage.Blobs;
using Azure.Storage.Blobs.Models;
using Azure.Storage.Sas;
using CommonUtil.Core.Service;
using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Interface.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Org.BouncyCastle.Bcpg;
using System;

namespace IDMS.FileManagement.Service
{
    public class FileManagementService : IFileManagement
    {

        BlobServiceClient _blobServiceClient;
        BlobContainerClient _blobImgContainerClient;
        BlobContainerClient _blobPdfContainerClient;

        string azureConnectionString = "";
        string dbConnectionString = "";
        string rootImageContainerName = "images";
        string rootPdfContainerName = "pdf";
        string rootFileContainerName = "files";

        private AppDBContext _context;

        public FileManagementService(IConfiguration config, AppDBContext context)
        {
            try
            {
                _context = context;
                //Setup Azure Connection 
                azureConnectionString = config.GetConnectionString("AzureConnection");
                _blobServiceClient = new BlobServiceClient(azureConnectionString);
                Console.WriteLine($"Azure blob storage connection: {azureConnectionString}");
                //Setup Db Connection
                dbConnectionString = config.GetConnectionString("LocalDbConnection");
                Console.WriteLine($"Database connection: {azureConnectionString}");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                throw;
            }

        }

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

        public async Task<string> GetFileUrl_SAS(string filename, string containerName)
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

        public async Task<(int, List<string>)> UploadFiles(IList<IFormFile> files, IList<string> metadata, CancellationToken cancellationToken = default)
        {
            try
            {
                //var firstMetaObject = JsonConvert.DeserializeObject<FileMetadata>(metadata.First());
                //await CreateFolderIfNotExistsAsync(rootFileContainerName, $"{firstMetaObject.TableName.ToLower()}/{firstMetaObject.GroupGuid.ToLower()}");

                List<string> returnUrl = new List<string>();
                var currentDate = DateTime.Now.ToEpochTime();
                for (int i = 0; i < files.Count; i++)
                {
                    var file = files[i];
                    var metadataObj = JsonConvert.DeserializeObject<FileMetadata>(metadata[i]);

                    if (file.Length > 0)
                    {
                        string guid = Util.GenerateGUID();
                        var fileObject = new file_management()
                        {
                            guid = guid,
                            description = metadataObj.Description,
                            table_name = metadataObj.TableName,
                            file_type_cv = metadataObj.FileType,
                            group_guid = metadataObj.GroupGuid,
                            create_by = "user",
                            create_dt = currentDate,
                        };

                        string extension = "";
                        if (metadataObj.FileType == "img" || metadataObj.FileType == "image" || metadataObj.FileType == "jpg")
                            extension = "jpg";
                        else if (metadataObj.FileType == "pdf")
                            extension = "pdf";
                        else if (metadataObj.FileType.Contains("xls"))
                            extension = "xlsx";

                        string filename = $"{guid}.{extension}";
                        string blobPath = $"{metadataObj.TableName.ToLower()}/{metadataObj.GroupGuid.ToLower()}/";
                        string fullPath = blobPath + filename;
                        using (var ms = new MemoryStream())
                        {
                            file.CopyTo(ms);
                            ms.Position = 0;

                            var blobHttpHeaders = new BlobHttpHeaders { ContentType = file.ContentType };

                            var blobContainerClient = _blobServiceClient.GetBlobContainerClient(rootFileContainerName);
                            var blobClient = blobContainerClient.GetBlobClient(fullPath);
                            var response = await blobClient.UploadAsync(ms, new BlobUploadOptions { HttpHeaders = blobHttpHeaders });

                            fileObject.url = blobClient.Uri.ToString();
                            returnUrl.Add(fileObject.url);
                            _context.Add(fileObject);
                        }
                        // Here, you could save metadataObj.Description and metadataObj.Category associated with the file
                        // For example: Save metadataObj and file.FileName to a database or other storage mechanism
                    }
                }
                var res = await _context.SaveChangesAsync();
                return (res, returnUrl);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<string>> GetFileUrlFromDB(List<string> guid)
        {
            try
            {
                List<string> res = new List<string>();
                if (guid.Count == 0)
                    res = await _context.file_management.Where(f => (f.delete_dt == null || f.delete_dt == 0)).Select(f => f.url).ToListAsync();
                else
                    res = await _context.file_management.Where(f => guid.Contains(f.guid) && (f.delete_dt == null || f.delete_dt == 0)).Select(f => f.url).ToListAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        public async Task<int> DeleteFile(List<string> guid)
        {
            try
            {
                var files = _context.file_management.Where(f => guid.Contains(f.guid));

                var user = "user";
                var currentDate = DateTime.Now.ToEpochTime();
                //// Get the container client
                var blobContainerClient = _blobServiceClient.GetBlobContainerClient(rootFileContainerName);

                foreach (var file in files)
                {
                    var blobName = file.url.Split("/", 5, StringSplitOptions.None);
                    var uri = new Uri(file.url);

                    //Get the blob client
                    var blobClient = blobContainerClient.GetBlobClient(blobName[4]);

                    // Delete the blob
                    //await blobClient.DeleteIfExistsAsync();

                    // Delete the blob if it exists
                    try
                    {
                        if (blobClient != null)
                        {
                            await blobClient.DeleteIfExistsAsync();
                            file.delete_dt = currentDate;
                            file.update_dt = currentDate;
                            file.update_by = user;
                            Console.WriteLine($"{blobName} deleted successfully.");
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"Error deleting {blobName}: {ex.Message}");
                        // Handle exceptions as needed
                    }
                }
                var res = await _context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        public async Task<List<string>> GetGroupFileUrlFromDB1(List<string> groupGuid)
        {
            try
            {
                List<string> res = new List<string>();
                res = await _context.file_management.Where(f => groupGuid.Contains(f.group_guid) &&
                        (f.delete_dt == null || f.delete_dt == 0)).Select(f => f.url).ToListAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<List<FileManagementDto>> GetGroupFileUrlFromDB(List<string> groupGuid)
        {
            try
            {
                var res = await _context.file_management.Where(f => groupGuid.Contains(f.group_guid) &&
                        (f.delete_dt == null || f.delete_dt == 0)).Select(f => new FileManagementDto { Url = f.url, Description = f.description }).ToListAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }


        #region Private Function
        private async Task<bool> CreateFolderIfNotExistsAsync(string containerName, string folderName)
        {
            var containerClient = _blobServiceClient.GetBlobContainerClient(containerName);
            // Check if container exists
            if (!await containerClient.ExistsAsync())
            {
                await containerClient.CreateAsync();
            }

            // Simulate folder by creating a blob with a prefix
            var folderBlobName = $"{folderName.TrimEnd('/')}/";
            var blobClient = containerClient.GetBlobClient(folderBlobName);

            if (!await blobClient.ExistsAsync())
            {
                // Create an empty blob to represent the folder
                //await blobClient.UploadAsync(new BinaryData(Array.Empty<byte>()));
                return false;
            }
            return true;
        }
        #endregion

        #region Unused Function
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
        #endregion

    }
}
