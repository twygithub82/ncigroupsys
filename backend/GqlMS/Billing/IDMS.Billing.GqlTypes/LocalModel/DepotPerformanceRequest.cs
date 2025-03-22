using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    [NotMapped]
    public class DepotPerformanceRequest
    {
        public string? customer_code { get; set; }
        public int month {  get; set; }
        public int year { get; set; }
    }
}
