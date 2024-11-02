using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace DWMS.User.Authentication.API.Models.Authentication
{

    public class AssignRolesTeams : RolesTeams
    {
        public string UserName { get; set; }
    }

    public class RolesTeams
    {
        public List<string>? Roles { get; set; }
        public List<Team>? Teams { get; set; }
    }

    public class Team
    {
        public string? Description { get; set; } = string.Empty;
        public string? Department { get; set; } = string.Empty;
    }


    public class team
    {
        [Key]
        public string? guid { get; set; }
        public string? description { get; set; }
        public string? department_cv { get; set; }
        public long? delete_dt { get; set; }
        public long? create_dt { get; set; }
        public long? update_dt { get; set; }
        public string? create_by { get; set; }
        public string? update_by { get; set; }

        
    }

    public class team_user
    {
        [Key]
        public string? guid { get; set; }
        public string? userId { get; set; }

        [ForeignKey("team")]
        public string? team_guid { get; set; }
        public long? delete_dt { get; set; }
        public long? create_dt { get; set; }
        public long? update_dt { get; set; }
        public string? create_by { get; set; }
        public string? update_by { get; set; }

        public team? team { get; set; }
    }
}
