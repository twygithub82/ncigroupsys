using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    

    public class EntityClass_CleaningGroup : EntityClass_Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? group_name { get; set; }

        public string? description { get; set; }

        public float? minimum_cost { get; set; }

        public float? maximum_cost { get; set; }

        public string? remark { get; set; }


    }

    public class EntityClass_CleaningGroupWithCleanProcedure : EntityClass_CleaningGroup
    {
        public IEnumerable<EntityClass_CleaningProcedure>? clean_procedures { get; set; }
    }

}
