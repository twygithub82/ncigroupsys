using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class TankSummaryRequest
    {
        public StoringOrderTank? SOT { get; set; }
        public StoringOrder? SO { get; set; }
        public InGate? Ingate { get; set; }
        public InGateSurvey? IngateSurvey { get; set; }
        public TankInfo? TankInfo { get; set; }
    }

    [NotMapped]
    public class StoringOrderTank
    {
        public string guid { get; set; }
        public string? owner_guid { get; set; }
        public string? unit_type_guid { get; set; } 
        public string? tank_no { get; set; }
    }

    [NotMapped]
    public class StoringOrder
    {
        public string guid { get; set; }
        public string? customer_company_guid { get; set; }
    }

    [NotMapped]
    public class InGate
    {
        public string guid { get; set; }
        public string? yard_cv { get; set; }
    }

    [NotMapped]
    public class InGateSurvey
    {
        public string guid { get; set; }
        public string? last_test_cv { get; set; }
        public string? next_test_cv { get; set; }
        public long? test_dt { get; set; }
        public string? test_class_cv { get; set; }

        public int? tare_weight { get; set; }
        public string? cladding_cv { get; set; }
        public string? btm_dis_comp_cv { get; set; }
        public string? manufacturer_cv { get; set; }
        public long? dom_dt { get; set; }   
        public int? capacity { get; set; }
        public string? max_weight_cv { get; set; }
        public string? walkway_cv { get; set; }
        public string? tank_comp_guid { get; set; } 
    }

    [NotMapped]
    public class TankInfo
    {
        public string guid { get; set; }
        public string tank_no { get; set; }
        public string? owner_guid { get; set; }
        public string? last_test_cv { get; set; }
        public string? next_test_cv { get; set; }
        public long? test_dt { get; set; }
        public string? test_class_cv { get; set; }
        public string? yard_cv { get; set; }
    }
}
