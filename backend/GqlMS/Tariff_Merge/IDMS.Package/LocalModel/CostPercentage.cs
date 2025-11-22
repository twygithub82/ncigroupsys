using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Package.GqlTypes.LocalModel
{
    [NotMapped]
    public class CostPercentage
    {
        public double? lolo_percentage { get; set; }
        public double? preinspect_percentage { get; set; }
        public double? gate_in_percentage { get; set; }
        public double? gate_out_percentage { get; set; }
        public double? storage_percentage { get; set; }
    }
}
