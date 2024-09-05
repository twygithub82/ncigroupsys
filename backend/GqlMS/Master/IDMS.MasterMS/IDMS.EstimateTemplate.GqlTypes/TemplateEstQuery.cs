using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;

namespace IDMS.EstimateTemplate.GqlTypes
{
    public class TemplateEstQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<template_est> QueryTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        {
            try
            {
                var templateEst = context.template_est.Where(d => d.delete_dt == null || d.delete_dt == 0);
                //var bookingDetail = context.booking.Where(b => b.delete_dt == null || b.delete_dt == 0)
                //    .Include(b => b.storing_order_tank);

                return templateEst;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

    }
}
