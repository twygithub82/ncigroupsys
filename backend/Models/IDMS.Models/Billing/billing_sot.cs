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

namespace IDMS.Models.Billing
{
    public class billing_sot : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string sot_guid { get; set; }

        [ForeignKey("tariff_depot")]
        public string tariff_depot_guid { get; set; }

        public string? loff_billing_guid { get; set; }
        public string? lon_billing_guid { get; set; }
        public string? preinsp_billing_guid { get; set; }
        public string? storage_billing_guid { get; set; }
        public string? gin_billing_guid { get; set; }
        public string? gout_billing_guid { get; set; }
        public bool? preinspection { get; set; }
        public bool? lift_on { get; set; }
        public bool? lift_off { get; set; }
        public bool? gate_in { get; set; }
        public bool? gate_out { get; set; }
        public string? storage_cal_cv { get; set; }
        public double? preinspection_cost { get; set; }
        public double? lift_on_cost { get; set; }
        public double? lift_off_cost { get; set; }
        public double? storage_cost { get; set; }
        public double? gate_in_cost { get; set; }
        public double? gate_out_cost { get; set; }
        public int? free_storage { get; set; }
        public string? remarks { get; set; }
        public string? depot_cost_remarks { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; }
        [UseFiltering]
        public tariff_depot? tariff_depot { get; set; }

        [ForeignKey("lon_billing_guid")]
        public virtual billing? lon_billing { get; set; }
        [ForeignKey("loff_billing_guid")]
        public virtual billing? loff_billing { get; set; }
        [ForeignKey("preinsp_billing_guid")]
        public virtual billing? preinsp_billing { get; set; }
        [ForeignKey("storage_billing_guid")]
        public virtual billing? storage_billing { get; set; }
        [ForeignKey("gin_billing_guid")]
        public virtual billing? gin_billing { get; set; }
        [ForeignKey("gout_billing_guid")]
        public virtual billing? gout_billing { get; set; }
    }
}
