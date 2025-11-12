using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.DB
{
    public class email_job
    {
        [Key]
        public string? guid { get; set; }
        public string? to_addresses { get; set; }
        public string? cc_addresses { get; set; }
        public string? bcc_addresses { get; set; }
        public string eir_group_guid { get; set; }
        public string tank_no { get; set; }
        public int? type { get; set; }
        public int? status { get; set; }
        public int? attempt_count { get; set; }
        public long? sent_dt { get; set; }
        public string? create_by {  get; set; }
        public long? create_dt { get; set; }
        public string? update_by { get; set; }
        public long? update_dt { get; set; }
        public long? delete_dt { get; set; }
    }

    public class newEmailJobDto
    {
        public List<string> to_addresses { get; set; }
        public List<string>? cc_addresses { get; set; }
        public List<string>? bcc_addresses { get; set; }
        public string eir_group_guid { get; set; }
        public string tank_no { get; set; }
        public string type { get; set; }
    }
}
