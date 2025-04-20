using IDMS.Models.Package;
using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_residue : Dates
    {
        [Key]
        public string guid { get; set; }

        public string? description { get; set; }

        public double? cost { get; set; }

        public string? remarks { get; set; }

        [UseFiltering]
        public IEnumerable<package_residue>? package_residue { get; set; }
        [UseFiltering]
        public IEnumerable<residue_part>? residue_part { get; set; }
    }
}
