using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class survey_detail: Dates
    {
        [Key]
        public string? guid {  get; set; }
        public string? customer_company_guid { get; set; }
        public string? sot_guid {  get; set; }
        public string? status_cv { get; set; }
        public string? survey_type { get; set; }
        public string? remarks { get; set; }
        public long? survey_dt { get; set; }

        public customer_company? customer_company { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
    }
}
