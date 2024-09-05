using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Data.Projections;
using HotChocolate.Types;
using IDMS.Models.Inventory;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using static IDMS.EstimateTemplate.StatusConstant;

namespace IDMS.EstimateTemplate.GqlTypes
{
    public class TemplateEstMutation
    {
        public async Task<int> AddTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, template_est newTemplateEst)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var template = newTemplateEst;
                template.guid = Util.GenerateGUID();
                template.create_by = user;
                template.create_dt = currentDateTime;
                context.template_est.Add(template);

                //if (TemplateType.EXCLUSIVE.EqualsIgnore(newTemplateEst.type_cv))
                   
                
                
                var res = await context.SaveChangesAsync();

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> UpdateTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, List<template_est> updteTemplateEst)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<template_est> tempEstList = new List<template_est>();
                foreach (var est in updteTemplateEst)
                {
                    var template = new template_est() { guid = est.guid };
                    context.Attach(template);
                    
                    template.update_by = user;
                    template.update_dt = currentDateTime;
                    template.type_cv = est.type_cv;
                    template.template_name = est.template_name;
                    template.labour_cost_discount = est.labour_cost_discount;
                    template.material_cost_discount = est.material_cost_discount;
                    tempEstList.Add(template);

                }
                context.template_est.UpdateRange(tempEstList);
                var res = await context.SaveChangesAsync();

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

    }
}
