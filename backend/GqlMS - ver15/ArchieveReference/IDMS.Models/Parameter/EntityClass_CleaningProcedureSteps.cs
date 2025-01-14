using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public class EntityClass_CleaningProcedureSteps:EntityClass_Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? cleaning_procedure_guid { get; set; }

        public EntityClass_CleaningProcedureWithSteps? clean_procedure { get; set; }
        
        public string? cleaning_step_guid { get; set; }

        public EntityClass_CleaningStep? clean_step { get; set; }
    }
}
