using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using IDMS.Models.Billing;

namespace IDMS.Models.Service
{
    public class steaming : Dates
    {
        [Key]
        public string? guid { get; set; } = "";

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }
        public string? job_no { get; set; }
        public double? total_cost { get; set; }
        public string? estimate_no { get; set; }
        public string? estimate_by { get; set; }
        public long? estimate_dt { get; set; }
        public string? approve_by { get; set; }
        public long? approve_dt { get; set; }
        public string? begin_by { get; set; }
        public long? begin_dt { get; set; }
        public string? complete_by { get; set; }
        public long? complete_dt { get; set; }
        public long? na_dt { get; set; }
        public string? allocate_by { get; set; }
        public long? allocate_dt { get; set; }

        [ForeignKey("customer_company")]
        public string? bill_to_guid { get; set; }

        [ForeignKey("customer_billing")]
        public string? customer_billing_guid { get; set; }
        //[ForeignKey("owner_billing")]
        public string? owner_billing_guid { get; set; }

        [NotMapped]
        public string action { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; } = null;

        [UseFiltering]
        [UseSorting]
        public IEnumerable<steaming_part?>? steaming_part { get; set; }
        [UseFiltering]
        public billing? customer_billing { get; set; }

        //[UseFiltering]
        //public billing? owner_billing { get; set; }
    }
}
