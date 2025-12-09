using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.User.Authentication.API.Models.Authentication
{
    [NotMapped]
    public class RoleDto
    {
        public string Department { get; set; }
        public string Position { get; set; }
        public string Code { get; set; }
        public string Description { get; set; }
    }
}
