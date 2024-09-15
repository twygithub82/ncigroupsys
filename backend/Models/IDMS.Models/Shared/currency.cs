using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class currency : Dates
    {

        [Key]
        [IsProjected]
        public string? guid { get; set; }
        public string? currency_code {get; set; }   
        public string? currency_name { get; set; }
        public double? rate { get; set; }
        public int? sequence { get; set; }
        public bool? is_active { get; set; }

        public IEnumerable<customer_company?>? customer_company {  get; set; }  
    }
}
