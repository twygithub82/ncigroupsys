using HotChocolate;
using HotChocolate.Data;

namespace IDMS.Models.Inventory
{

    public class in_gate:EntityClass_Dates
    {
        public string guid { get; set; } = "";
        [IsProjected(true)] 
        public string? so_tank_guid { get; set; } = "";

        public string? haulier { get; set; } = "";
        public string? eir_no { get; set; } = "";
        public string? vehicle_no { get; set; } = "";
        public string? yard_cv { get; set; } = "";
        public string? driver_name { get; set; } = "";
        public string? lolo_cv { get; set; } = "";
        public string? preinspection_cv { get; set; } = "";
        public string? eir_doc { get; set; } = "";

        public long? eir_date { get; set; }

       // public EntityClass_Tank? tank { get; set; } = null;

    }

    public class EntityClass_InGateWithTank : in_gate
    {
        public storing_order_tank? tank { get; set; } = null;
    }


  


}
