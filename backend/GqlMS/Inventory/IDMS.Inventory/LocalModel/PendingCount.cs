using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class PendingProcessCount
    {
        public int Pending_Cleaning_Count { get; set; } = 0;
        public int Pending_Residue_Count { get; set; } = 0;
        public int Pending_Steaming_Count { get; set; } = 0;
        public int Pending_Estimate_Count { get; set; } = 0;
    }
}
