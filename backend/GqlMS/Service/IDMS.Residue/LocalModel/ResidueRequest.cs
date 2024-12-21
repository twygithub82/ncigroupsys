using IDMS.Models.Service;
using IDMS.Repair.GqlTypes.LocalModel;

namespace IDMS.Residue.GqlTypes.LocalModel
{
    public class ResidueRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? estimate_no { get; set; }
        public string remarks { get; set; }
        public string customer_guid { get; set; }
        public bool is_approved { get; set; } = false;

    }

    public class ResJobOrderRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? sot_status { get; set; }
        public string? estimate_no { get; set; }
        public string? remarks { get; set; }
        public List<job_order?>? job_order { get; set; }
    }

    public class ResidueStatusRequest
    {
        public string guid { get; set; }
        public string sot_guid { get; set; }
        public string? remarks { get; set; }
        public string action { get; set; }
        public List<ResiduePartRequest?>? residuePartRequests { get; set; }
    }

    public class ResiduePartRequest
    {
        public string guid { get; set; }
        public bool approve_part { get; set; }
    }
}
