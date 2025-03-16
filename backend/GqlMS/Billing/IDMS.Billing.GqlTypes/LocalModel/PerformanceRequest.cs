
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class CleanerPerformanceRequest: PerformanceBase
    {
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public string? method_name { get; set; }
        [NotMapped]
        public string? cleaning_bay { get; set; }
        [NotMapped]
        public string? cleaner_name { get; set; }
    }

    public class SteamPerformanceRequest : PerformanceBase
    {
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public List<string>? steaming_point { get; set; }
        [NotMapped]
        public string? yard { get; set; }
    }

    public class SurveyorPerformanceSummaryRequest : SurveyorBase
    {
        [NotMapped]
        public int start_month { get; set; }
        [NotMapped]
        public int end_month { get; set; }
        [NotMapped]
        public int year { get; set; }
        //[NotMapped]
        //public long start_date { get; set; }
        //[NotMapped]
        //public long end_date { get; set; }
    }

    public class SurveyorPerformanceDetailRequest : SurveyorBase
    {
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public long start_date { get; set; }
        [NotMapped]
        public long end_date { get; set; }
        [NotMapped]
        public List<string>? estimate_status { get; set; }
    }

    public class PerformanceBase
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
    }

    public class SurveyorBase
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public List<string>? surveyor_name { get; set; }
        [NotMapped]
        public List<string>? repair_type { get; set; }

    }

}
