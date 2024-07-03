using HotChocolate.Data.Sorting;
using IDMS.Models.Inventory;


namespace IDMS.StoringOrder.Model.CustomSorter
{
    public class SOSorter: SortInputType<IDMS.Models.Inventory.storing_order>
    {
        protected override void Configure(ISortInputTypeDescriptor<storing_order> descriptor)
        {
            //descriptor.Ignore(so => so.customer_company_guid);
            // descriptor.Field(so => so.customer_company_guid).Name("CustomerGuid");
            base.Configure(descriptor);
        }
    }
}
 