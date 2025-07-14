
using System.ComponentModel.DataAnnotations;

namespace IDMS.LicenseAuthentication.Models
{
    public class license : BaseDate
    {
        [Key]
        public string lic_id { get; set; }  // Primary key (varchar(36))
        public string product_code { get; set; }  // Primary key (varchar(36))
        public float product_cost { get; set; }  // float (UN)

    }
}
