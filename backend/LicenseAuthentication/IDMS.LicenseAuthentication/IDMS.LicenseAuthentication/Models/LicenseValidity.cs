
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.Models
{
    public class license_validity : BaseDate
    {
        [Key]
        public string valid_id { get; set; }  // Primary key (varchar(36))

        [ForeignKey("license_sub")]
        public string lic_sub_id { get; set; }  // Primary key (varchar(36))
        public DateTime valid_from { get; set; }  // Unix timestamp
        public DateTime valid_to { get; set; }    // Unix timestamp
        public bool deactivated { get; set; }  // bit(1)
        public DateTime? deactivate_dt { get; set; }  // Unix timestamp, nullable
        public float cost { get; set; }  // float
        public virtual license_sub license_sub { get; set; }
    }

    public class BaseDate
    {
        public string? create_by { get; set; }
        public string? update_by { get; set; }
        public DateTime create_dt { get; set; } // Unix timestamp
        public DateTime? update_dt { get; set; }    // Unix timestamp
        public DateTime? delete_dt { get; set; } // Unix timestamp, nullable

    }
}
