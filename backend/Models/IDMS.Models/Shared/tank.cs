using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IDMS.Models.Shared
{
    public class tank : Dates
    {
        [Key]
        [Column("guid")]
        public string guid { get; set; }

        [Column("unit_type")]
        public string unit_type { get; set; }

        [Column("description")]
        public string? description { get; set; }

    }
}
