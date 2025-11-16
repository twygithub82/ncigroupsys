using HotChocolate.Data;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;


namespace IDMS.Models.Parameter.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstQuery))]
    public class CleaningMethodQuery
    {
        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public  IQueryable<cleaning_method?> QueryCleaningMethod(ApplicationMasterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_method> query = null;
            try
            {
               // var context = _contextFactory.CreateDbContext();   
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_method.Where(i => i.delete_dt == null);
              //  System.Threading.Thread.Sleep(5000);
                

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
        public IQueryable<cleaning_category?> QueryCleaningCategory(ApplicationMasterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_category> query = null;
            try
            {
              // var context = _contextFactory.CreateDbContext();
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_category.Where(i => i.delete_dt == null);
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
        public IQueryable<cleaning_formula?> QueryCleaningFormula(ApplicationMasterDBContext context,
          [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_formula> query = null;
            try
            {
                // var context = _contextFactory.CreateDbContext();
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_formula.Where(i => i.delete_dt == null);
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<cleaning_method_formula?> QueryCleaningMethodFormula(ApplicationMasterDBContext context,
          [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {

            IQueryable<cleaning_method_formula> query = null;
            try
            {
                // var context = _contextFactory.CreateDbContext();
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.cleaning_method_formula.Where(i => i.delete_dt == null);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

            return query;
        }

    }
}
