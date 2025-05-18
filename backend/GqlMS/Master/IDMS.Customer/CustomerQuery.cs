using HotChocolate;
using HotChocolate.Types;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Shared;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
//using System.Data.Entity;

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
           [Service] IConfiguration config, ApplicationMasterDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
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
        public IQueryable<CustomerCompanyResult?> QueryCustomerCompanyWithCount([Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, ApplicationMasterDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var result = context.customer_company
                                                    .AsSplitQuery()
                                                    .Where(cc => cc.delete_dt == null)
                                                    .Select(cc => new CustomerCompanyResult
                                                    {
                                                        customer_company = cc,
                                                        sot_count = context.Set<storing_order_tank>()
                                                            .Count(sot => sot.owner_guid == cc.guid && sot.delete_dt == null),
                                                        so_count = context.storing_order
                                                            .Count(so => so.customer_company_guid == cc.guid && so.delete_dt == null),
                                                        tank_info_count = context.Set<tank_info>()
                                                            .Count(t => t.owner_guid == cc.guid && t.delete_dt == null)
                                                    })
                                                    .AsQueryable();
                return result;

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
        public IQueryable<customer_company_contact_person> QueryContactPerson([Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config, ApplicationMasterDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
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
        public IQueryable<currency> QueryCurrency([Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config, ApplicationMasterDBContext context)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.currency.Where(d => d.delete_dt == null || d.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<bool> QueryCanDeleteCustomer([Service] IHttpContextAccessor httpContextAccessor, [Service] IConfiguration config, 
            ApplicationMasterDBContext context, string guid)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var customer = context.customer_company.AsQueryable();
                var customerList = await customer.Where(c => c.main_customer_guid == guid).Select(c => c.guid).ToListAsync();
                customerList.Add(guid);

                var count = await context.customer_company
                                    .Where(cc => customerList.Contains(cc.guid))
                                    .Join(
                                        context.storing_order,
                                        cc => cc.guid,
                                        so => so.customer_company_guid,
                                        (cc, so) => so
                                        )
                                        .Where(so => so.status_cv == "COMPLETED" || so.status_cv == "PROCESSING")
                                        .CountAsync();
                
                //var count = await context.customer_company
                //                .Where(cc => customerList.Contains(cc.guid))  // Check if the GUID is in the provided list
                //                .GroupJoin(
                //                    context.storing_order,
                //                    cc => cc.guid,
                //                    so => so.customer_company_guid,
                //                    (cc, orders) => new { CustomerCompany = cc, Orders = orders }
                //                )
                //                .SelectMany(
                //                    x => x.Orders.Where(so => so.status_cv == "COMPLETED" || so.status_cv == "PROCESSING")
                //                                 .DefaultIfEmpty(),
                //                    (x, so) => so
                //                )
                //                .CountAsync();
                if(count > 0)
                {
                    return false;
                }
                return true;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
