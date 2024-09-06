using CommonUtil.Core.Service;
using HotChocolate;
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
            [Service] IConfiguration config, template_est newTemplateEst, List<string> customerGuid)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var template = new template_est();
                template.guid = Util.GenerateGUID();
                template.create_by = user;
                template.create_dt = currentDateTime;

                template.template_name = newTemplateEst.template_name;
                template.type_cv = newTemplateEst.type_cv;
                template.labour_cost_discount = newTemplateEst.labour_cost_discount;
                template.material_cost_discount = newTemplateEst.material_cost_discount;
                await context.template_est.AddAsync(template);

                if (TemplateType.EXCLUSIVE.EqualsIgnore(newTemplateEst.type_cv))
                {
                    if (!customerGuid.Any())
                        throw new GraphQLException(new Error($"Customer guid cannot be null or empty", "ERROR"));

                    UpdateCustomer(context, customerGuid, user, currentDateTime, template.guid);
                }

                IList<template_est_part> partList = new List<template_est_part>();
                foreach (var newPart in newTemplateEst.template_est_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.template_est_guid = template.guid;
                    partList.Add(newPart);

                    UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }
                await context.AddRangeAsync(partList);

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
           [Service] IConfiguration config, template_est updateTemplateEst, List<string> customerGuid)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //IList<template_est> tempEstList = new List<template_est>();
                //foreach (var est in updteTemplateEst)
                //{
                //    var template = new template_est() { guid = est.guid };
                //    context.Attach(template);

                //    template.update_by = user;
                //    template.update_dt = currentDateTime;
                //    template.type_cv = est.type_cv;
                //    template.template_name = est.template_name;
                //    template.labour_cost_discount = est.labour_cost_discount;
                //    template.material_cost_discount = est.material_cost_discount;
                //    tempEstList.Add(template);

                //}
                //context.template_est.UpdateRange(tempEstList);
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

        #region private function
        private async void UpdateCustomer(ApplicationMasterDBContext context, List<string> customerGuid, string user, long currentDateTime, string templateGuid)
        {
            try
            {
                IList<template_est_customer> tempEstCustomerList = new List<template_est_customer>();
                foreach (var id in customerGuid)
                {
                    var templateEstCustomer = new template_est_customer();
                    templateEstCustomer.guid = Util.GenerateGUID();
                    templateEstCustomer.create_by = user;
                    templateEstCustomer.create_dt = currentDateTime;

                    templateEstCustomer.template_est_guid = templateGuid;
                    templateEstCustomer.customer_company_guid = id;
                    tempEstCustomerList.Add(templateEstCustomer);
                }
                context.AddRangeAsync(tempEstCustomerList);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        private async void UpdateRepairDamageCode(ApplicationMasterDBContext context, string user, long currentDateTime, template_est_part newPart)
        {
            try
            {
                if (newPart != null)
                {
                    IList<tep_damage_repair> tepDamageRepairList = new List<tep_damage_repair>();
                    foreach (var dmg in newPart.damage_code)
                    {
                        var tepDamage = new tep_damage_repair();
                        tepDamage.guid = Util.GenerateGUID();
                        tepDamage.create_by = user;
                        tepDamage.create_dt = currentDateTime;

                        tepDamage.tep_guid = newPart.guid;
                        tepDamage.code_type = (int)CodeTyp.damage;
                        tepDamage.code_cv = dmg;
                        tepDamageRepairList.Add(tepDamage);
                    }

                    foreach (var rep in newPart.repair_code)
                    {
                        var tepRepair = new tep_damage_repair();
                        tepRepair.guid = Util.GenerateGUID();
                        tepRepair.create_by = user;
                        tepRepair.create_dt = currentDateTime;

                        tepRepair.tep_guid = newPart.guid;
                        tepRepair.code_type = (int)CodeTyp.repair;
                        tepRepair.code_cv = rep;
                        tepDamageRepairList.Add(tepRepair);
                    }
                    await context.AddRangeAsync(tepDamageRepairList);
                }
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }
        #endregion
    }
}
