﻿using IDMS.Models.Master;
using IDMS.Models.Parameter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Package
{
    public class customer_company_cleaning_category:Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? customer_company_guid { get; set; }

       
        public string? cleaning_category_guid { get; set; }

       

        public double? initial_price { get; set; }

        public double? adjusted_price { get; set; }

        public string? remarks { get; set; }



    }

    public class customer_company_cleaning_category_with_customer_company: customer_company_cleaning_category
    {
        public customer_company? customer_company { get; set; }

        public cleaning_category? cleaning_category { get; set; }

    }
}