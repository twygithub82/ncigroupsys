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
    public class package_depot:Dates
    {
        [Key]
        public string guid { get; set; }

        [ForeignKey("customer_company")]
        public string? customer_company_guid { get; set; }

        [ForeignKey("tariff_depot")]
        public string? tariff_depot_guid {  get; set; }

        public string? remarks { get; set; }

        public double? preinspection_cost { get; set; }

        public double? lolo_cost { get; set; }

        public double? storage_cost { get; set; }

        //public double? gate_charges { get; set; }

        public int? free_storage { get; set; }

        public string? storage_cal_cv { get; set; }

        public tariff_depot? tariff_depot { get; set; }
        public customer_company? customer_company { get; set; }
    }
}
