using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using IDMS.Models.Tariff;

namespace IDMS.Models.Service
{
    public class steaming_part : Dates
    {
        [Key]
        public string? guid { get; set; } = "";

        [ForeignKey("steaming")]
        public string? steaming_guid { get; set; }

        [ForeignKey("tariff_steaming")]
        public string? tariff_steaming_guid { get; set; }

        [ForeignKey("job_order")]
        public string? job_order_guid { get; set; }
        public string? description { get; set; }
        public int? quantity { get; set; }
        public double? cost { get; set; }
        public double? labour { get; set; }
        public bool? approve_part { get; set; }
        public int? approve_qty { get; set; }
        public double? approve_labour { get; set; }
        public double? approve_cost { get; set; }
        public long? complete_dt { get; set; }

        [NotMapped]
        public string action { get; set; }

        [UseFiltering]
        public steaming? steaming { get; set; } = null;

        [UseFiltering]
        public tariff_steaming? tariff_steaming { get; set; } = null;

        [UseFiltering]
        public job_order? job_order { get; set; }
    }
}
