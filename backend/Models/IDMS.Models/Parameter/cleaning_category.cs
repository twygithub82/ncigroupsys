using IDMS.Models.Master;
using IDMS.Models.Package;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public class cleaning_category:Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? name { get; set; }

        public string? description { get; set; }

        public int? sequence { get; set; }

        // public int? duration { get; set; }

        // public string? cleaning_group_cv { get; set; }

         public double? cost { get; set; }

     
    }

    public class CleaningCategoryWithTariff: Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? name { get; set; }

        public string? description { get; set; }

        // public int? duration { get; set; }

        // public string? cleaning_group_cv { get; set; }

        public double? cost { get; set; }

        public IEnumerable<tariff_cleaning>? tariff_cleanings { get; set; }
    }

    public class EntityClass_CleaningCategoryWithCustomerCompanyAndCleaningCategory: cleaning_category
    {
        public IEnumerable<customer_company>? customer_companies { get; set; }

        public IEnumerable<customer_company_cleaning_category>? customer_company_cleaning_categories { get; set; }
    }

}
