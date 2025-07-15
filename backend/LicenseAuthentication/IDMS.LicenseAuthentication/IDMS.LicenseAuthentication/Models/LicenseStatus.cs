using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.Models
{
    [NotMapped]
    public class LicenseStatus
    {
        public int StatusCode { get; set; }
        public string StatusMessage { get; set; }
        public string? StatusDescription { get; set; }
    }

    public enum LicenseStatusEnum
    {
        Valid = 1,
        Expired = 2,
        InvalidKey = 3,
        Inactive = 4,
        Deactivated = 5,
        HaventStart = 6,
        Forbidden = 7
    }
}
