using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDMS.Models.Billing;
using System.Data.Entity.Migrations.Builders;

namespace IDMS.Models.Shared
{
    public class storage_detail: Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string sot_guid { get; set; }

        [ForeignKey("billing")]
        public string billing_guid { get; set; }
        public long start_dt { get; set; }
        public long end_dt { get; set; }
        public double total_cost { get; set; }
        public int remaining_free_storage { get; set; }
        public string state_cv { get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; }
        [UseFiltering]
        public billing? billing { get; set; }
    }
}
