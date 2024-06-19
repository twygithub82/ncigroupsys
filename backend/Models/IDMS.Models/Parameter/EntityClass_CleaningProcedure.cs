using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{

    public class EntityClass_CleaningProcedure_Short
    {

        public string? guid { get; set; }

        public string? procedure_name { get; set; }

    }

    public class EntityClass_CleaningProcedure : EntityClass_CleaningProcedure_Short
    {

        public string? description { get; set; }

        public int? duration { get; set; }

        public string? category { get; set; }

        public string? clean_group_guid { get; set; }

        public long? update_dt { get; set; }


    }

    public class EntityClass_CleaningProcedureWithSteps : EntityClass_CleaningProcedure
    {

        public EntityClass_CleaningStepWithDuration?[]? CleaningSteps { get; set; }
    }


    public class EntityClass_CleaningProcedureWithStepsAndGroupShort : EntityClass_CleaningProcedureWithSteps
    {

        public EntityClass_CleaningGroup_Short? CleaningGroupShort { get; set; }
    }
}
