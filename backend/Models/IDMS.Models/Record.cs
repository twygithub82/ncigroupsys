using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    [NotMapped]
    public class Record
    {
        public int affected { get; set; }
        public List<string>? guid { get; set; }   
        public string? residue_guid { get; set; }
    }
}
