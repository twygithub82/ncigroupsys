using IDMS.Models.Master;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Package
{
    public class package_residue : Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("tariff_residue")]
        public string? tariff_residue_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }
        public double? cost { get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public tariff_residue? tariff_residue { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }
    }
}
