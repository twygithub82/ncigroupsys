using System.ComponentModel.DataAnnotations;

namespace IDMS.StoringOrder.Model.Domain.StoringOrder
{
    public class storing_order_tank : Base
    {
        [Key]
        public string? guid { get; set; }
        public string? unit_type_guid { get; set; }
        public string? last_cargo_guid { get; set; }
        public string? last_test_guid { get; set; }
        public string? tank_no { get; set; }
        public string? job_no { get; set; }

        public int? purpose_storage { get; set; } = 0;
        public int? purpose_steam { get; set; } = 0;
        public int? purpose_cleaning { get; set; } = 0;
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

        public string? so_guid { get; set; }
        public storing_order? storing_order { get; set; }
        public tariff_cleaning? tariff_cleaning { get; set; }

        //public string? code_val { get; set; }
        //public CodeValues? code_values { get; set; }
    }
}
