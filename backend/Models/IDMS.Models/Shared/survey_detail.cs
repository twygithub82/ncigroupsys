using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class survey_detail: Dates
    {
        [Key]
        public string? guid {  get; set; }

        [ForeignKey("customer_company")]
        public string customer_company_guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string sot_guid {  get; set; }
        public string status_cv { get; set; }
        public string survey_type_cv { get; set; }
        public string? remarks { get; set; }
        public long survey_dt { get; set; }

        public customer_company? customer_company { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
    }
}
