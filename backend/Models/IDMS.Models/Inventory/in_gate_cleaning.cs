using HotChocolate;
using HotChocolate.Data;
using IDMS.Models.Master;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Inventory
{

    public class in_gate_cleaning : Dates
    {
        [Key]
        public string? guid { get; set; } = "";

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? bill_to_guid { get; set; }
        public double? cleaning_cost { get; set; } = 0;
        public double? buffer_cost { get; set; } = 0;
        public string? status_cv { get; set; }
        public string? remarks { get; set; }
        public string? job_no { get; set; }
        public string? approve_by { get; set; }
        public long? approve_dt { get; set; }
        public string? allocate_by { get; set; }
        public long? allocate_dt { get; set; }  
        public string? complete_by { get; set; }    
        public long? complete_dt { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; } = null;

        [UseFiltering]
        public customer_company? customer_company { get; set; }
    }
}
