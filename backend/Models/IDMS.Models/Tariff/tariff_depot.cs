using IDMS.Models.Inventory;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_depot : Dates
    {

        [Key]
        public string guid { get; set; }

        public string? profile_name { get; set; }

        public string? description { get; set; }

        public double? preinspection_cost { get; set; }
        public double? gate_in_cost { get; set; }
        public double? gate_out_cost { get; set; }

        public double? lolo_cost { get; set; }

        public double? storage_cost { get; set; }

        //public double? gate_charges { get; set; }

        public int? free_storage {  get; set; }

        public IEnumerable<tank?>? tanks { get; set; }

    }
}
