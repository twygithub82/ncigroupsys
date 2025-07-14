using IDMS.Models.Service;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class team: Dates
    {
        [Key]
        public string? guid {  get; set; }
        public string? description { get; set; }
        public string? department_cv { get; set; }

        [NotMapped]
        public string? action { get; set; }

        [UseFiltering]
        public IEnumerable<job_order?>? job_order {  get; set; } 
    }

    public class team_user: Dates
    {
        [Key]
        public string? guid { get; set; }
        public string? userId { get; set; }

        [ForeignKey("team")]
        public string? team_guid { get; set; }

        public virtual team? team { get; set; }
    }
}
