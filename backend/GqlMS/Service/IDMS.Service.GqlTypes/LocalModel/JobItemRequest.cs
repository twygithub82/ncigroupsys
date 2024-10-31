using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Service.GqlTypes.LocalModel
{
    public class JobItemRequest
    {
        public string guid { get; set; }
        public string job_order_guid { get; set; }
        public string job_type_cv { get; set; }
    }

    public class JobProcessRequest
    {
        public string guid { get; set; }
        public string job_order_guid { get; set; }
        public string job_type_cv { get; set; }
    }
}
