using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Shared;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes.LocalModel;
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models;
using CommonUtil.Core.Service;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Inventory.GqlTypes
{
    public class InventoryQuery
    {
        private readonly ILogger<InventoryQuery> _logger;

        public InventoryQuery(ILogger<InventoryQuery> logger)
        {
            _logger = logger;
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<tank> QueryTank([Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context, [Service] IConfiguration config)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                return context.tank.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryTank failed");
                throw new GraphQLException(new Error($"QueryTank failed", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<tank_info> QueryTankInfo([Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context)
        {
            try
            {
                return context.tank_info.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryTankInfo failed");
                throw new GraphQLException(new Error($"QueryTankInfo failed", "ERROR"));
            }
        }

        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<code_values> QueryCodeValuesByType(CodeValuesRequest codeValuesType, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context)
        {
            try
            { 
                var retCodeValues = context.code_values.Where(c => c.code_val_type.Equals(codeValuesType.code_val_type) &&
                                                              (c.delete_dt == null || c.delete_dt == 0));
                if (retCodeValues.Count() <= 0)
                {
                    _logger.LogWarning("QueryCodeValuesByType: no code values found for type {Type}", codeValuesType?.code_val_type);
                    throw new GraphQLException(new Error("Code values type not found.", "NOT_FOUND"));
                }

                return retCodeValues;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryCodeValuesByType failed for type {Type}", codeValuesType?.code_val_type);
                throw new GraphQLException(new Error($"QueryCodeValuesByType failed for {codeValuesType?.code_val_type}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<code_values> QueryCodeValues([Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context)
        {
            try
            {
                var caller = httpContextAccessor?.HttpContext?.User?.Identity?.Name ?? "anonymous";
                _logger.LogInformation("QueryCodeValues invoked by {Caller}", caller);
                var result = context.code_values.Where(c => c.delete_dt == null || c.delete_dt == 0);
                return result;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryCodeValues failed");
                throw new GraphQLException(new Error($"QueryCodeValues failed", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<survey_detail> QuerySurveyDetail(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var caller = httpContextAccessor?.HttpContext?.User?.Identity?.Name ?? "anonymous";
                _logger.LogInformation("QuerySurveyDetail invoked by {Caller}", caller);
                return context.survey_detail.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QuerySurveyDetail failed");
                throw new GraphQLException(new Error($"QuerySurveyDetail failed", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<transfer> QueryTransfer(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.transfer.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryTransfer failed");
                throw new GraphQLException(new Error($"QueryTransfer failed", "ERROR"));
            }
        }

        public async Task<List<survey_detail?>?> QuerySurveyDetailByTankNo([Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context, string tankNo, int rowCount)
        {
            try
            {
                string testType = "PERIODIC_TEST";
                string status = "ACCEPTED";

                var query = from ti in context.tank_info
                            join sot in context.storing_order_tank on ti.tank_no equals sot.tank_no into tankStoringOrders
                            from sot in tankStoringOrders.DefaultIfEmpty()
                            join sd in context.survey_detail on sot.guid equals sd.sot_guid into storingOrderSurveys
                            from sd in storingOrderSurveys.DefaultIfEmpty()
                            where ti.tank_no.Equals(tankNo) && sd.survey_type_cv.ToUpper().Equals(testType)
                            && sd.status_cv.Equals(status) && sd.delete_dt == null
                            orderby sd.survey_dt descending, sd.create_dt descending
                            select new
                            {
                                TankInfo = ti,
                                StoringOrderTank = sot,
                                SurveyDetail = sd
                            };

                var result = await query.Select(x => x.SurveyDetail).Take(rowCount).ToListAsync();
                _logger.LogInformation("QuerySurveyDetailByTankNo returned {Count} records for tank {TankNo}", result?.Count ?? 0, tankNo);
                return result;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QuerySurveyDetailByTankNo failed for tank {TankNo}", tankNo);
                throw new GraphQLException(new Error($"QuerySurveyDetailByTankNo failed for tank{tankNo}", "ERROR"));
            }
        }

        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<inspections> QueryInspections(ApplicationInventoryDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                return context.inspections.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "QueryInspections failed");
                throw new GraphQLException(new Error($"QueryInspections failed", "ERROR"));
            }
        }
    }
}
