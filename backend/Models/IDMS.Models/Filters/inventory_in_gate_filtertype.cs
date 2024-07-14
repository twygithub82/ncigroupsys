using HotChocolate.Data.Filters;
using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Filters
{
    public class in_gate_filtertype : FilterInputType<InGateWithTank>
    {
        protected override void Configure(IFilterInputTypeDescriptor<InGateWithTank> descriptor)
        {
            //descriptor.Ignore(c => c.tank);

            base.Configure(descriptor);
        }
    }
}