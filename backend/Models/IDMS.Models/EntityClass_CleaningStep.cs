using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class EntityClass_CleaningStep
    {
        public string guid { get; set; }

        public string? step_name { get; set; }
        public string? description { get; set; }
        public long? update_dt { get; set; }

       
    }
}
