using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class release_order_sot : Dates
    {
        [Key]
        [IsProjected(true)]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("release_order")]
        public string? ro_guid { get; set; }
        public string? status_cv { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
        public release_order? release_order { get; set; }

    }
}
