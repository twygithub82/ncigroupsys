using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    public class TempSurveyorPerformance : SurveyorList
    {
        [NotMapped]
        [GraphQLIgnore]
        public string? customer_code { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public long date { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? month { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? repair_type { get; set; }
    }

    public class SurveyorPerformanceResult
    {
        [NotMapped]
        public List<SurveyorPerformanceByMonth> monthly_results { get; set; }
        [NotMapped]
        public int grand_total_est_count { get; set; }
        [NotMapped]
        public double? grand_total_est_cost { get; set; }
        [NotMapped]
        public double? grand_total_appv_cost { get; set; }
        [NotMapped]
        public double? grand_total_diff_cost { get; set; }
        [NotMapped]
        public double? grand_total_average { get; set; }
        [NotMapped]
        public double? grand_total_rejected { get; set; }
    }

    public class SurveyorPerformanceByMonth
    {
        [NotMapped]
        public string? month { get; set; }
        [NotMapped]
        public int monthly_total_est_count { get; set; }
        [NotMapped]
        public double? monthly_total_est_cost { get; set; }
        [NotMapped]
        public double? monthly_total_appv_cost { get; set; }
        [NotMapped]
        public double? monthly_total_diff_cost { get; set; }
        [NotMapped]
        public double? monthly_total_average { get; set; }
        [NotMapped]
        public double? monthly_total_rejected { get; set; }
        [NotMapped]
        public List<SurveyorList>? SurveyorList { get; set; }
    }

    public class SurveyorList
    {
        [NotMapped]
        public string? surveyor_name { get; set; }
        [NotMapped]
        public int est_count { get; set; }
        [NotMapped]
        public double? est_cost { get; set; }
        [NotMapped]
        public double? appv_cost { get; set; }
        [NotMapped]
        public double? diff_cost { get; set; }
        [NotMapped]
        public double? average { get; set; }
        [NotMapped]
        public double? rejected { get; set; }
    }
}
