using HotChocolate.Data.Sorting;
using IDMS.Models.Inventory;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class BookingSorter: SortInputType<booking>
    {
        protected override void Configure(ISortInputTypeDescriptor<booking> descriptor)
        {
            //descriptor.Ignore(so => so.customer_company_guid);
            // descriptor.Field(so => so.customer_company_guid).Name("CustomerGuid");
            base.Configure(descriptor);
        }
    }
}
 