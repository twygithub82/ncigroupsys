using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface
{
    public class FileMetadata
    {
        public string GroupGuid { get; set; }
        public string TableName { get; set; }
        public string FileType { get; set; }
        public string Description { get; set; }
    }

    public class FileReturnData
    {
        public int affected { get; set; }
        public List<string> url { get; set; }
    }

    public class ZipFileRequest
    {
        public string GroupGuid { get; set; } = string.Empty;
        public string? TankNo { get; set; } = string.Empty;
    }
}
