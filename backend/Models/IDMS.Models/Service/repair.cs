using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Service
{
    public class repair : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("aspnetsuser")]
        public string? aspnetusers_guid { get; set; }
        public string? estimate_no { get; set; }
        public double? labour_cost_discount { get; set; }
        public double? material_cost_discount { get; set; }
        public double? labour_cost { get; set; }
        public double? total_cost { get; set; }
        public string? remarks { get; set; }
        public bool? owner_enable { get; set; } = false;
        public string? status_cv { get; set; }
        public string? job_no { get; set; }
        public double? total_hour { get; set; } 

        [ForeignKey("customer_company")]
        public string? bill_to_guid { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; }
        public aspnetusers? aspnetsuser { get; set; }

        [UseFiltering]
        public IEnumerable<repair_est_part>? repair_est_part { get; set; }
    }
}
