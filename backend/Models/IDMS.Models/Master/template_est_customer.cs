using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Master
{
    public class template_est_customer : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("template_est")]
        public string? template_est_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        [NotMapped]
        public string? action { get; set; }

        public template_est? template_est { get; set; }
        public customer_company? customer_company { get; set; }
    }
}
