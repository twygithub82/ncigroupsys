﻿using IDMS.Models.Master;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Models.Package
{
    //[PrimaryKey("tariff_repair_guid", "customer_company_guid")]
    public class package_repair : Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("tariff_repair")]
        public string? tariff_repair_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        public double? material_cost { get; set; }

        public double? labour_hour { get; set; }

        public string? remarks { get; set; }

        public virtual tariff_repair? tariff_repair { get; set; }

        [UseFiltering]
        public virtual customer_company? customer_company { get; set; }
    }
}
