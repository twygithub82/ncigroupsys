using HotChocolate.Types;
using HotChocolate;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using IDMS.Repair;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceQuery))]
    public class CleaningQuery
    {

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<cleaning> QueryCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<cleaning> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0);
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
