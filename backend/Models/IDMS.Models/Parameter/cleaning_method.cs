using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public class cleaning_method : Dates
    {
        [Key]
        [IsProjected(true)]
        public string? guid { get; set; }

        [ForeignKey("cleaning_category")]
        public string? category_guid { get; set; }
        public string? name { get; set; }
        public int? sequence { get; set; }
        public string? description { get; set; }
        [UseFiltering]
        public IEnumerable<tariff_cleaning>? tariff_cleanings { get; set; }
        [UseFiltering]
        public IEnumerable<cleaning_method_formula?>? cleaning_method_formula { get; set; }
        [UseFiltering]
        public cleaning_category? cleaning_category { get; set; }     

    }
}
