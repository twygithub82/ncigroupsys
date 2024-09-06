using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

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
                var templateEst = context.template_est.Where(d => d.delete_dt == null || d.delete_dt == 0)
                    .Include(d => d.template_est_customer)
                        .ThenInclude(t => t.customer_company)
                    .Include(d => d.template_est_part)
                        .ThenInclude(p => p.tep_damage_repair);


                //var functionNames = from ts in context.template_est
                //                    join tec in context.template_est_customer
                //                    on ts.guid equals tec.customer_company_guid
                //                    join tep in context.template_est_part
                //                    on ts.guid equals tep.template_est.guid

                //                    where (from r in _dbContext.UserRoles where r.UserId == userId select r.RoleId).Contains(rf.role_guid)
                //                    select f.name;

                return templateEst;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

    }
}
