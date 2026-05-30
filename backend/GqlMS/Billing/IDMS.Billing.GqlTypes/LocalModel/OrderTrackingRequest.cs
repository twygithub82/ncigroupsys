using IDMS.Billing.GqlTypes.BillingResult;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    [NotMapped]
    public class OrderTrackingRequest
    {
        public string order_type { get; set; }  
        public string? tank_no { get; set; }
        public string? customer_code { get; set; }
        public string? last_cargo { get; set; }
        public string? so_no { get; set; }
        public string? ro_no { get; set; }
        public string? eir_no { get; set; }
        public string? job_no { get; set; }
        public long start_date { get; set; }
        public long end_date { get; set; }
        public List<string?>? purpose { get; set; }
        public List<string?>? status { get; set; }
    }

    [NotMapped]
    public class OrderTrackingSummary
    {
        public string? order_no { get; set; }
        public long? order_date { get; set; }
        public string? order_status { get; set; }
        public string? customer { get; set; }
        public int? count { get; set; }
        public List<OrderTrackingResult?>? tanks { get; set; }
    }
}
