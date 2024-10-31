using DWMS.User.Authentication.API.Models.Authentication;
using System.ComponentModel.DataAnnotations;

namespace DWMS.UserAuthentication.Models.Authentication.SignUp
{
    public class RegisterStaff:RolesTeams
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }


        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }


        [Required(ErrorMessage = "CorporateId is required")]
        public int? CorporateId { get; set; }
    }
}
