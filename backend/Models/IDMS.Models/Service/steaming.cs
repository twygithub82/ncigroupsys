using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

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
        public string? invoice_by { get; set; }
        public long? invoice_dt { get; set; }

        [NotMapped]
        public string action { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; } = null;

        [UseFiltering]
        public IEnumerable<steaming_part?>? steaming_part { get; set; }
    }
}
