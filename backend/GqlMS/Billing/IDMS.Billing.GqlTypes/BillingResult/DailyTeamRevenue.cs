using HotChocolate;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    public class DailyTeamRevenue : RepairDetails
    {
        [NotMapped]
        public long? estimate_date { get; set; }
        [NotMapped]
        public string? qc_by { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? qc_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? team { get; set; }
    }

    public class DailyTeamApproval : RepairDetails
    {
        [NotMapped]
        public string? status { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? estimate_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long? qc_date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? eir_no { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? team { get; set; }
    }

    [NotMapped]
    public class DailyQCDetail: RepairDetails
    {
        public long? estimate_date { get; set; }
        public string? qc_by { get; set; }
        public double? appv_hour { get; set; }
        public double? appv_material_cost { get; set; }
        [GraphQLIgnore]
        public string? eir_no { get; set; }
        [GraphQLIgnore]
        public long? qc_date { get; set; }
    }

    [NotMapped]
    public class TempRepairDetail : RepairDetails
    {
        public long? estimate_date { get; set; }
        public string? qc_by { get; set; }
        public double? appv_hour { get; set; }
        public double? appv_material_cost { get; set; }
        public string? eir_no { get; set; }
        public long? qc_date { get; set; }
        public string? team { get; set; }
    }



    [NotMapped]
    public class RepairDetails
    {
        public string? estimate_no { get; set; }
        public string? tank_no { get; set; }
        public string? code { get; set; }
        [GraphQLIgnore]
        public long? approved_date { get; set; }
        [GraphQLIgnore]
        public long? allocation_date { get; set; }
        public string? repair_type { get; set; }
        public double? repair_cost { get; set; }
    }
}
