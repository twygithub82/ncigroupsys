﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class EntityClass_Tank
    {
        public string guid { get; set; }


        public string? unit_type_guid { get; set; }
        public long? eir_date { get; set; }

        public string? last_cargo_guid { get; set; }

        public string? tank_no { get; set; }

        public string? job_no { get; set; }

        public long? eta_dt {  get; set; }

        public int? purpose_stream { get; set; }

        public int? purpose_storage { get; set; }

        public int? purpose_cleaning { get; set; }

        public string? purpose_repair {  get; set; }

        public float? required_temp {  get; set; }

        public string? clean_status {  get; set; }

        public string? certificate { get; set; }

        public string? remarks {  get; set; }

        public long? etr_dt { get; set; }

        public int? st { get; set; }

        public int? o2_level { get; set; }

        public int? open_on_gate { get; set; }

        public int? status { get; set; }




    }
}