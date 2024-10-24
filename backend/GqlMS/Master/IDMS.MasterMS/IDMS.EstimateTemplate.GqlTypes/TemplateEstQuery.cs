﻿using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using System;

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

                return templateEst;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }


        //[UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        //[UseProjection]
        //[UseFiltering]
        //[UseSorting]
        //public List<template_est> QueryTemplateEstimation1(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor)
        //{
        //    try
        //    {
        //        var templateEst = context.template_est.Where(d => d.delete_dt == null || d.delete_dt == 0)
        //            .Include(d => d.template_est_customer)
        //                .ThenInclude(t => t.customer_company)
        //            .Include(d => d.template_est_part.Where(p => p.delete_dt == null || p.delete_dt == 0));
        //        //.ThenInclude(p => p.tep_damage_repair);



        //        return templateEst.ToList();
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

    }
}
