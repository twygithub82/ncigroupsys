using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Record
    {
        [NotMapped]
        public int affected { get; set; }
        [NotMapped]
        public List<string> guid { get; set; }   
    }
}
