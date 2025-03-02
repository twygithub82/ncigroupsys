using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class PeriodicTestDueRequest
    {
        [NotMapped]
        public string? due_type { get; set; }
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? next_test_due { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
    }
}
