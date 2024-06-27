using HotChocolate.Data.Sorting;
using IDMS.Booking.Model.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model.CustomSorter
{
    public class SOSorter: SortInputType<storing_order>
    {
        protected override void Configure(ISortInputTypeDescriptor<storing_order> descriptor)
        {
            //descriptor.Ignore(so => so.customer_company_guid);
            // descriptor.Field(so => so.customer_company_guid).Name("CustomerGuid");
            base.Configure(descriptor);
        }
    }
}
 