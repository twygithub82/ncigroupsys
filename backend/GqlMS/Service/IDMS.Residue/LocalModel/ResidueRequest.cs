using IDMS.Models.Service;

namespace IDMS.Residue.GqlTypes.LocalModel
{
    public class ResidueRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? estimate_no { get; set; }
        public string remarks { get; set; }
        public string customer_guid { get; set; }
    }

    public class ResJobOrderRequest
    {
        public string guid { get; set; }
        public string? sot_guid { get; set; }
        public string? estimate_no { get; set; }
        public string? remarks { get; set; }
        public List<job_order?>? job_order { get; set; }
    }
}
