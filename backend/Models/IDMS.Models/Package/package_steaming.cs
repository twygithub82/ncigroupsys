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
    public class package_steaming: Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("tariff_steaming")]
        public string? tariff_steaming_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        [ForeignKey("steaming_exclusive")]
        public string? steaming_exclusive_guid { get; set; }

        public double? cost { get; set; }
        public double? labour {  get; set; }
        public string? remarks { get; set; }

        [UseFiltering]
        public tariff_steaming? tariff_steaming { get; set; }

        [UseFiltering]
        public customer_company? customer_company { get; set; }

        [UseFiltering]
        public steaming_exclusive? steaming_exclusive { get; set; }
    }
}
