using IDMS.Models.Tariff;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Master
{
    public class tep_damage_repair : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("template_est_part")]
        public string? tep_guid { get; set; }
        public string? code_cv { get; set; }
        public string? code_type { get; set; }
        public template_est_part template_est_part { get; set; }
    }
}
