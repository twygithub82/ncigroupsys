using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class functions : Dates
    {
        [Key]
        public string? guid { get; set; }
        public string? module { get; set; }
        public string? submodule { get; set; }
        public string? action { get; set; }
        public string? code { get; set; }
        public string? opt { get; set; }
        public virtual IEnumerable<role_functions>? role_functions { get; set; }
        public virtual IEnumerable<user_functions>? user_functions { get; set; }
    }


    public class role_functions : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("functions")]
        public string? functions_guid { get; set; }
        [ForeignKey("role")]
        public string? role_guid { get; set; }

        [NotMapped]
        public string? action { get; set; }
        public virtual functions? functions { get; set; }
        public virtual role? role { get; set; }
    }

    public class user_functions : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("functions")]
        public string? functions_guid { get; set; }
        public string? user_guid { get; set; }
        public bool? adhoc { get; set; }
        public string? remarks { get; set; }    

        [NotMapped]
        public string? action { get; set; }
        public virtual functions? functions { get; set; }
        public virtual aspnetusers? user { get; set; }
    }
}
