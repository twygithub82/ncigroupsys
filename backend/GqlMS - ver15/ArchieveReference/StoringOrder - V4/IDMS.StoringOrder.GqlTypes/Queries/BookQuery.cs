using HotChocolate;
using HotChocolate.Types;
using IDMS.StoringOrder.GqlTypes.Repo;
using IDMS.StoringOrder.Model.CustomSorter;
using IDMS.StoringOrder.Model.Domain;
using IDMS.StoringOrder.Model.Domain.StoringOrder;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.GqlTypes.Queries
{
    [ExtendObjectType(typeof(Query))]
    public class BookQuery
    {

        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        ////[UseSorting(typeof(SOSorter))]
        //public IQueryable<storing_order_tank> QueryStoringOrderTank(BookDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        //{
        //    try
        //    {
        //        return context.storing_order_tank.Where(d => d.delete_dt == null || d.delete_dt == 0)
        //            .Include(so=> so.storing_order);
        //                                         //.Include(c => c.code_values);
        //        //.Include(so => so.storing_order_tank.Where(d => d.delete_dt == null))
        //        //.Include(so => so.customer_company);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
        //    }
        //}

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        //[UseSorting(typeof(SOSorter))]
        public IQueryable<booking> QueryBooking(BookDbContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.booking.Where(d => d.delete_dt == null || d.delete_dt == 0);
                //.Include(c => c.code_values);
                //.Include(so => so.storing_order_tank.Where(d => d.delete_dt == null))
                //.Include(so => so.customer_company);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
