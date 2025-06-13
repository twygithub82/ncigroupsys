using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class TankInfoRequest
    {
        public StoringOrderTank? SOT { get; set; }
        public TankInfo? TankInfo { get; set; }
        
        public string action { get; set; }


    }
}
    