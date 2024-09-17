using IDMS.Models.Service;
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
    public class rep_damage_repair : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("repair_est_part")]
        public string? rep_guid { get; set; }
        public string code_cv { get; set; }
        public int code_type { get; set; }

        [NotMapped]
        public string? action { get; set; }
        public repair_est_part? repair_est_part { get; set; }
    }
}
