﻿using HotChocolate;
using HotChocolate.Types;
using Microsoft.AspNetCore.Http;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Inventory.GqlTypes.LocalModel;
using IDMS.Models.Inventory;

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
    }
}
