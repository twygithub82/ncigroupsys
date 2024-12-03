using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    public class ProcessJobOrder
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? remarks { get; set; }
        public List<job_order?>? job_order { get; set; }
    }
}
