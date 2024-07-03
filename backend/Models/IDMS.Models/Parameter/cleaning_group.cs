using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter
{
    
   

    public class cleaning_group : Dates
    {
        [Key]
        public string? guid { get; set; }

        public string? group_name { get; set; }

        public string? description { get; set; }

        public string? category { get; set; }

        public float? minimum_cost { get; set; }

        public float? maximum_cost { get; set; }

        public string? remark { get; set; }


    }

    public class EntityClass_CleaningGroupWithCleanProcedure : cleaning_group
    {
        public IEnumerable<EntityClass_CleaningProcedureWithSteps>? clean_procedures { get; set; }
    }

}
