
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class DailyTeamRevenuRequest: DailyRepair
    {
        [NotMapped]
        public List<string?>? team { get; set; }
    }

    public class DailyTeamApprovalRequest : DailyRepair
    {
        [NotMapped]
        public List<string?>? team { get; set; }
    }

    public class DailyQCDetailRequest : DailyRepair
    {
        [NotMapped]
        public List<string?>? team { get; set; }
    }

    [NotMapped]
    public class DailyRepair
    {
        public List<string?>? repair_type { get; set; }
        public string? customer_code { get; set; }
        public string? tank_no { get; set; }
        public string? eir_no { get; set; }
        public long? estimate_start_date { get; set; }
        public long? estimate_end_date { get; set; }
        public long? allocation_start_date { get; set; }
        public long? allocation_end_date { get; set; }
        public long? approved_start_date { get; set; }
        public long? approved_end_date { get; set; }
        public long? qc_start_date { get; set; }
        public long? qc_end_date { get; set; }
    }
}
