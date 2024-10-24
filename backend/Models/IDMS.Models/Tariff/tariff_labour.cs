using IDMS.Models.Package;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_labour:Dates
    {
        [Key]
        public string guid { get; set; }

        public string? description { get; set; }

        public double? cost { get; set; }

        public string? remarks { get; set; }

        [UseFiltering]   
        public IEnumerable<package_labour?>? package_labour {  get; set; }
    }
}
