using IDMS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes.LocalModel
{
    public class StoringOrderRequest : Dates
    {
        public string? guid { get; set; }
        public string customer_company_guid { get; set; }
        public string? status_cv { get; set; }
        public string? haulier { get; set; }
        public string? so_no { get; set; }
        public string? so_notes { get; set; }
        public string? remarks { get; set; }
    }
}
