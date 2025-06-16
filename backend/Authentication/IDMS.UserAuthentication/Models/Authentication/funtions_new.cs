using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.User.Authentication.API.Models.Authentication
{
    public class functions: base_date
    {
        [Key]
        public string? guid { get; set; }
        public string? module { get; set; }
        public string? submodule { get; set; }
        public string? action { get; set; }
        public string? code { get; set; }
        public virtual IEnumerable<role_functions>? role_functions_new { get; set; }
    }

    public class role: base_date
    {
        [Key]
        public string? guid { get; set; }
        public string? department { get; set; }
        public string? position { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }
        public virtual IEnumerable<role_functions>? role_functions { get; set; }
    }


    public class role_functions: base_date
    {
        [Key]
        public string? guid { get; set; }
        [ForeignKey("functions")]
        public string? functions_guid { get; set; }
        public string? role_guid { get; set; }
        public virtual functions? functions { get; set; }
        public virtual role? role { get; set; }
    }

    public class user_role: base_date
    {
        [Key]
        public string guid { get; set; }
        public string user_guid { get; set; }

        [ForeignKey("role")]
        public string role_guid { get; set; }

    }

    public class base_date
    {
        public long? delete_dt { get; set; }
        public long? create_dt { get; set; }
        public long? update_dt { get; set; }
        public string? create_by { get; set; }
        public string? update_by { get; set; }
    }
}
