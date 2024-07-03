using HotChocolate.Data.Filters;
using HotChocolate.Types;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDMS.Models.Inventory;

namespace IDMS.StoringOrder.Model.CustomSorter
{ 
    //[ExtendObjectType(typeof(storing_order_tank),
    //IgnoreProperties = new[] { nameof(storing_order_tank.storing_order), nameof(storing_order_tank.tariff_cleaning) })]
    public class SOTFilter: FilterInputType<storing_order_tank>
    {
        protected override void Configure(IFilterInputTypeDescriptor<storing_order_tank> descriptor)
        {
            //descriptor.Ignore(s => s.storing_order);
            //descriptor.Ignore(s => s.tariff_cleaning);
            base.Configure(descriptor);
        }
    }
}
