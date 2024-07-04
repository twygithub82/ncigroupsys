using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Domain
{
    public class customer_company : Base
    {
        [Key]
        public string? guid { get; set; }
        public string name { get; set; }
        public string code { get; set; }
        public string description { get; set; }
        public string alias { get; set; }
        public string address_line1 { get; set; }
        public string address_line2 { get; set; }

        public string city { get; set; }
        public string country { get; set; }
        public string postal { get; set; }
        public string? type_cv { get; set; }

        public string phone { get; set; }
        public string fax { get; set; }
        public string email { get; set; }
        public string website { get; set; }
        public string currency { get; set; }
        public string default_profile { get; set; }
        //public string person_in_charge { get; set; }

        public IEnumerable<storing_order>? storing_orders { get; set; }

        public IEnumerable<customer_company_contact_person>? cc_contact_person { get; set; }
    }
}
