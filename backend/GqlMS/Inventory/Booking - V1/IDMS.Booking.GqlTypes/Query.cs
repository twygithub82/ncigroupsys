using HotChocolate;
using IDMS.Booking.GqlTypes.Repo;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Shared;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.GqlTypes
{
    public class Query
    {
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<surveyor> QuerySurveyor(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.surveyor.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
