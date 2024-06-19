using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    public class EntityClass_CleaningGroup_Short
    {
        public string? guid { get; set; }

        public string? group_name { get; set; }

    }

    public class EntityClass_CleaningGroup : EntityClass_CleaningGroup_Short
    {

        public string? description { get; set; }

        public float? minimum_cost { get; set; }

        public float? maximum_cost { get; set; }

        public string? remark { get; set; }


    }

    public class EntityClass_CleaningGroupWithCleanProcedureShort : EntityClass_CleaningGroup
    {
        public EntityClass_CleaningProcedure_Short?[]? CleanProcedures { get; set; }
    }

}
