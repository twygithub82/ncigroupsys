using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;

using Microsoft.AspNetCore.Identity;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes;

namespace IDMS.InGate.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class InGate_Query
    {
        private void Ping(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            if (context != null)
            {
                context.in_gate.First();
            }
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering(typeof(IDMS.Models.Filters.in_gate_filtertype))]
        [UseSorting]
        public IQueryable<in_gate> QueryInGates(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<in_gate> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0)
                    .Include(s => s.tank.tariff_cleaning)
                    .Include(s => s.tank.storing_order)
                    .Include(s => s.tank.storing_order.customer_company)
                    .Include(s => s.tank.tariff_cleaning.cleaning_method)
                    .Include(s => s.tank.tariff_cleaning.cleaning_category)
                    .Include(s => s.in_gate_survey);
                // .Include(s=>s.tank.tariff_cleaning.cleaning_method);
                foreach (var q in query)
                {
                    if (q.tank != null)
                        if (q.tank.storing_order != null)
                            q.haulier = q.tank.storing_order.haulier;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

            return query;
        }
    }
}