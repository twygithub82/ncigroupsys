
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Service
{
    public class steaming_temp: Dates
    {
        [Key]
        public string? guid {  get; set; }

        [ForeignKey("job_order")]
        public string? job_order_guid { get; set; }
        public double? meter_temp { get; set; }
        public double? top_temp { get; set; }
        public double? bottom_temp { get; set; }
        public string? remarks {  get; set; }
        public job_order? job_order { get; set; }

     }
}
