using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class role : Dates
    {
        [Key]
        public string? guid { get; set; }
        public string? department { get; set; }
        public string? position { get; set; }
        public string? code { get; set; }
        public string? description { get; set; }

        [NotMapped]
        public string? action { get; set; }
    }


    public class user_role : Dates
    {
        [Key]
        public string guid { get; set; }
        public string user_guid { get; set; }

        [ForeignKey("role")]
        public string role_guid { get; set; }

    }

}
