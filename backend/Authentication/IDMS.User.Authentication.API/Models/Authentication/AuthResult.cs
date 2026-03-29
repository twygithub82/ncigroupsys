using System.ComponentModel.DataAnnotations;
using System.Drawing;

namespace IDMS.User.Authentication.API.Models.Authentication
{
    public class AuthResult
    {
        public string Token { get; set; }
        public DateTime Expiration { get; set; }
        public string RefreshToken { get; set; }
    }


    public class MfaDTO    {
        [Required]
        //[StringLength(6, MinimumLength = 6, ErrorMessage = "Verification code must be 6 digits.")]
        public string Code { get; set; }

        // Optional: Helpful if you support both SMS and Google Authenticator
        public string Provider { get; set; } = "AuthenticatorApp";

        // Optional: A recovery code field if they lost their device
        public bool IsRecoveryCode { get; set; } = false;
    }
}
