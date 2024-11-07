using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Notification
{
    public class JobNotification
    { 
        public string? time_table_guid { get; set; }
        public string? job_order_guid { get; set; }
        public string? item_guid { get; set; }
        public string? job_status { get; set; }
        public string? job_type { get; set; }
        public long? start_time { get; set; }
        public long? stop_time { get; set; }    
        public long? complete_dt { get; set; }
    }
}
