using IDMS.Models.Master;
using IDMS.Models.Tariff;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;


namespace IDMS.Models.Service
{
    public class repair_part : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("tariff_repair")]
        public string tariff_repair_guid { get; set; }

        [ForeignKey("repair")]
        public string? repair_guid { get; set; }

        [ForeignKey("job_order")]
        public string? job_order_guid { get; set; }
        public string? description { get; set; }
        public string? location_cv { get; set; }
        public string? remarks { get; set; }
        public string? comment { get; set; }
        public int? quantity { get; set; }
        public double? hour { get; set; }
        public bool owner { get; set; } = false;
        public double? material_cost { get; set; }
        public int? approve_qty { get; set; }   
        public double? approve_hour { get; set; }
        public double? approve_cost { get; set; }
        public bool? approve_part { get; set; }
        public long? complete_dt { get; set; }
    

        [NotMapped]
        public string? action { get; set; }
        public tariff_repair? tariff_repair { get; set; }

        [UseFiltering]
        public repair? repair { get; set; }

        [UseFiltering]
        public job_order? job_order { get; set; }

        [UseFiltering]
        public IEnumerable<rep_damage_repair>? rep_damage_repair { get; set; }
    }
}
