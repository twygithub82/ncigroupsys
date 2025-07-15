using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.User.Authentication.API.Models.Authentication
{
    [NotMapped]
    public class StaffActivateDTO
    {
        [Required(ErrorMessage = "Activation Code is required")]
        public string ActivationCode { get; set; }

        [Required(ErrorMessage = "User Tag is required")]
        public string UserTag { get; set; }
    }
}
