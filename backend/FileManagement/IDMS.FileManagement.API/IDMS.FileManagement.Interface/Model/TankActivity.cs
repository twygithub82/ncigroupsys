using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.Model
{
    public class TankActivity
    {
        public string SN { get; set; }
        public string TankNo { get; set; }
        public string InDate { get; set; }
        public string TakeInRef { get; set; }
        public string Capacity { get; set; }
        public string TareWeight { get; set; }
        public string LastCargo { get; set; }
        public string CleanDate { get; set; }
        public string Owner { get; set; }
        public string LastTest { get; set; }
        public string NextTest { get; set; }
        public string EstimateNo { get; set; }
        public string EstimateDate { get; set; }
        public string ApprovalRef { get; set; }
        public string AVDate { get; set; }
        public string CleanCertDate { get; set; }
        public string ReleaseBooking { get; set; }
        public string ReleaseDate { get; set; }
        public string ReleaseRef { get; set; }
        public string Status { get; set; }
        public string Purpose { get; set; }
        public string Remarks { get; set; }
        public string Yard { get; set; }
    }
}
