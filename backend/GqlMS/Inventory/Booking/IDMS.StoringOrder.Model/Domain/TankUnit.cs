using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model.Domain
{
    [Table("tank")]
    public class TankUnit : Base
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
