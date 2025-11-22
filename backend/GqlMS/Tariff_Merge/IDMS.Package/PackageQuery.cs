using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Master;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using IDMS.Models.Tariff.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using Microsoft.Extensions.Logging;

namespace IDMS.Models.Package.GqlTypes
{
    [ExtendObjectType(typeof(TariffQuery))]
    public class PackageQuery
    {
        const string graphqlErrorCode = "ERROR";

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_depot?> QueryPackageDepot(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {

            IQueryable<package_depot> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_depot.Where(i => i.delete_dt == null || i.delete_dt == 0).Include(c => c.customer_company);//.Include(td=>td.depot);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageDepot");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<customer_company_cleaning_category?> QueryPackageCleaning(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {

            IQueryable<customer_company_cleaning_category> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.customer_company_cleaning_category.Where(i => i.delete_dt == null || i.delete_dt == 0)
                      .Include(pc => pc.customer_company)
                      .Include(pc => pc.cleaning_category)
                        .ThenInclude(t => t.tariff_cleanings);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageCleaning");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;

        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_labour?> QueryPackageLabour(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {

            IQueryable<package_labour> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_labour.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageLabour");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_residue?> QueryPackageResidue(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {

            IQueryable<package_residue> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_residue.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageResidue");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_buffer?> QueryPackageBuffer(ApplicationTariffDBContext context,
             [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)

        {

            IQueryable<package_buffer> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_buffer.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageBuffer");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<PackageRepairResult?> QueryPackageRepairWithCount(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {
            IQueryable<PackageRepairResult> query = null;
            try
            {
                List<string> invalidStatus = new List<string>() { "CANCELED", "NO_ACTION" };
                GqlUtils.IsAuthorize(config, httpContextAccessor);

                var result = context.package_repair
                    .Include(pr => pr.tariff_repair)
                        .ThenInclude(tr => tr.repair_part)
                            .ThenInclude(rp => rp.repair)
                                .ThenInclude(r => r.storing_order_tank)
                                    .ThenInclude(sot => sot.storing_order)
                    .Where(pr => pr.delete_dt == null)
                    .Select(pr => new PackageRepairResult
                    {
                        package_repair = pr,
                        count = pr.tariff_repair.repair_part
                            .Where(rp =>
                                rp.delete_dt == null &&
                                rp.repair != null &&
                                rp.repair.delete_dt == null &&
                                !invalidStatus.Contains(rp.repair.status_cv) &&
                                rp.repair.storing_order_tank != null &&
                                rp.repair.storing_order_tank.storing_order != null &&
                                rp.repair.storing_order_tank.storing_order.customer_company_guid == pr.customer_company_guid
                            )
                            .Count()
                    })
                    .AsSplitQuery()
                    .AsQueryable();
                return result;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageRepairWithCount");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
        }


        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_repair?> QueryPackageRepair(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<PackageQuery> logger)
        {

            IQueryable<package_repair> query = null;
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_repair.Where(i => i.delete_dt == null || i.delete_dt == 0);
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageDepot");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }

        // [Authorize]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection()]
        [UseFiltering()]
        [UseSorting]
        public IQueryable<package_steaming?> QueryPackageSteaming(ApplicationTariffDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger logger)
        {

            IQueryable<package_steaming> query = null;
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.package_steaming.Where(i => i.delete_dt == null || i.delete_dt == 0);

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryPackageSteaming");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }

            return query;
        }

    }
}
