using IDMS.Models;
using IDMS.Models.Inventory;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Booking.GqlTypes.LocaModel
{
    public class ReleaseOrderSOTRequest : Dates
    {
        public string? guid { get; set; }
        public string? ro_guid { get; set; }
        public string? sot_guid { get; set; }
        public string? status_cv { get; set; }
        public string? remarks {  get; set; }

        [NotMapped]
        public string? action { get; set; }
        public storing_order_tank storing_order_tank { get; set; }
        //public release_order? release_order { get; set; }
    }
}
