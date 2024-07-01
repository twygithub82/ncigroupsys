using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDMS.StoringOrder.Model.Domain.StoringOrder;

namespace IDMS.StoringOrder.Model.DTOs
{
    public class StoringOrdersDTO : storing_order
    {
        public IEnumerable<StoringOrderTankDTO> TankList { get; set; }
        public string customer_company_guid { get; set; }
        public CustomerCompanyDTO customer_company { get; set; }
       
        //public string? CodeDescription { get; set; }
        //public string? CodeValue { get; set; }
        //public string? CodeType { get; set; }
    }
}
