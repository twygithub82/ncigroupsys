using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class EntityClass_Dates
    {
        public long? delete_dt {  get; set; }
        public long? create_dt { get; set; }
       public long? update_dt { get; set; }

        public string? create_by {  get; set; }  
        public string? update_by { get; set; }
    }
}
