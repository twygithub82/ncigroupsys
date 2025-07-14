using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.StoringOrder.GqlTypes.LocalModel
{
    [NotMapped]
    public class SOTNotification
    {
        public int? Pending_Ingate_Count { get; set; }
        public int? Pending_IngateSurvey_Count { get; set; }
        public int? Pending_Cleaning_Count { get; set; }
        public int? Pending_Residue_Count { get; set; }
        public int? Pending_Steaming_Count { get; set; }
        public int? Pending_Repair_Count { get; set; }
        //public long? stop_time { get; set; }
        //public long? complete_dt { get; set; }
    }
}
