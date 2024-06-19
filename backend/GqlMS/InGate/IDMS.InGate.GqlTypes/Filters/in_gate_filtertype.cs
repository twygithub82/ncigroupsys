using HotChocolate.Data.Filters;
using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.InGate.GqlTypes.Filters
{
    public class in_gate_filtertype:FilterInputType<EntityClass_InGateWithTank>
    {
        protected override void Configure(IFilterInputTypeDescriptor<EntityClass_InGateWithTank> descriptor)
        {
            descriptor.Ignore(c=>c.tank);
            
            base.Configure(descriptor);
        }
    }
}
