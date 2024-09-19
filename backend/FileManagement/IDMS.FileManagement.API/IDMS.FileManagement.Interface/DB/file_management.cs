using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.DB
{
    public class file_management
    {
        [Key]
        public string guid { get; set; }
        public string? description { get; set; }
        public string? url { get; set; }
        public string file_type_cv { get; set; }
        public string group_guid { get; set; }
        public string table_name { get; set; }
        public string? create_by { get; set; }
        public long? create_dt { get; set; }
        public string? update_by { get; set; }
        public long? update_dt { get; set; }
        public long? delete_dt { get; set; }
    }

    public class FileManagementDto
    {
        public string Url { get; set; }
        public string Description { get; set; }
        // Add other properties as needed
    }
}
