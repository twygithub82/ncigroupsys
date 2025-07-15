using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.Models
{
    public class license_user : BaseDate
    {
        [Key]
        public string id { get; set; }

        [ForeignKey("license_sub")]
        public string sub_id { get; set; }
        public string user_tag { get; set; }
        public string license_key_token { get; set; }
        public string activation_code { get; set; }
        public bool is_active { get; set; }
        public DateTime create_dt { get; set; }
        public string? create_by { get; set; }
        public DateTime? update_dt { get; set; }
        public string? update_by { get; set; }
        public DateTime? delete_dt { get; set; }
        public virtual license_sub? license_sub { get; set; }

    }
}
