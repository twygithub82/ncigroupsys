using IDMS.Models.Inventory;

namespace IDMS.InGateSurvey.Model.Request
{
    public class InGateSurveyRequest
    {
        public string? guid { get; set; }
        public string in_gate_guid { get; set; }
        public string? periodic_test_guid { get; set; }
        public int? capacity { get; set; }
        public int? tare_weight { get; set; }
        public string? take_in_reference { get; set; }
        public long? dom_dt { get; set; }
        public long? inspection_dt { get; set; }
        public long? last_release_dt { get; set; }
        public string? manufacturer_cv { get; set; }
        public string? cladding_cv { get; set; }
        public string? max_weight_cv { get; set; }
        public string? height_cv { get; set; }
        public string? walkway_cv { get; set; }
        public string? tank_comp_cv { get; set; }
        public string? last_test_cv { get; set; }
        public string? take_in_status_cv { get; set; }
        public string? btm_dis_comp_cv { get; set; }
        public string? btm_dis_valve_cv { get; set; }
        public string? btm_dis_valve_spec_cv { get; set; }
        public string? btm_valve_brand_cv { get; set; }
        public string? top_dis_comp_cv { get; set; }
        public string? top_dis_valve_cv { get; set; }
        public string? top_dis_valve_spec_cv { get; set; }
        public string? top_valve_brand_cv { get; set; }
        public string? manlid_comp_cv { get; set; }
        public string? foot_valve_cv { get; set; }
        public int? thermometer { get; set; }
        public string? thermometer_cv { get; set; }
        public bool? ladder { get; set; } = false;
        public bool? data_csc_transportplate { get; set; } = false;
        public int? airline_valve_pcs { get; set; }
        public float? airline_valve_dim { get; set; }
        public string? airline_valve_cv { get; set; }
        public string? airline_valve_conn_cv { get; set; }
        public string? airline_valve_conn_spec_cv { get; set; }
        public string? manlid_cover_cv { get; set; }
        public int? manlid_cover_pcs { get; set; }
        public int? manlid_cover_pts { get; set; }
        public string? manlid_seal_cv { get; set; }
        public string? pv_type_cv { get; set; }
        public string? pv_spec_cv { get; set; }
        public int? pv_type_pcs { get; set; }
        public int? pv_spec_pcs { get; set; }
        public bool? safety_handrail { get; set; } = false;
        public bool? dipstick { get; set; } = false;
        public int? buffer_plate { get; set; }
        public float? residue { get; set; }
        public string? comments { get; set; }
    }
}
