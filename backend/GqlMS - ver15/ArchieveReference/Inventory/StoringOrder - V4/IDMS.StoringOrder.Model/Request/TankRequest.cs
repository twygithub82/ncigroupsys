﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Request
{
    [Table("tank")]
    public class TankRequest
    {
        [Column("guid")]
        public string Guid { get; set; }

        [Column("unit_type")]
        public string UnitType { get; set; }

        [Column("description")]
        public string? Description { get; set; }
    }
}
