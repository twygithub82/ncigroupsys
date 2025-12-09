using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.User.Authentication.API.Models.Authentication
{
    [NotMapped]
    public class TeamDto
    {
        public string Description { get; set; }
        public string DepartmentCv { get; set; }
    }
}
