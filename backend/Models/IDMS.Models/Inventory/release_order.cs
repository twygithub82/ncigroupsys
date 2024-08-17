using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class release_order : Dates
    {
        [Key]
        [IsProjected(true)]
        public string guid { get; set; }
        public string? ro_no { get; set; }
        public string? ro_notes { get; set; }
        public string? haulier { get; set; }
        public string? remarks { get; set; }
        public string? status_cv { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }
        public bool? ro_generated { get; set; }
        public long? release_dt { get; set; }
        //public long? booking_dt { get; set; }
        public customer_company? customer_company { get; set; }
        //public IEnumerable<scheduling>? scheduling { get; set; }    
    }
}
