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

namespace IDMS.Inventory.GqlTypes
{
    public class InventoryQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<tank> QueryTank([Service] IHttpContextAccessor httpContextAccessor, ApplicationInventoryDBContext context)
        {
            try
            {
                return context.tank.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                    throw new GraphQLException(new Error("Code values type not found.", "NOT_FOUND"));
                }

                return retCodeValues;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                var result = context.code_values.Where(c => c.delete_dt == null || c.delete_dt == 0);
                return result;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                return context.survey_detail.Where(t => t.delete_dt == null || t.delete_dt == 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                            orderby sd.survey_dt descending
                            select new
                            {
                                TankInfo = ti,
                                StoringOrderTank = sot,
                                SurveyDetail = sd
                            };
                //var result = await query.Take(rowCount).ToListAsync();

                var result = await query.Select(x => x.SurveyDetail).Take(rowCount).ToListAsync();
                return result;

                //var specificResult = await query.Select(x => new
                //{
                //    //last_test_cv = x.TankInfo.last_test_cv,
                //    survey_detail = x.SurveyDetail,
                //}).Take(rowCount).ToListAsync();

                //List<survey_detail> result = specificResult
                //    .Select(item => item.survey_detail)
                //    .ToList();


            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
