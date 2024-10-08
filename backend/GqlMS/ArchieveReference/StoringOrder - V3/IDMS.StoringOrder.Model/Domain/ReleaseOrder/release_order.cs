﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Domain.ReleaseOrder
{
    public class release_order:Base
    {
        [Key]
        [IsProjected(true)]
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? ro_no { get; set; }
        public long? release_dt { get; set; }
        public string? status_cv { get; set; }
    }
}
