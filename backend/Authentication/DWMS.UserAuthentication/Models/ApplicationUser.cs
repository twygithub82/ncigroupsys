using Microsoft.AspNetCore.Identity;

namespace DWMS.UserAuthentication.Models
{
    public class ApplicationUser:IdentityUser
    {

        public int CorporateID { get; set; }

        public bool isStaff { get; set; } = false;

        
    }
}
