using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class MonthlyProcessRequest
    {
        public string report_type { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public string? customer_code { get; set; }
    }

    public class YearlyProcessRequest
    {
        public string report_type { get; set; }
        public int year { get; set; }
        public int start_month { get; set; }
        public int end_month { get; set; }  
        public string? customer_code { get; set; }
    }

    public class MonthlySalesRequest
    {
        public List<string> report_type { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public string? customer_code { get; set; }
    }

    public class YearlySalesRequest
    {
        public List<string> report_type { get; set; }
        public int year { get; set; }
        public int start_month { get; set; }
        public int end_month { get; set; }
        public string? customer_code { get; set; }
    }

    public class CustomerMonthlySalesRequest
    {
        public int year { get; set; }
        public int month { get; set; }
        public string? customer_code { get; set; }
    }

}
