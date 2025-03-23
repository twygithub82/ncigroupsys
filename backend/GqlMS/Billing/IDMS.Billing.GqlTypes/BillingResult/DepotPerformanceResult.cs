using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    [NotMapped]
    public class DepotPerformanceResult
    {
        public int week_of_year { get; set; }
        public int cleaning_count {  get; set; }
        public int repair_count { get; set; }
        public int gate_in_count { get; set; }
        public int gate_out_count { get; set; }
        public int depot_count { get; set; }
        public int total_gate_count { get; set; }
        public int average_gate_count { get; set; }
    }

    [NotMapped]
    public class TempWeeklyData
    {
        public string? guid { get; set; }
        public long? date { get; set; }
        public string? type { get; set; }
    }

    [NotMapped]
    public class ResultPerWeek
    {
        public int count { get; set; }
        public int Week_Of_year { get; set; }
    }
}
