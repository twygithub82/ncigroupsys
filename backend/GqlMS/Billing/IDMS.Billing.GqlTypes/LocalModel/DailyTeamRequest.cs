
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class DailyTeamRevenuRequest: DailyRevenueApproval
    {
        [NotMapped]
        public List<string?>? team { get; set; }
    }

    public class DailyTeamApprovalRequest : DailyRevenueApproval
    {
        [NotMapped]
        public List<string?>? team { get; set; }
    }

    public class DailyRevenueApproval
    {
        [NotMapped]
        public List<string?>? repair_type { get; set; }
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long? estimate_start_date { get; set; }
        [NotMapped]
        public long? estimate_end_date { get; set; }
        [NotMapped]
        public long? allocation_start_date { get; set; }
        [NotMapped]
        public long? allocation_end_date { get; set; }
        [NotMapped]
        public long? approved_start_date { get; set; }
        [NotMapped]
        public long? approved_end_date { get; set; }
        [NotMapped]
        public long? qc_start_date { get; set; }
        [NotMapped]
        public long? qc_end_date { get; set; }
    }
}
