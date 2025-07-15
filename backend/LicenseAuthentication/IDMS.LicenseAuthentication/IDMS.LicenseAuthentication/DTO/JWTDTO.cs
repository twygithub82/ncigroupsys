using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.DTO
{
    [NotMapped]
    public class JWTDTO
    {
        [Required]
        public string LicSubId { get; set; }
        [Required]
        public string UserEmail { get; set; }
    }

    [NotMapped]
    public class UserActivateDTO
    {
        [Required]
        public string ActivationCode { get; set; }
        [Required]
        public string UserTag { get; set; }
    }
}
