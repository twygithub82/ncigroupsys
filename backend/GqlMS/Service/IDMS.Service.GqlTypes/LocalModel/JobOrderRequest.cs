using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Service.GqlTypes.LocalModel
{
    public class JobOrderRequest
    {
        public string? guid { get; set; }
        public string sot_guid { get; set; }
        public string team_guid { get; set; }
        public double working_hour { get; set; }
        public double total_hour { get; set; }
        public string job_type_cv { get; set; }
        public string? status_cv { get; set; }
        public string? remarks { get; set; }
        public List<string?>? part_guid {  get; set; }
    }

    public class UpdateJobOrderRequest
    {
        public string guid { get; set; }
        public string? remarks { get; set; }
        public long? start_dt { get; set; }
        public long? complete_dt { get; set; }
    }
}
