
using System.ComponentModel.DataAnnotations;

namespace IDMS.LicenseAuthentication.Models
{
    public class license_clients : BaseDate
    {
        [Key]
        public string client_id { get; set; }  // Primary key (varchar(36))
        public string organization { get; set; }  // Primary key (varchar(36))
        public string email { get; set; } 

    }
}
