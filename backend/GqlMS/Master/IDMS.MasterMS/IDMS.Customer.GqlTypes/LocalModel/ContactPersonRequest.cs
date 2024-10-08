using IDMS.Models;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Customer.GqlTypes.LocalModel
{
    public class ContactPersonRequest: Dates
    {
        public string? guid { get; set; }
        public string? customer_guid { get; set; }
        public string? name { get; set; }
        public string? title_cv { get; set; }
        public string? job_title { get; set; }
        public string? email { get; set; }
        public string? department { get; set; }
        public string? did { get; set; }
        public string? phone { get; set; }
        public int? email_alert { get; set; } = 0;
        public string? action { get; set; } 
    }
}
