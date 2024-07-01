using IDMS.StoringOrder.Model.DTOs;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Domain
{
    public class StoringOrderRequest : Base
    {
        public string? guid { get; set; }
        public string? customer_company_guid { get; set; }
        public string? status_cv { get; set; }
        public string? haulier { get; set; }
        public string? so_no { get; set; }
        public string? so_notes { get; set; }
        public string? remarks { get; set; }

        //public customer_company customer_company { get; set; }

        //public IEnumerable<storing_order_tank>? storing_order_tank { get; set; }
    }
}
