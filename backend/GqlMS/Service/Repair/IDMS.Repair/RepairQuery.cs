using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Repair
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class RepairQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<repair_est> QueryRepairEstimate(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var repairEst = context.repair_est.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(d => d.repair_est_part)
                        .ThenInclude(p => p.rep_damage_repair)
                    .Include(d => d.storing_order_tank)
                        .ThenInclude(p => p.in_gate);

                return repairEst;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
