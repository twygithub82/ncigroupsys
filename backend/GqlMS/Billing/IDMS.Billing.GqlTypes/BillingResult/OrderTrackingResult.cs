using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class OrderTrackingResult
    {
        public string? tank_no { get; set; }
        public string? eir_no { get; set; }
        public long? eir_date { get; set; }
        public long? release_date { get; set; }
        public string? customer_code { get; set; }
        public string? customer_name { get; set; }
        public string? last_cargo { get; set; }
        public string? order_no { get; set; }
        public long? order_date { get; set; }
        public long? cancel_date { get; set; }
        public string? cancel_remarks { get; set; }
        public string? status { get; set; }
        public bool? purpose_storage { get; set; }
        public bool? purpose_cleaning { get; set; }
        public bool? purpose_steaming { get; set; }
        public string? purpose_repair { get; set; }
    }
}
