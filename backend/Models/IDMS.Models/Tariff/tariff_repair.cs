using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_repair :Dates
    {
        [Key]
        public string guid { get; set; }

        public string? group_name_cv { get; set; }
        public string? subgroup_name_cv { get; set; }
       // public string? test_type_cv { get; set; }
        public string? part_name { get; set; }
        public double? dimension { get; set; }
       // public string? dimension_unit_cv { get; set; }
        public double? width_diameter { get; set; }
      //  public string? width_diameter_unit_cv { get; set; }
        public double? thickness { get; set; }
      //  public string? thickness_unit_cv { get; set; }
        public double? length { get; set; }
        public string? length_unit_cv { get; set; }
        public double? labour_hour { get; set; }
       // public string? cost_type_cv { get; set; }
       // public string? rebate_type_cv { get; set; }
       // public string? job_type_cv { get; set; }
        public double? material_cost { get; set; }
        public string? remarks { get; set; }
    }
}
