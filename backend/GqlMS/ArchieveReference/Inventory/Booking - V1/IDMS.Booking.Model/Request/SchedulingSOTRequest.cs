using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class SchedulingSOTRequest : Dates
    {
        public string? guid { get; set; }
        public string? sot_guid { get; set; }
        public string? scheduling_guid { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }

        [NotMapped]
        public string? action { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
        //public scheduling? scheduling { get; set; }
    }
}
