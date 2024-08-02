using IDMS.Models;

namespace IDMS.Booking.Model.Request
{
    public class BookingRequest: Dates
    {
        public string? guid { get; set; }
        public List<string> sot_guid { get; set; } = new List<string>();    
        public string? surveyor_guid { get; set; }
        public string? reference { get; set; }
        public string book_type_cv { get; set; }
        public string? status_cv { get; set; }
        public long booking_dt { get; set; }
        public long? action_dt { get; set; }

    }
}
