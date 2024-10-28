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
    public class rp_damage_repair : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("repair_part")]
        public string? rp_guid { get; set; }
        public string code_cv { get; set; }
        public int code_type { get; set; }

        [NotMapped]
        public string? action { get; set; }
        public repair_part? repair_part { get; set; }
    }
}
