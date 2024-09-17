using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Service
{
    public class repair_est_part : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("tariff_repair")]
        public string? tariff_repair_guid { get; set; }

        [ForeignKey("repair_est")]
        public string? repair_est_guid { get; set; }
        public string? description { get; set; }
        public string? location_cv { get; set; }
        public string? remarks { get; set; }
        public int quantity { get; set; }
        public double hour { get; set; }
        public bool owner { get; set; } = false;
        
        public tariff_repair? tariff_repair { get; set; }
        public repair_est? repair_est { get; set; }
        public IEnumerable<rep_damage_repair>? rep_damage_repair { get; set; }
    }
}
