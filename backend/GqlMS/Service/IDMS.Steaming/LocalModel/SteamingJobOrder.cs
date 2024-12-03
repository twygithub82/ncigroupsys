using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Steaming.GqlTypes.LocalModel
{
    public class SteamingRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? estimate_no { get; set; }
        public string remarks { get; set; }
        public string customer_guid { get; set; }
        public bool is_approved { get; set; } = false;
    }

    public class SteamJobOrderRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? remarks { get; set; }
        public List<job_order?>? job_order { get; set; }
    }

    public class SteamingStatusRequest
    {
        public string guid { get; set; }
        public string sot_guid { get; set; }
        public string? remarks { get; set; }
        public string action { get; set; }

    }
}
