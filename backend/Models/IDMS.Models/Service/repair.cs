﻿using IDMS.Models.Billing;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Service
{
    public class repair : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("aspnetsuser")]
        public string? aspnetusers_guid { get; set; }
        public string? estimate_no { get; set; }
        public double? labour_cost_discount { get; set; }
        public double? material_cost_discount { get; set; }
        public double? labour_cost { get; set; }
        public double? est_cost { get; set; }   
        public double? total_cost { get; set; }
        public double? total_hour { get; set; }
        public double? total_material_cost { get; set; }
        public double? total_labour_cost { get; set; }
        public string? remarks { get; set; }
        public bool? owner_enable { get; set; }
        public string? status_cv { get; set; }
        public string? job_no { get; set; }
        public long? complete_dt { get; set; }
        public long? na_dt { get; set; }
        public string? approve_by { get; set; }
        public long? approve_dt {  get; set; }
        public string? allocate_by { get; set; }
        public long? allocate_dt { get; set; }
        public string? overwrite_remarks { get; set; }

        [NotMapped]
        public string? action { get; set; }

        [ForeignKey("customer_company")]
        public string? bill_to_guid { get; set; }

        [ForeignKey("customer_billing")]
        public string? customer_billing_guid { get; set; }

        [ForeignKey("owner_billing")]
        public string? owner_billing_guid { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; }
        public aspnetusers? aspnetsuser { get; set; }

        [UseFiltering]
        public IEnumerable<repair_part>? repair_part { get; set; }

        [UseFiltering]
        public billing? customer_billing { get; set; }

        [UseFiltering]
        public billing? owner_billing { get; set; }
    }
}
