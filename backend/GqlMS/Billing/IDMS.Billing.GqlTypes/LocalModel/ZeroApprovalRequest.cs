
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class ZeroApprovalRequest
    {
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public int year { get; set; }
        [NotMapped]
        public int month { get; set; }
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public string report_type { get; set; }
        [NotMapped]
        public string? tank_status { get; set; }
    }
}
