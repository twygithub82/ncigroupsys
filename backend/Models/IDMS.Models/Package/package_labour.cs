using IDMS.Models.Master;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Package
{
    public class package_labour : Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("tariff_labour")]
        public string? tariff_labour_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        public double? cost { get; set; }

        public string? remarks { get; set; }

        public virtual tariff_labour? tariff_labour { get; set; }
        public virtual customer_company? customer_company { get; set; }
    }
}
