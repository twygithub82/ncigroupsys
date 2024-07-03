using IDMS.Models.Package;
using IDMS.Models.Parameter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_cleaning:EntityClass_Dates
    {
        [Key]
        public string guid {  get; set; }

        public string? cargo {  get; set; }

        public string? alias {  get; set; }

        public string? description { get; set; }

        public string? remarks {  get; set; }

        public string? un_no { get; set; }

        public string? cleaning_method_guid { get; set; }

        public string? cleaning_category_guid { get; set; }
        public int? flash_point {  get; set; }
        
        public string? in_gate_alert { get; set; }

        public string? depot_note { get; set; }

        //public double? cost { get; set; }

        //public string? cost_type_cv { get; set; }

        public string? class_cv { get; set; }

        public string? class_child_cv { get; set; }
        public string? hazard_level_cv {  get; set; }

        public string? ban_type_cv { get; set; }

        public string? nature_cv { get; set; }

        public string? open_on_gate_cv { get; set; }

        //public string? rebate_type_cv { get; set; }
        public EntityClass_CleaningMethodWithTariff? cleaning_method { get; set; }

        public EntityClass_CleaningCategoryWithTariff? cleaning_category { get; set; }


    }

    

}
