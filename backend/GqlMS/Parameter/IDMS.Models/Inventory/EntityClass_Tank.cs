using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class EntityClass_Tank:EntityClass_Dates
    {
        public string guid { get; set; }

        public string? so_guid {  get; set; }

        public string? unit_type_guid { get; set; }
        //public long? etr_dt { get; set; }

        public string? last_cargo_guid { get; set; }

        public string? tank_no { get; set; }

        public string? job_no { get; set; }

        public long? eta_dt { get; set; }

        public int? purpose_steam { get; set; }

        public int? purpose_storage { get; set; }

        public int? purpose_cleaning { get; set; }

        public string? purpose_repair_cv { get; set; }

        public float? required_temp { get; set; }

        public string? clean_status_cv { get; set; }

        public string? certificate_cv { get; set; }

        public string? remarks { get; set; }

        public long? etr_dt { get; set; }

        //public int? st { get; set; }

        //public int? o2_level { get; set; }

        //public int? open_on_gate { get; set; }

        public int? status_cv { get; set; }

        public EntityClass_InGateWithTank? in_gate { get; set; }

        public EntityClass_StoringOrder? storing_order { get; set; }


    }
}
