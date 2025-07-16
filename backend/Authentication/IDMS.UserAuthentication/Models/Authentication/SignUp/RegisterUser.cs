using System.ComponentModel.DataAnnotations;

namespace IDMS.UserAuthentication.Models.Authentication.SignUp
{
    public class RegisterUser
    {
       
        [Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }


        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }


        [Required(ErrorMessage = "CorporateId is required")]
        public int? CorporateId { get; set; }
    }

    public class CreateUser
    {

        public string? Email { get; set; }

        [Required(ErrorMessage = "Username is required")]
        public string? Username { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "CorporateId is required")]
        public int? CorporateId { get; set; }
    }
}
