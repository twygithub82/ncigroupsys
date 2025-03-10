using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Parameter
{
    public class cleaning_method_formula : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("cleaning_method")]
        public string? method_guid { get; set; }

        [ForeignKey("cleaning_formula")]
        public string? formula_guid { get; set; }
        public int? sequence { get; set; }
        [UseFiltering]
        public cleaning_method? cleaning_method { get; set; }
        [UseFiltering]
        public cleaning_formula? cleaning_formula { get; set; }
        [NotMapped]
        public string? action { get; set; } 
    }
}
