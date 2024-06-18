using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.type
{
    public class CC_type : Base
    {
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

        public string phone { get; set; }
        public string fax { get; set; }
        public string email { get; set; }
        public string website { get; set; }
        public string currency { get; set; }
        public string default_profile { get; set; }
        public string person_in_charge { get; set; }
    }
}
