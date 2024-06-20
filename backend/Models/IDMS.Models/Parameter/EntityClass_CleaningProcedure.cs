using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{

   

    public class EntityClass_CleaningProcedure : EntityClass_Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? procedure_name { get; set; }

        public string? description { get; set; }

        public int? duration { get; set; }

        public string? category { get; set; }

        public long? update_dt { get; set; }

        public string? clean_group_guid { get; set; }
        public EntityClass_CleaningGroupWithCleanProcedure clean_group { get; set; }
    }

    public class EntityClass_CleaningProcedureWithSteps : EntityClass_CleaningProcedure
    {

        public IEnumerable<EntityClass_CleaningProcedureSteps>? clean_steps { get; set; }
    }


    //public class EntityClass_CleaningProcedureWithStepsAndGroupShort : EntityClass_CleaningProcedureWithSteps
    //{

    //    public EntityClass_CleaningGroup_Short? clean_group_short { get; set; }
    //}
}
