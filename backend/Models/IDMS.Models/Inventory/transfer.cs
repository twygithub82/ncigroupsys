using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class transfer : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string sot_guid { get; set; }
        public string? location_from_cv { get; set; }
        public string? location_to_cv { get; set; }
        public long? transfer_out_dt { get; set; }
        public long? transfer_in_dt { get; set; }
        public string? haulier { get; set; }
        public string? vehicle_no { get; set; }
        public string? driver_name { get; set; }
        public string? remarks { get; set; }
        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; } 
    }
}
