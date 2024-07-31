using IDMS.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model.Request
{
    public class ReleaseOrderRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? ro_no { get; set; }
        public string? ro_notes { get; set; }
        public string? haulier { get; set; }
        public string? remarks { get; set; }
        public string? status_cv { get; set; }
        public long? release_dt { get; set; }
            //public int? running_number {  get; set; }   
    }
}
