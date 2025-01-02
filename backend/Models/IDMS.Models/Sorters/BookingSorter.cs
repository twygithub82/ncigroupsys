using HotChocolate.Data.Sorting;
using IDMS.Models.Inventory;
using IDMS.Models.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    //public class BookingSorter: SortInputType<booking>
    //{
    //    protected override void Configure(ISortInputTypeDescriptor<booking> descriptor)
    //    {
    //        //descriptor.Ignore(so => so.customer_company_guid);
    //        // descriptor.Field(so => so.customer_company_guid).Name("CustomerGuid");
    //        base.Configure(descriptor);
    //    }
    //}

    public class CleaningSorter : SortInputType<cleaning>
    {
        protected override void Configure(ISortInputTypeDescriptor<cleaning> descriptor)
        {
            //descriptor.Ignore(so => so.customer_company_guid);
            // descriptor.Field(so => so.customer_company_guid).Name("CustomerGuid");
            descriptor.Field(c=>c.storing_order_tank.in_gate.Where(g=>g.delete_dt == null || g.delete_dt == 0).FirstOrDefault().eir_dt);
            base.Configure(descriptor);
        }
    }
}
 