using IDMS.Models.Inventory;
using IDMS.Models.Package;
using System.ComponentModel.DataAnnotations;

namespace IDMS.Models.Tariff
{
    public class tariff_buffer :Dates
    {
        [Key]
        public string guid { get; set; }
        public string? buffer_type { get; set; }
        public double? cost { get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public IEnumerable<package_buffer?>? package_buffer { get; set; }

        [UseFiltering]
        public IEnumerable<in_gate_survey?>? in_gate_survey { get; set; }
    }
}
