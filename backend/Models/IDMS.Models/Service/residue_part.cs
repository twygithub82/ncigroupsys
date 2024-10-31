using IDMS.Models.Tariff;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Service
{
    public class residue_part : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("residue")]
        public string? residue_guid { get; set; }

        [ForeignKey("tariff_residue")]
        public string? tariff_residue_guid { get; set; }

        [ForeignKey("job_order")]
        public string? job_order_guid { get; set; }
        public string? description { get; set; }
        public int? quantity { get; set; }
        public double? cost { get; set; }
        public bool? approve_part { get; set; }
        public long? complete_dt { get; set; }

        [UseFiltering]
        public residue? residue { get; set; }

        [UseFiltering]
        public tariff_residue? tariff_residue { get; set; }

        [UseFiltering]
        public job_order? job_order { get; set; }

        [NotMapped]
        public string? action { get; set; }
    }
}
