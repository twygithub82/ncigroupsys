using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Service;
using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Repair.GqlTypes.LocalModel
{
    public class RepairEstimateRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? estimate_no { get; set; }
        public string remarks { get; set; }
        public string customer_guid { get; set; }
    }
}
