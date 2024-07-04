using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Request
{
    public class BookingRequest
    {
        public string? guid { get; set; }
        public string? sot_guid { get; set; }
        public string? surveyor_guid { get; set; }
        public string? report_guid { get; set; }
        public string? reference { get; set; }
        public string? mime_cv { get; set; }
        public string? book_type_cv { get; set; }
        public string? status_cv { get; set; }
        public long? booking_dt { get; set; }
        public long? clean_dt { get; set; }
        public long? repair_complete_dt { get; set; }
    }
}
