using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.DB
{
    public class daily_tank_activity_result
    {
        [Key]
        public int id { get; set; }
        public string? tank_no { get; set; }
        public long? in_date { get; set; }
        public string take_in_ref { get; set; }
        public int? capacity { get; set; }
        public int? tare_weight { get; set; }
        public string? last_cargo { get; set; }
        public long? clean_date { get; set; }
        public string? owner { get; set; }
        public string? customer { get; set; }
        public string? customer_name { get; set; }
        public string? last_test { get; set; }
        public string? next_test { get; set; }
        public string? test_class_cv { get; set; }
        public long? av_date { get; set; }
        public long? clean_cert_date { get; set; }
        public long? release_booking { get; set; }
        public long? release_date { get; set; }
        public string? release_ref { get; set; }
        public string? status { get; set; }
        public bool purpose_cleaning { get; set; }
        public string? purpose_repair_cv { get; set; }
        public bool purpose_steam { get; set; }
        public bool purpose_storage { get; set; }
        public string? remarks { get; set; }
        public long? test_date { get; set; }
        public string? in_yard_cv { get; set; }
        public string? out_yard_cv { get; set; }
        public string? created_by { get; set; }
        public long? estimate_date { get; set; }
        public string? estimate_no { get; set; }
        public string? approval_ref { get; set; }
        public long? steam_date { get; set; }
        public int rn { get; set; }
    }

    public class TankGroup
    {
        public string? TankNo { get; set; }
        public List<daily_tank_activity_result> Activities { get; set; } = new();
    }

    public class CustomerGroup
    {
        public string? Customer { get; set; }
        public string? CustomerName { get; set; }
        public List<TankGroup> Tanks { get; set; } = new();
    }

    public class ValidCustomer
    {
        public string? code { get; set; }
        public string? email { get; set; }
    }
}
