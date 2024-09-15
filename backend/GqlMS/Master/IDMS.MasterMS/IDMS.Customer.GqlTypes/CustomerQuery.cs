using HotChocolate;
using HotChocolate.Types;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Shared;
using Microsoft.AspNetCore.Http;

namespace IDMS.Customer.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstQuery))]
    public class CustomerQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company> QueryCustomerCompany([Service] IHttpContextAccessor httpContextAccessor,
           ApplicationMasterDBContext context)
        {
            try
            {
                return context.customer_company.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<customer_company_contact_person> QueryContactPerson([Service] IHttpContextAccessor httpContextAccessor,
          ApplicationMasterDBContext context)
        {
            try
            {
                return context.customer_company_contact_person.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<currency> QueryCurrency([Service] IHttpContextAccessor httpContextAccessor,
          ApplicationMasterDBContext context)
        {
            try
            {
                return context.currency.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

    }
}
