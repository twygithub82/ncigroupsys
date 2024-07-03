using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public  class cleaning_method:Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? name { get; set; }

        public string? description { get; set; }

        // public int? duration { get; set; }

        // public string? cleaning_group_cv { get; set; }

        // public double? cost { get; set; }

        
    }

    public class CleaningMethodWithTariff: Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? name { get; set; }

        public string? description { get; set; }

        public IEnumerable<tariff_cleaning>? tariff_cleanings { get; set; }
    }
}
