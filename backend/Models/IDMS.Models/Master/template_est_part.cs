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
    public class template_est_part : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("template_est")]
        public string? template_est_guid { get; set; }

        [ForeignKey("tariff_repair")]
        public string? tariff_repair_guid { get; set; }

        // Relationship with tep_damage_repair (damage_code_guid)
        public string? damage_code_guid { get; set; }
        //[ForeignKey("damage_code_guid")]
        //public tep_damage_repair? damageCode { get; set; }

        // Relationship with tep_damage_repair (repair_code_guid)
        public string? repair_code_guid { get; set; }
        //[ForeignKey("repair_code_guid")]
        //public tep_damage_repair? repairCode { get; set; }
        public string? description { get; set; }
        public string? location_cv { get; set; }
        public string? remarks {  get; set; }
        public int? quantity { get; set; }
        public double? hour { get; set; }

        public template_est? template_est { get; set; }
        public tariff_repair? tariff_repair { get; set; }
        public tep_damage_repair? tep_damage_repair { get; set; } 
    }
}
