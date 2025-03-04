using System.ComponentModel.DataAnnotations;

namespace IDMS.Models.Parameter
{
    public class cleaning_formula : Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? description { get; set; }

        public double? duration { get; set; }
        [UseFiltering]
        public IEnumerable<cleaning_method_formula?>? cleaning_method_formula { get; set; }
    }
}
