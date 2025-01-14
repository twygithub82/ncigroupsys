using IDMS.Models.Shared;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    public class PeriodicTestRequest
    {
        public string tank_no { get; set; }
        public string last_test_cv { get; set; }
        public string next_test_cv { get; set; }
    }
}
