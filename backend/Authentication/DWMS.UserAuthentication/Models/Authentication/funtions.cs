using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DWMS.User.Authentication.API.Models.Authentication
{
    public class functions
    {
        [Key]
        public string? guid { get; set; }
        public string? name { get; set; }
        public long? delete_dt { get; set; }
        public long? create_dt { get; set; }
        public long? update_dt { get; set; }
        public string? create_by { get; set; }
        public string? update_by { get; set; }

        public IEnumerable<role_function>? role_function { get; set; }
    }

    public class role_function
    {
        [Key]
        public string? guid { get; set; }
        public string? role_guid { get; set; }

        [ForeignKey("functions")]
        public string? function_guid { get; set; }
        public long? delete_dt { get; set; }
        public long? create_dt { get; set; }
        public long? update_dt { get; set; }
        public string? create_by { get; set; }
        public string? update_by { get; set; }

        public functions? functions { get; set; }

    }
}
