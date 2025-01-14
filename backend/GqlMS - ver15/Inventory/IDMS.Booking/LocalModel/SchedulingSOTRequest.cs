using System.ComponentModel.DataAnnotations.Schema;
using IDMS.Models;
using IDMS.Models.Inventory;

namespace IDMS.Booking.GqlTypes.LocaModel
{
    public class SchedulingSOTRequest : Dates
    {
        public string? guid { get; set; }
        public string? sot_guid { get; set; }
        public string? scheduling_guid { get; set; }
        public long? scheduling_dt { get; set; }
        public string? reference { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }

        [NotMapped]
        public string? action { get; set; }
        public storing_order_tank? storing_order_tank { get; set; }
        //public scheduling? scheduling { get; set; }
    }
}
