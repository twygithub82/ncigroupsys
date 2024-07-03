using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace IDMS.Models.Shared
{
    public class tank : Dates
    {
        [Key]
        [Column("guid")]
        public string Guid { get; set; }

        [Column("unit_type")]
        public string UnitType { get; set; }

        [Column("description")]
        public string? Description { get; set; }

    }
}
