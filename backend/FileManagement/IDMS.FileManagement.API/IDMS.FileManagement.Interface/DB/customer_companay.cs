using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.DB
{
    public class customer_companay
    {
        [Key]
        public string? guid { get; set; }
        //public string? currency_guid { get; set; }
        public string? name { get; set; }
        public string? type_cv { get; set; }
        public string? code { get; set; }
        //public string? address_line1 { get; set; }
        //public string? address_line2 { get; set; }
        //public string? city { get; set; }
        //public string? country { get; set; }
        //public string? postal { get; set; }
        //public string? phone { get; set; }
        public string? country_code { get; set; }
        public string? email { get; set; }
        //public string? website { get; set; }
        //public long? effective_dt { get; set; }
        //public long? agreement_due_dt { get; set; }
        //public string? remarks { get; set; }
        public long? delete_dt { get; set; }
    }
}
