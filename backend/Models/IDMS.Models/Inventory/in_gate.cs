using HotChocolate;
using HotChocolate.Data;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Inventory
{

    public class in_gate:Dates
    {
        [Key]
        public string? guid { get; set; } = "";
        [IsProjected(true)]

        [ForeignKey("tank")]
        public string? so_tank_guid { get; set; } = "";
        public string? haulier { get; set; } = "";
        public string? eir_no { get; set; } = "";
        public string? eir_status_cv { get; set; } = "";
        public string? vehicle_no { get; set; } = "";
        public string? yard_cv { get; set; } = "";
        public string? driver_name { get; set; } = "";
        public string? lolo_cv { get; set; } = "";
        public string? preinspection_cv { get; set; } = "";
        //public string? eir_doc { get; set; } = "";
        public long? eir_dt { get; set; }

        public string? remarks { get; set; }
        //public storing_order_tank? tank { get; set; } = null;

    }

    public class InGateWithTank : in_gate
    {
        public storing_order_tank? tank { get; set; } = null;
    }

}
