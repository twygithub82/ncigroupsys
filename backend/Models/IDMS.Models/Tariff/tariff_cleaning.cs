using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Inventory;
using IDMS.Models.Package;
using IDMS.Models.Parameter;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Tariff
{
    public class tariff_cleaning : Dates
    {
        [Key]
        public string guid { get; set; }
        public string? cargo { get; set; }
        public string? alias { get; set; }
        public string? description { get; set; }
        public string? remarks { get; set; }
        public string? un_no { get; set; }
        public string? class_cv { get; set; }

        [ForeignKey("cleaning_method")]
        public string? cleaning_method_guid { get; set; }

        [ForeignKey("cleaning_category")]
        public string? cleaning_category_guid { get; set; }
        public string? msds_guid { get; set; }
        public int? flash_point { get; set; }
        public string? in_gate_alert { get; set; }
        public string? depot_note { get; set; }
        public string? hazard_level_cv { get; set; }
        public string? ban_type_cv { get; set; }
        public string? nature_cv { get; set; }
        public string? open_on_gate_cv { get; set; }

        [UseFiltering]
        public cleaning_method? cleaning_method { get; set; }

        [UseFiltering]
        public cleaning_category? cleaning_category { get; set; }

        [UseFiltering]
        [GraphQLName("storing_order_tank")]
        public virtual IEnumerable<storing_order_tank>? sot { get; set; }

    }
}
