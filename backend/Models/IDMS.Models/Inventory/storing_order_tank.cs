using HotChocolate;
using IDMS.Models.Master;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class storing_order_tank:Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order")]
        public string? so_guid {  get; set; }

        [ForeignKey("tank")]
        public string? unit_type_guid { get; set; }

        [ForeignKey("tariff_cleaning")]
        public string? last_cargo_guid { get; set; }
        public string? last_test_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? owner_guid { get; set; } 
        public string? tank_no { get; set; }
        public string? job_no { get; set; }
        public string? preinspect_job_no { get; set; }
        public string? liftoff_job_no { get; set; }
        public string? lifton_job_no { get; set; }
        public string? takein_job_no { get; set; }
        public string? release_job_no { get; set; } 
        public long? eta_dt { get; set; }
        public bool? purpose_steam { get; set; }
        public bool? purpose_storage { get; set; }
        public bool? purpose_cleaning { get; set; }
        public string? purpose_repair_cv { get; set; }
        public float? required_temp { get; set; }
        public string? clean_status_cv { get; set; }
        public string? estimate_cv { get; set; }
        public string? certificate_cv { get; set; }
        public string? remarks { get; set; }
        public long? etr_dt { get; set; }
        public string? status_cv { get; set; }
        public string? tank_status_cv { get; set; }
        public string? tank_note { get; set; }
        public string? release_note { get; set; }
        public string? cleaning_remarks { get; set; }
        public string? steaming_remarks { get; set; }
        public string? repair_remarks { get; set; }
        public string? storage_remarks { get; set; }
        public long? last_release_dt { get; set; }

        public storing_order? storing_order { get; set; }
        public tariff_cleaning? tariff_cleaning { get; set; }
        public customer_company? customer_company { get; set; }

        [UseFiltering]
        public tank? tank { get; set; }

        [UseFiltering]
        public IEnumerable<in_gate>? in_gate { get; set; }
        [UseFiltering]
        public IEnumerable<out_gate>? out_gate { get; set; }
        [UseFiltering]
        public IEnumerable<booking>? booking { get; set; }
        [UseFiltering]
        public IEnumerable<scheduling_sot>? scheduling_sot { get; set; }
        [UseFiltering]
        public IEnumerable<release_order_sot>? release_order_sot { get; set; }
        [UseFiltering]
        public IEnumerable<repair>? repair { get; set; }
        [UseFiltering]
        public IEnumerable<residue?>? residue { get; set; }
        [UseFiltering]
        public IEnumerable<cleaning?>? cleaning { get; set; }
        [UseFiltering]
        public IEnumerable<steaming?>? steaming { get; set; }
        [UseFiltering]
        public IEnumerable<survey_detail?>? survey_detail { get; set; }
        [UseFiltering]
        public IEnumerable<transfer?>? transfer { get; set; }
    }
}
