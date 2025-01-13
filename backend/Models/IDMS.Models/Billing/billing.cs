using IDMS.Models.Master;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Billing
{
    public class billing: Dates
    {
        [Key]
        public string? guid {  get; set; }

        [ForeignKey("currency")]
        public string currency_guid { get; set; }

        [ForeignKey("customer_company")]
        public string bill_to_guid { get; set; }
        public string invoice_no { get; set; }
        public long invoice_dt { get; set; }
        public long? invoice_due { get; set; }
        public string status_cv { get; set; }
        public string? remarks { get; set; }
        public currency? currency { get; set; }
        [UseFiltering]
        public customer_company? customer_company { get; set; }
        
        //[UseFiltering]
        //public billing_sot? billing_sot { get; set; }
    }
}
