
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class CleanerPerformance
    {
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long? eir_dt { get; set; }
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public long? complete_dt { get; set; }
        [NotMapped]
        public double? cost { get; set; }
        [NotMapped]
        public string? method { get; set; }
        [NotMapped]
        public string? bay { get; set; }
        [NotMapped]
        public string? cleaner_name { get; set; }
        public double? duration { get; set; } 
    }
}
