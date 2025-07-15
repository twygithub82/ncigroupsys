using IDMS.User.Authentication.API.Models.Authentication;
using Newtonsoft.Json.Linq;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.UserAuthentication.Models.Authentication.SignUp
{
    public class RegisterStaff : RolesTeams
    {
        [Required(ErrorMessage = "User Name is required")]
        public string? Username { get; set; }

        //[Required(ErrorMessage = "Email is required")]
        public string? Email { get; set; }

        [Required(ErrorMessage = "Password is required")]
        public string? Password { get; set; }

        [Required(ErrorMessage = "CorporateId is required")]
        public int? CorporateId { get; set; }
    }

    [NotMapped]
    public class QueryStaff
    {
        public string? Username { get; set; }
        public string? Email { get; set; }
        //public string? Role { get; set; }
        //public string? TeamDescription { get; set; }
    }

    [NotMapped]
    public class UpdateStaff
    {
        public string? Username { get; set; }
        public string? ContactNumber { get; set; }
        public List<RoleDetails>? Roles { get; set; }
        public List<TeamDetails>? Teams { get; set; }
    }


    [NotMapped]
    public class RoleDetails
    {
        public string? guid { get; set; }
        public string action { get; set; }
    }


    [NotMapped]
    public class TeamDetails
    {
        public string? guid { get; set; }
        public string action { get; set; }
    }


    [NotMapped]
    public class QueryStaffResult : RolesTeams
    {
        public string? Username { get; set; }
        public string? Name { get; set; }
        public string? Email { get; set; }
        public string? ContactNo { get; set; }
        public string? ActivateCode { get; set; }
        public string? LicenseToken { get; set; }
        public List<string>? Roles { get; set; }
        public List<string>? Teams { get; set; }
    }
}
