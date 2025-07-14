using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.Models
{
    public class license_sub : BaseDate
    {
        [Key]
        public string id { get; set; }  // Primary key (varchar(36))

        [ForeignKey("license_clients")]
        public string client_id { get; set; }  // Primary key (varchar(36))

        [ForeignKey("license")]
        public string lic_id { get; set; }  // Primary key (varchar(36))

        //[ForeignKey("license_validity")]
        //public string validity_id { get; set; }  // Primary key (varchar(36))
        public string license_key { get; set; }  // Primary key (varchar(36))
        public string license_type { get; set; }
        public int num_users { get; set; }
        public bool is_active { get; set; }
        public string dms_secret_key { get; set; }

        public virtual license? license {  get; set; }
        public virtual license_clients? license_clients { get; set; }
        public virtual IEnumerable<license_validity>? license_validity { get; set; }
    }
}
