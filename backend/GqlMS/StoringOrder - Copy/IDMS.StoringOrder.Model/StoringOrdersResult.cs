using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model
{
    public class StoringOrdersResult: StoringOder
    {
        public List<StoringOrderTank>? TankList { get; set; } = new();
        public CustomerCompany? CustomerCompany { get; set; } = new();
        
        //public string? CodeDescription {  get; set; }
        //public string? CodeValue { get; set; }
        //public string? CodeType { get; set; }

    }
}
