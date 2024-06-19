using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Parameter
{
    public class EntityClass_CleaningStep
    {
        public string guid { get; set; }

        public string? step_name { get; set; }
        public string? description { get; set; }
        public long? update_dt { get; set; }


    }

    public class EntityClass_CleaningStepWithDuration : EntityClass_CleaningStep
    {
        public int? duration { get; set; } = 0;



    }

 
}
