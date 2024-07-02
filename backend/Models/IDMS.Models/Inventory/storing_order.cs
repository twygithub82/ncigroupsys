using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class storing_order:EntityClass_Dates
    {
        [Key]
        public string guid { get; set; }

        public string? contact_person { get; set; }

        public string? status_cv { get; set; }

        public string? haulier { get; set; }

        public string? so_no { get; set; }

        public string? so_notes { get; set; }

        public string? customer_company_guid { get; set; }

        public IEnumerable<storing_order_tank>? storing_order_tank { get; set; }
    }
}
