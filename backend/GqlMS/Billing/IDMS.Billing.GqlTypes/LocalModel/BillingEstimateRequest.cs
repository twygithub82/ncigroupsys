using HotChocolate;
using IDMS.Models.Shared;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    [NotMapped]
    public class BillingEstimateRequest
    {
        public string process_guid { get; set; }
        public string process_type { get; set; }
        public string billing_party { get; set; } //OWNER, CUSTOMER
        public string action { get; set; }
        [GraphQLIgnore]
        public string? billing_guid { get; set; }
    }

    [NotMapped]
    public class StorageDetailRequest
    {
        public string action { get; set; }
        public string? guid { get; set; }
        public string sot_guid { get; set; }
        public long start_dt { get; set; }
        public long end_dt { get; set; }
        public double total_cost { get; set; }
        public int remaining_free_storage { get; set; }
        public string state_cv { get; set; }
        public string? remarks { get; set; }
    }
}
