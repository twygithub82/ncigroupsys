using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Models.Parameter
{
    public class EntityClass_CleaningStep: EntityClass_Dates
    {
        [Key]
        public string guid { get; set; }

        public string? step_name { get; set; }
        public string? description { get; set; }
        public int? duration { get; set; } = 0;

        public IEnumerable<EntityClass_CleaningProcedureSteps>? clean_procedures {  get; set; }
    }


 
}
