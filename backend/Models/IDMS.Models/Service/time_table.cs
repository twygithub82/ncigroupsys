
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Service
{
    public class time_table : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("job_order")]
        public string? job_order_guid { get; set; }
        public long? start_time { get; set; }
        public long? stop_time { get; set; }

        public job_order? job_order {  get; set; } 
    }
}
