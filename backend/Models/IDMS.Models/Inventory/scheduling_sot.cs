﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class scheduling_sot : Dates
    {
        [Key]
        [IsProjected(true)]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("scheduling")]
        public string? scheduling_guid { get; set; }
        public long? scheduling_dt { get; set; }
        public string? reference { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
        public scheduling? scheduling { get; set; }

    }
}
