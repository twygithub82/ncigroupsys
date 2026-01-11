using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class inspections: Dates
    {
        [Key]   
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("aspnetusers")]
        public string? aspnetusers_guid { get; set; }
        public string? marked_tank_section { get; set; }
        public string? marked_front_section { get; set; }
        public string? marked_rear_section { get; set; }
        public string? type_cv { get; set; }
        public long? inspect_dt { get; set; }
        public storing_order_tank? storing_order_tank { get; set; } 
        public aspnetusers? aspnetusers { get; set; }

        [UseFiltering]
        public IEnumerable<surface_types>? surface_types { get; set; }   
    }
}
