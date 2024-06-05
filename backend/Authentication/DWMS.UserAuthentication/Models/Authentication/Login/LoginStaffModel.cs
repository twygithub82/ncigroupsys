using System.ComponentModel.DataAnnotations;

namespace DWMS.UserAuthentication.Models.Authentication.Login
{
    public class LoginStaffModel
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
