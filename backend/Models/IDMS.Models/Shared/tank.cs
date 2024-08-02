using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using IDMS.Models.Tariff;

namespace IDMS.Models.Shared
{
    public class tank : Dates
    {
        [Key]
        [Column("guid")]
        public string? guid { get; set; }

        [ForeignKey(nameof(tariff_depot))]
        [Column("tariff_depot_guid")]
        public string? tariff_depot_guid {  get; set; }

        [Column("unit_type")]
        public string? unit_type { get; set; }

        [Column("description")]
        public string? description { get; set; }

        public tariff_depot? tariff_depot { get; set; }

    }
}
