using Azure.Storage.Blobs.Models;
using IDMS.FileManagement.Service;
using System.Text.RegularExpressions;
using System.Threading;

namespace IDMS.FileManagement.API
{
    public class Util
    {
        public static string GetContainerName(string fileType)
        {
            // Define the regular expression pattern
            var pattern = @"^(img|images|image)$";

            // Match the input against the pattern
            var match = Regex.Match(fileType.ToLower(), pattern);

            // Check if there's a match and return the appropriate result
            if (match.Success)
                return "images";
            else
                return fileType.ToLower();

        }
    }
}
