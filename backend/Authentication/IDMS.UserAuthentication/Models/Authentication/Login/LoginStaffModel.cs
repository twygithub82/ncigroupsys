using System.ComponentModel.DataAnnotations;

namespace IDMS.UserAuthentication.Models.Authentication.Login
{
    public class LoginStaffModel
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }
    }

    public class UserClaimModel
    {
        [Required(ErrorMessage = "UserId is required")]
        public string? UserId { get; set; }

        //[Required(ErrorMessage = "Password is required")]
        //public string? Password { get; set; }
    }
}
