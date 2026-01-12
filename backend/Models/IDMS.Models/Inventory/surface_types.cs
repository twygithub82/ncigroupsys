using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class surface_types: Dates
    {
        [Key]
        public string? guid { get; set; }

        [ForeignKey("inspection")]
        public string? inspection_guid { get; set; }
        
        public string? type_cv { get; set; }
        public string? remarks { get; set; }
        public double? value { get; set; }
        public inspections? inspection { get; set; }
    }
}
