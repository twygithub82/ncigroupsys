using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using IDMS.Service.GqlTypes;

namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class ResidueQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<residue> QueryResidue(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var residue = context.residue.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(r => r.residue_part)
                    .Include(r => r.storing_order_tank)
                        .ThenInclude(t => t.storing_order)
                            .ThenInclude(s => s.customer_company);

                return residue;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
