using IDMS.Models.Package;
using IDMS.Models.Service;
using System.ComponentModel.DataAnnotations;

namespace IDMS.Models.Tariff
{
    public class tariff_steaming: Dates
    {
        [Key]
        public string guid { get; set; }
        public float? temp_min { get; set; }
        public float? temp_max { get; set; }
        public double? cost { get; set; }
        public double? labour { get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public IEnumerable<package_steaming?>? package_steaming { get; set; }

        [UseFiltering]
        public IEnumerable<steaming_part?>? steaming_part { get; set; }
    }
}
