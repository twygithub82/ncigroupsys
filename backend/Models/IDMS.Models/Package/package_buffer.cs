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
    public class package_buffer : Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("tariff_buffer")]
        public string? tariff_buffer_guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        public double? cost { get; set; }

        public string? remarks { get; set; }

        public tariff_buffer? tariff_buffer { get; set; }
        public customer_company? customer_company { get; set; }
    }
}
