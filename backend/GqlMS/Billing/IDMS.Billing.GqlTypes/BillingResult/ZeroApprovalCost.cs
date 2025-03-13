
using HotChocolate;
using System.ComponentModel.DataAnnotations.Schema;


namespace IDMS.Billing.GqlTypes.BillingResult
{

    public class ZeroApprovalCost
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long? eir_dt { get; set; }
        [NotMapped]
        public string? customer_name { get; set; }
        [NotMapped]
        public long? complete_dt { get; set; }
        [NotMapped]
        public long? approve_dt { get; set; }
        [NotMapped]
        public double? est_cost { get; set; }
        [NotMapped]
        public string? estimate_no { get; set; }

        [GraphQLIgnore]
        [NotMapped]
        public string? last_cargo { get; set; }

    }

    public class SelectedZeroApprovalEstimate
    {
        [NotMapped]
        public string? guid { get; set; }
        [NotMapped]
        public long? complete_dt { get; set; }
        [NotMapped]
        public long? approve_dt { get; set; }
        [NotMapped]
        public double? est_cost { get; set; }
        [NotMapped]
        public string? estimate_no { get; set; }
    }
}
