using HotChocolate.Data;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System.Diagnostics.Eventing.Reader;

namespace IDMS.Models.Tariff.All.GqlTypes
{
    public class TariffCleaning_QueryType
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_depot?> QueryTariffDepot( ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_depot> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_depot.Where(i => i.delete_dt == null || i.delete_dt == 0)
                        .Include(t => t.tanks);
            }
            catch
            {
                throw;
            }

            return query;

        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public  IQueryable<tariff_cleaning?> QueryTariffCleaning( ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_cleaning> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_cleaning.Where(i => i.delete_dt == null || i.delete_dt == 0)
                      .Include(tc => tc.cleaning_method)
                      .Include(tc => tc.cleaning_category)
                      .Where(tc => (tc.cleaning_method.delete_dt == null || tc.cleaning_method.delete_dt == 0) &&
                       (tc.cleaning_category.delete_dt == null || tc.cleaning_category.delete_dt == 0));
            }
            catch
            {
                throw;
            }

            return query;
           
        }


        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_labour?> QueryTariffLabour( ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_labour> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_labour.Where(i => i.delete_dt == null || i.delete_dt == 0);
                     
            }
            catch
            {
                throw;
            }

            return query;

        }


        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_residue?> QueryTariffResidue( ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_residue> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_residue.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_buffer?> QueryTariffBuffer(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_buffer> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_buffer.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<tariff_repair?> QueryTariffRepair(ApplicationTariffDBContext context,
           [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<tariff_repair> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.tariff_repair.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch
            {
                throw;
            }

            return query;

        }


        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public async Task<un_number?> QueryUNClassByNo(ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, string unNo)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var query = await context.un_number.Where(u => u.un_no == unNo).FirstOrDefaultAsync();
                if (query == null)
                    throw new GraphQLException(new Error($"UN_No not found", "NOT FOUND"));
                else
                    return query;
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
        }
    }
}
