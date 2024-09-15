using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class scheduling : Dates
    {
        [Key]
        [IsProjected(true)]
        public string? guid { get; set; }
        //public string? reference { get; set; }
        public string? status_cv { get; set; }
        public string? book_type_cv { get; set; }
        public string? remarks { get; set; }
        //public long? scheduling_dt { get; set; }
        public IEnumerable<scheduling_sot>? scheduling_sot { get; set; }

    }
}
