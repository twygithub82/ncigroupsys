using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes;

namespace IDMS.InGate.GqlTypes
{
    [ExtendObjectType(typeof(Query))]
    public class OutGate_Query
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        // [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<out_gate> QueryOutGates(ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<out_gate> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.out_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0)
                    .Include(s => s.tank.storing_order)
                        .ThenInclude(c => c.customer_company)
                    .Include(s => s.tank.tariff_cleaning)
                    .Include(s => s.tank.tariff_cleaning.cleaning_method)
                    .Include(s => s.tank.tariff_cleaning.cleaning_category)
                    .Include(s => s.tank.release_order_sot)
                        .ThenInclude(r => r.release_order);
                //.Include(s => s.in_gate_survey);
                // .Include(s=>s.tank.tariff_cleaning.cleaning_method);
                foreach (var q in query)
                {
                    if (q.tank != null)
                        if (q.tank.release_order_sot != null)
                        {
                            var ro = q.tank.release_order_sot.Where(s => s.sot_guid == q.tank.guid && (s.delete_dt == null || s.delete_dt == 0))
                                .FirstOrDefault()?.release_order;
                            if (ro != null)
                                q.haulier = ro.haulier;
                        }
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