using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Repair;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Residue.GqlTypes
{
    [ExtendObjectType(typeof(RepairEstQuery))]
    public class ResidueQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<residue> QueryResidueQuotation(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var residue = context.residue.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(r => r.residue_part)
                    .Include(r => r.storing_order_tank);

                return residue;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
    }
}
