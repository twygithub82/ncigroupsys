using Microsoft.AspNetCore.Identity;

namespace IDMS.UserAuthentication.Models
{
    public class ApplicationUser:IdentityUser
    {
        public int CorporateID { get; set; }
        public bool isStaff { get; set; } = false;
        public Guid? CurrentSessionId { get; set; } = null;
        public string? ActivationCode { get; set; } = string.Empty;
        public string? LicenseToken { get; set; } = string.Empty;

    }
}
