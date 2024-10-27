
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Service
{
    public class job_order : Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("storing_order_tank")]
        public string? sot_guid { get; set; }

        [ForeignKey("team")]
        public string? team_guid { get; set; }
        public string? job_order_no { get; set; }
        public double? working_hour { get; set; }
        public double? total_hour { get; set; }
        public string? job_type_cv { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }   
        public long? start_dt { get; set; }
        public long? complete_dt { get; set; }

        [UseFiltering]
        public storing_order_tank? storing_order_tank { get; set; }

        [UseFiltering]
        public team? team { get; set; }
        
        [UseFiltering]
        public IEnumerable<time_table?>? time_table { get; set; }

        [UseFiltering]
        public IEnumerable<repair_part?>? repair_part {  get; set; }

        [UseFiltering]
        public IEnumerable<residue_part?>? residue_part { get; set; }

        [UseFiltering]
        public IEnumerable<cleaning?>? in_gate_cleaning { get; set; }
    }
}
