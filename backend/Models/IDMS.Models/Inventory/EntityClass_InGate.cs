using HotChocolate;

namespace IDMS.Models.Inventory
{

    public class EntityClass_InGate:EntityClass_Dates
    {
        public string guid { get; set; } = "";
        public string? so_tank_guid { get; set; } = "";

        public string? haulier { get; set; } = "";
        public string? eir_no { get; set; } = "";
        public string? vehicle_no { get; set; } = "";
        public string? yard_guid { get; set; } = "";
        public string? driver_name { get; set; } = "";
        public string? LOLO { get; set; } = "";
        public string? preinspection { get; set; } = "";
        public string? eir_doc { get; set; } = "";

        public long? eir_dt { get; set; }

       // public EntityClass_Tank? tank { get; set; } = null;

    }

    public class EntityClass_InGateWithTank : EntityClass_InGate
    {
        public EntityClass_Tank? tank { get; set; } = null;
    }


  


}
