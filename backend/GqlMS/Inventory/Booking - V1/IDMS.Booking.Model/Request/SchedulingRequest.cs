using IDMS.Models;
using IDMS.Models.Inventory;

namespace IDMS.Booking.Model.Request
{
    public class SchedulingRequest : Dates
    {
        public string? guid { get; set; }
        public storing_order_tank? storing_order_tank { get; set; } 
        public string? release_order_guid { get; set; }
        public string? status_cv { get; set; }
        public string? reference { get; set; }
    }
}
