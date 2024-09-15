using IDMS.Models;
using IDMS.Models.Inventory;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace IDMS.Booking.GqlTypes.LocaModel
{
    public class SchedulingRequest : Dates
    {
        public string? guid { get; set; }
        //public string? reference { get; set; }
        public string? status_cv { get; set; }
        public string? book_type_cv { get; set; }
        public string? remarks { get; set; }
        //public long? scheduling_dt { get; set; }

        [NotMapped]
        public string? action { get; set; }
    }
}
