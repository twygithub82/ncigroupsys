using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class EntityClass_CleaningProcedure
    {

        public string guid { get; set; }

        public string? procedure_name {  get; set; }

        public string? description {  get; set; }

        public int? duration { get; set; }

        public string? category { get; set; }

        public string? clear_group_guid {  get; set; }

        public long? update_dt { get; set; }


    }
}
