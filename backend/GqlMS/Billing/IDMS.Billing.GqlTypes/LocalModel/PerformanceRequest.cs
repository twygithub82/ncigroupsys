
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class CleanerPerformanceRequest
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long start_date { get; set; }
        [NotMapped]
        public long end_date { get; set; }
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public string? method_name { get; set; }
        [NotMapped]
        public string? cleaning_bay { get; set; }
        [NotMapped]
        public string? cleaner_name { get; set; }
    }

    public class SteamPerformanceRequest
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long start_date { get; set; }
        [NotMapped]
        public long end_date { get; set; }
        [NotMapped]
        public string? last_cargo { get; set; }
        //[NotMapped]
        //public string? method_name { get; set; }
        [NotMapped]
        public List<string>? steaming_point { get; set; }
        [NotMapped]
        public string? yard { get; set; }
    }
}
