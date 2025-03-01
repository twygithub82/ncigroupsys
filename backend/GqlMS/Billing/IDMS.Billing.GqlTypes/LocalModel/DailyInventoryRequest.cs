using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class DailyInventoryRequest
    {
        [NotMapped]
        public string inventory_type { get; set; }
        [NotMapped]
        public long start_date { get; set; }
        [NotMapped]
        public long end_date { get; set; }
        [NotMapped]
        public string? customer_code { get; set; }
        //[NotMapped]
        //public string? last_cargo { get; set; }
        //[NotMapped]
        //public string? un_no { get; set; }
        //[NotMapped]
        //public List<string?>? class_no { get; set; }
        //[NotMapped]
        //public string? tank_no { get; set; }
        //[NotMapped]
        //public string? eir_no { get; set; }
    }
}
