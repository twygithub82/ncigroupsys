using IDMS.Models.Package;
using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class steaming_exclusive: Dates
    {
        [Key]
        public string guid {  get; set; }

        [ForeignKey("tariff_cleaning")]
        public string tariff_cleaning_guid { get; set; }
        public float? temp_min { get; set; }
        public float? temp_max { get; set; }
        public string? remarks { get; set; }
        public double? labour { get; set; }

        [UseFiltering]
        public tariff_cleaning? tariff_cleaning {  get; set; }

        [UseFiltering]
        public IEnumerable<steaming_part?>? steaming_part {  get; set; }

        [UseFiltering]
        public virtual package_steaming? package_steaming { get; set; }
    }
}
