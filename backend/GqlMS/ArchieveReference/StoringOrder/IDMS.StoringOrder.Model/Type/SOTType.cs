﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDMS.StoringOrder.Model.Domain;

namespace IDMS.StoringOrder.Model.Type
{
    public class SOTType : Base
    {
        public string? guid { get; set; }
        public string? so_guid { get; set; }
        public string? unit_type_guid { get; set; }
        public string? tank_no { get; set; }
        public string? last_cargo_guid { get; set; }
        public string? job_no { get; set; }
        public long? eta_dt { get; set; } = 0;

        public int? purpose_storage { get; set; } = 0;
        public int? purpose_steam { get; set; } = 0;
        public int? purpose_cleaning { get; set; } = 0;
        public string? purpose_repair_cv { get; set; }

        public float? required_temp { get; set; }
        public string? clean_status_cv { get; set; }
        public string? certificate_cv { get; set; }
        public string? remarks { get; set; }
        public long? etr_dt { get; set; } = 0;
        public int? st { get; set; } = 0;
        public int? o2_level { get; set; } = 0;
        public string? open_on_gate_cv { get; set; }
        public string? status_cv { get; set; }
    }
}
