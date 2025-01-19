using HotChocolate;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.CompilerServices;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Billing.GqlTypes.LocalModel
{
    public class BillingEstimateRequest
    {
        public string process_guid {  get; set; }
        public string process_type { get; set; }
        public string billing_party { get; set; } //OWNER, CUSTOMER
        public string action { get; set; }
        [GraphQLIgnore]
        public string? billing_guid { get; set; }
    }
}
