using HotChocolate;
using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGateSurvey.Model.Request
{
    public class InGateWithTankRequest
    {
        public string? guid { get; set; }
        public string? so_tank_guid { get; set; }
        public string? haulier { get; set; }
        public string? eir_no { get; set; }
        public string? eir_status_cv { get; set; }
        public string? vehicle_no { get; set; }
        public string? yard_cv { get; set; }
        public string? driver_name { get; set; }
        public string? lolo_cv { get; set; }
        public string? preinspection_cv { get; set; }
        public long? eir_dt { get; set; }
        public string? remarks { get; set; }
        public storing_order_tank? tank { get; set; }
        public in_gate_survey? in_gate_survey { get; set; }
    }
}
