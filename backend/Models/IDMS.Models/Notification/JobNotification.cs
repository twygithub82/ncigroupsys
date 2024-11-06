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
        public string job_status { get; set; }
        public string job_order_guid { get; set; }
        public long? start_time { get; set; }
        public long? stop_time { get; set; }    
    }
}
