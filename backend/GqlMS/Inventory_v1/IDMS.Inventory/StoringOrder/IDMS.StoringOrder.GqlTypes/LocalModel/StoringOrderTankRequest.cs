using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO.Pipes;
using IDMS.Models;


namespace IDMS.StoringOrder.GqlTypes.LocalModel
{
    public class StoringOrderTankRequest : Dates
    {
        public string? guid { get; set; }

        public string? so_guid { get; set; }
        public string? unit_type_guid { get; set; }
        public string? last_cargo_guid { get; set; }
        public string? last_test_guid { get; set; }
        public string? owner_guid { get; set; }
        public string? tank_no { get; set; }
        public string? job_no { get; set; }

        public string? preinspect_job_no { get; set; }
        public string? liftoff_job_no { get; set; }
        public string? lifton_job_no { get; set; }
        public string? takein_job_no { get; set; }
        public string? release_job_no { get; set; }

        public bool? purpose_storage { get; set; } = false;
        public bool? purpose_steam { get; set; } = false;
        public bool? purpose_cleaning { get; set; } = false;
        public float? required_temp { get; set; }
        public string? remarks { get; set; }


        public string? purpose_repair_cv { get; set; }
        public string? clean_status_cv { get; set; }
        public string? certificate_cv { get; set; }
        public string? status_cv { get; set; }
        public string? tank_status_cv { get; set; }
        public string? estimate_cv { get; set; }

        public long? eta_dt { get; set; } = 0;
        public long? etr_dt { get; set; } = 0;

        [NotMapped]
        public string? action { get; set; }
    }
}
