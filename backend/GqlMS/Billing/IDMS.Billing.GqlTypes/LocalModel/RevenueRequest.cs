
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    //[NotMapped]
    //public class DailyInventoryRequest: InventoryRequest
    //{
    //    public long start_date { get; set; }
    //    public long end_date { get; set; }
    //}

    [NotMapped]
    public class MonthlyRevenueRequest : InventoryRequest
    {
        public int month { get; set; }
        public int year { get; set; }
    }

    [NotMapped]
    public class YearlyRevenueRequest : InventoryRequest
    {
        public int start_month { get; set; }
        public int end_month { get; set; }
        public int year { get; set; }
        public string report_format_type { get; set; }
    }

    [NotMapped]
    public class RevenueRequest
    {
        public string revenue_type { get; set; }

        public string? customer_code { get; set; }
    }
}
