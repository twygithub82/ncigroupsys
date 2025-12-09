using System.ComponentModel.DataAnnotations;

namespace IDMS.UserAuthentication.Models.Authentication.Login
{
    public class LoginUserModel
    {
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }
}
