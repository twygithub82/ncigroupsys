using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class GateDetailRequest
    {
        public InGateDetail? InGateDetail { get; set; }
        public OutGateDetail? OutGateDetail { get; set; }
    }


    [NotMapped]
    public class InGateDetail
    {
        public StoringOrderTankInfo? SOT { get; set; }
        public OrderInfo? OrderInfo { get; set; }
        public GateInfo? GateInfo { get; set; }
    }


    [NotMapped]
    public class OutGateDetail
    {
        public StoringOrderTankInfo? SOT { get; set; }
        public OrderInfo? OrderInfo { get; set; }
        public GateInfo? GateInfo { get; set; }
    }

    [NotMapped]
    public class StoringOrderTankInfo
    {
        public string guid { get; set; }
        public string? job_no { get; set; }
        public string? release_job_no { get; set; }
    }
    [NotMapped]
    public class GateInfo
    {
        public string guid { get; set; }
        public string? vehicle_no { get; set; }
        public string? driver_name { get; set; }
        public string? remarks { get; set; }
    }

    [NotMapped]
    public class OrderInfo
    {
        public string guid { get; set; }
        public string? haulier { get; set; }
    }
}
