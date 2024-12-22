using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.ValueGeneration;
using IDMS.Models.Tariff;

namespace IDMS.Models.Shared
{
    public class tank_info : Dates
    {
        [Key]
        public string? guid { get; set; }
        public string? tank_no { get; set; }

        [ForeignKey("customer_company")]
        public string? owner_guid { get; set; }

        [ForeignKey("tank")]
        public string? unit_type_guid { get; set; }

        [ForeignKey("tariff_buffer")]
        public string? tank_comp_guid { get; set; }
        public string? manufacturer_cv { get; set; }
        public long? dom_dt { get; set; }
        public string? cladding_cv { get; set; }
        public string? max_weight_cv { get; set; }
        public string? height_cv { get; set; }
        public string? walkway_cv { get; set; }
        public int? capacity { get; set; }
        public int? tare_weight { get; set; }
        public string? last_test_cv { get; set; }
        public string? next_test_cv { get; set; }
        public long? test_dt { get; set; }
        public string? test_class_cv { get; set; }
        public long? last_notify_dt { get; set; }
        
        [UseFiltering]
        public tank? tank { get; set; }
        [UseFiltering]
        public customer_company? customer_company { get; set; }
        [UseFiltering]
        public tariff_buffer? tariff_buffer { get; set; }
    }
}
