using HotChocolate;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    public class DailyTeamRevenue
    {
        [NotMapped]
        public string? estimate_no { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public string? code { get; set; }
        [NotMapped]
        public long? estimate_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? approved_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? allocation_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? qc_date { get; set; }
        [NotMapped]
        public string? qc_by { get; set; }
        [NotMapped]
        public string? repair_type { get; set; }
        [NotMapped]
        public double? repair_cost { get; set; }
        [NotMapped]
        public string? team { get; set; }

    }
}
