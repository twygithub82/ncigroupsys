using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System;

namespace IDMS.EstimateTemplate.GqlTypes
{
    public class TemplateEstQuery
    {
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        [UseProjection]
        [UseFiltering]
        [UseSorting]
        public IQueryable<template_est> QueryTemplateEstimation(ApplicationMasterDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<TemplateEstQuery> logger)
        {
            try
            {
                GqlUtils.IsAuthorize(config, httpContextAccessor);
                var templateEst = context.template_est.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(d => d.template_est_customer)
                       .ThenInclude(t => t.customer_company)
                    .Include(d => d.template_est_part)
                       .ThenInclude(p => p.tep_damage_repair);

                return templateEst;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in QueryTemplateEstimation: {Message}", ex.Message);
                throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage(ex.Message)
                            .SetCode("ERROR")
                            .Build());
            }
        }

    }
}
