using IDMS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model.Request
{
    public class ReleaseOrderRequest : Dates
    {
        public string? guid { get; set; }
        public string? ro_no { get; set; }
        public string? ro_notes { get; set; }
        public string? haulier { get; set; }
        public string? remarks { get; set; }
        public string? status_cv { get; set; }
        public string? customer_company_guid { get; set; }
        public bool? ro_generated { get; set; }
        public long? booking_dt { get; set; }
        public long? release_dt { get; set; }
        List<SchedulingRequest>? schedulings { get; set; }
    }
}
