using IDMS.Models;
using IDMS.Models.Inventory;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace IDMS.Booking.Model.Request
{
    public class SchedulingRequest : Dates
    {
        public string? guid { get; set; }
        public string? reference { get; set; }
        public string? status_cv { get; set; }
        public string? book_type_cv { get; set; }
        public long? scheduling_dt { get; set; }

        [NotMapped]
        public string? action { get; set; }
        //public string sot_guid { get; set; }
        //public storing_order_tank? storing_order_tank { get; set; } 
        //public string? release_order_guid { get; set; }
    }
}
