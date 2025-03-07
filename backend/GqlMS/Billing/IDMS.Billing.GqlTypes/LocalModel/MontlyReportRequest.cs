using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class MontlyReportRequest
    {
        public string report_type { get; set; }
        public int year { get; set; }
        public int month { get; set; }
        public string? customer_code { get; set; }
    }
}
