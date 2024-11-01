using IDMS.Models.Master;
using IDMS.Models.Parameter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Package
{
    public class EntityClass_CustomerCompany_CleaningCategory:EntityClass_Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? customer_company_guid { get; set; }

       


        public string? cleaning_category_guid { get; set; }

       

        public double? initial_price { get; set; }

        public double? adjusted_price { get; set; }

        public string? remarks { get; set; }



    }

    public class EntityClass_CustomerCompany_CleaningCategoryWithCustomerCompany: EntityClass_CustomerCompany_CleaningCategory
    {
        public EntityClass_CustomerCompany? customer_company { get; set; }

        public EntityClass_CleaningCategory? cleaning_category { get; set; }

    }
}
