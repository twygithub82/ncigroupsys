using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static IDMS.EstimateTemplate.GqlTypes.LocalModel.StatusConstant;

namespace IDMS.EstimateTemplate.GqlTypes
{
    public class TemplateEstMutation
    {
        public async Task<int> AddTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, template_est newTemplateEstimate)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var template = new template_est();
                template.guid = Util.GenerateGUID();
                template.create_by = user;
                template.create_dt = currentDateTime;

                template.template_name = newTemplateEstimate.template_name;
                template.type_cv = newTemplateEstimate.type_cv;
                template.labour_cost_discount = newTemplateEstimate.labour_cost_discount;
                template.material_cost_discount = newTemplateEstimate.material_cost_discount;
                template.remarks = newTemplateEstimate.remarks;
                await context.template_est.AddAsync(template);

                if (TemplateType.EXCLUSIVE.EqualsIgnore(newTemplateEstimate.type_cv))
                {
                    if (newTemplateEstimate.template_est_customer == null)
                        throw new GraphQLException(new Error($"Template_estimate_customer object cannot be null", "ERROR"));

                     await UpdateCustomer(context, newTemplateEstimate.template_est_customer, user, currentDateTime, template);
                }

                IList<template_est_part> partList = new List<template_est_part>();
                foreach (var newPart in newTemplateEstimate.template_est_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.template_est_guid = template.guid;
                    partList.Add(newPart);

                    await UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }
                await context.template_est_part.AddRangeAsync(partList);

                var res = await context.SaveChangesAsync();

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;

            }
            //catch (GraphQLException gex)
            //{
            //    throw new GraphQLException(new Error($"{gex.Message}--{gex.InnerException}", "ERROR"));
            //}
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }

        }

        public async Task<int> UpdateTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, template_est editTemplateEsimate)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var template = await context.template_est.Where(t => t.guid == editTemplateEsimate.guid && (t.delete_dt == null || t.delete_dt == 0))
                                                        .Include(t => t.template_est_customer)
                                                        .Include(t => t.template_est_part)
                                                            .ThenInclude(tp => tp.tep_damage_repair)
                                                        .FirstOrDefaultAsync();

                if (template == null)
                    throw new GraphQLException(new Error($"Template_estimate not found", "ERROR"));

                template.update_by = user;
                template.update_dt = currentDateTime;
                template.labour_cost_discount = editTemplateEsimate.labour_cost_discount;
                template.material_cost_discount = editTemplateEsimate.material_cost_discount;
                template.template_name = editTemplateEsimate.template_name;
                template.type_cv = editTemplateEsimate.type_cv;
                template.remarks = editTemplateEsimate.remarks;

                if (editTemplateEsimate.template_est_part != null)
                {
                    foreach (var part in editTemplateEsimate.template_est_part)
                    {
                        if (ObjectAction.NEW.EqualsIgnore(part.action))
                        {
                            var newEstPart = part;
                            newEstPart.guid = Util.GenerateGUID();
                            newEstPart.create_by = user;
                            newEstPart.create_dt = currentDateTime;
                            newEstPart.template_est_guid = template.guid;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part);
                            await context.template_est_part.AddAsync(newEstPart);
                            continue;
                        }


                        var existingPart = template.template_est_part?.Where(p => p.guid == part.guid && (p.delete_dt == null || p.delete_dt == 0)).FirstOrDefault();
                        if (existingPart == null)
                            throw new GraphQLException(new Error($"Template_part guid used for update cannot be null or empty", "ERROR"));

                        if (ObjectAction.EDIT.EqualsIgnore(part.action))
                        {
                            //var updatePart = new template_est_part() { guid = part.guid };
                            //context.Attach(updatePart);
                            existingPart.update_by = user;
                            existingPart.update_dt = currentDateTime;
                            existingPart.quantity = part.quantity;
                            existingPart.location_cv = part.location_cv;
                            existingPart.description = part.description; 
                            existingPart.hour = part.hour;
                            existingPart.remarks = part.remarks;
                            existingPart.comment = part.comment;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.tep_damage_repair);
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(part.action))
                        {
                            //var delPart = new template_est_part() { guid = part.guid };
                            //context.Attach(delPart);
                            existingPart.delete_dt = currentDateTime;
                            existingPart.update_dt = currentDateTime;
                            existingPart.update_by = user;
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.tep_damage_repair);
                            continue;
                        }
                    }
                }

                if (TemplateType.EXCLUSIVE.EqualsIgnore(editTemplateEsimate.type_cv))
                {
                    if (editTemplateEsimate.template_est_customer == null)
                        throw new GraphQLException(new Error($"Template_customer object cannot be null", "ERROR"));

                    await UpdateCustomer(context, editTemplateEsimate.template_est_customer, user, currentDateTime, template);
                }
                else
                {
                    //Cautions check to softdelete all custmomer from this template since it ald being change to general type
                    foreach(var cus in template.template_est_customer)
                    {
                        cus.update_dt = currentDateTime;
                        cus.delete_dt = currentDateTime;
                        cus.update_by = user;
                    }
                }

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
        //private async void UpdateCustomer(ApplicationMasterDBContext context, IEnumerable<template_est_customer> templateCustomers, string user, long currentDateTime, string templateGuid)
        //{
        //    try
        //    {
        //        //IList<template_est_customer> tempEstCustomerList = new List<template_est_customer>();
        //        foreach (var cus in templateCustomers)
        //        {
        //            if (string.IsNullOrEmpty(cus.customer_company_guid))
        //                throw new GraphQLException(new Error($"Customer_company guid cannot null or empty", "ERROR"));

        //            if (ObjectAction.NEW.EqualsIgnore(cus.action) || (string.IsNullOrEmpty(cus.action) && string.IsNullOrEmpty(cus.guid)))
        //            {
        //                var templateEstCustomer = cus;//new template_est_customer();
        //                templateEstCustomer.guid = Util.GenerateGUID();
        //                templateEstCustomer.create_by = user;
        //                templateEstCustomer.create_dt = currentDateTime;

        //                templateEstCustomer.template_est_guid = templateGuid;
        //                templateEstCustomer.customer_company_guid = cus.customer_company_guid;
        //                await context.AddAsync(templateEstCustomer);
        //            }
        //            else if (ObjectAction.CANCEL.EqualsIgnore(cus.action))
        //            {
        //                if (string.IsNullOrEmpty(cus.guid))
        //                    throw new GraphQLException(new Error($"Template_estimate_customer guid cannot null or empty for cancel", "ERROR"));

        //                var customer = cus;//new template_est_customer() { guid = cus.guid };
        //                //context.Attach(customer);

        //                customer.update_dt = currentDateTime;
        //                customer.delete_dt = currentDateTime;
        //                customer.update_by = user;
        //                context.Update(customer);
        //            }
        //        }
        //        //context.AddRangeAsync(tempEstCustomerList);
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error(ex.Message, "ERROR"));
        //    }
        //}

        private async Task UpdateCustomer(ApplicationMasterDBContext context, IEnumerable<template_est_customer> templateCustomers,
                                            string user, long currentDateTime, template_est templateEst)
        {
            try
            {
                //IList<template_est_customer> tempEstCustomerList = new List<template_est_customer>();
                foreach (var cus in templateCustomers)
                {
                    if (string.IsNullOrEmpty(cus.action) && !string.IsNullOrEmpty(cus.guid))
                        continue;
                        //throw new GraphQLException(new Error($"Template_estimate_customer action cannot be null for update", "ERROR"));

                    if (ObjectAction.NEW.EqualsIgnore(cus.action) || (string.IsNullOrEmpty(cus.action) && string.IsNullOrEmpty(cus.guid)))
                    {
                        if (string.IsNullOrEmpty(cus.customer_company_guid))
                            throw new GraphQLException(new Error($"Customer_company guid cannot null or empty", "ERROR"));

                        var templateEstCustomer = cus;//new template_est_customer();
                        templateEstCustomer.guid = Util.GenerateGUID();
                        templateEstCustomer.create_by = user;
                        templateEstCustomer.create_dt = currentDateTime;

                        templateEstCustomer.template_est_guid = templateEst.guid;
                        templateEstCustomer.customer_company_guid = cus.customer_company_guid;
                        await context.template_est_customer.AddAsync(templateEstCustomer);
                    }
                    else if (ObjectAction.CANCEL.EqualsIgnore(cus.action))
                    {
                        if (string.IsNullOrEmpty(cus.guid))
                            throw new GraphQLException(new Error($"Template_estimate_customer guid cannot null or empty for cancel", "ERROR"));

                        var customer = templateEst.template_est_customer.FirstOrDefault(c => c.guid == cus.guid); //cus;//new template_est_customer() { guid = cus.guid };
                        //context.Attach(customer);
                        if (customer != null)
                        {
                            customer.update_dt = currentDateTime;
                            customer.delete_dt = currentDateTime;
                            customer.update_by = user;
                            //context.Update(customer);
                        }
                    }
                }
                //context.AddRangeAsync(tempEstCustomerList);
            }
            catch (Exception ex)
            {
                throw; //new GraphQLException(new Error(ex.Message, "ERROR"));
            }
        }

        private async Task UpdateRepairDamageCode(ApplicationMasterDBContext context, string user, long currentDateTime,
                                            template_est_part estPart, IEnumerable<tep_damage_repair>? tepDamageRepair = null)
        {
            try
            {
                if (estPart.tep_damage_repair != null)
                {
                    foreach (var item in estPart.tep_damage_repair)
                    {

                        //if (string.IsNullOrEmpty(item.action) && !string.IsNullOrEmpty(item.guid))
                        //   throw new GraphQLException(new Error($"Tep_damage_repair action cannot be null for update", "ERROR"));

                        if (string.IsNullOrEmpty(item.action))
                            continue;

                        if (string.IsNullOrEmpty(item.guid) && (ObjectAction.NEW.EqualsIgnore(item.action) || string.IsNullOrEmpty(item.action)))
                        {
                            var tepDamage = item;//new tep_damage_repair();
                            tepDamage.guid = Util.GenerateGUID();
                            tepDamage.create_by = user;
                            tepDamage.create_dt = currentDateTime;

                            tepDamage.tep_guid = estPart.guid;
                            tepDamage.code_type = item.code_type;
                            tepDamage.code_cv = item.code_cv;
                            await context.tep_damage_repair.AddAsync(tepDamage);
                            continue;
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Template_part_damage_repair guid cannot null or empty for update", "ERROR"));

                            //var tepDamage = new tep_damage_repair() { guid = item.guid };
                            var tepDamage = tepDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            //context.Attach(tepDamage);
                            if (tepDamage != null)
                            {
                                tepDamage.update_dt = currentDateTime;
                                tepDamage.update_by = user;
                                tepDamage.code_cv = item.code_cv;
                                tepDamage.code_type = item.code_type;
                                //await context.AddAsync(tepDamage)
                            }
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                        {
                            if (string.IsNullOrEmpty(item.guid))
                                throw new GraphQLException(new Error($"Template_part_damage_repair guid cannot null or empty for cancel", "ERROR"));

                            //var tepDamage = new tep_damage_repair() { guid = item.guid };
                            //context.Attach(tepDamage);
                            var tepDamage = tepDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();
                            if (tepDamage != null)
                            {
                                tepDamage.delete_dt = currentDateTime;
                                tepDamage.update_by = user;
                                tepDamage.update_dt = currentDateTime;
                            }
                            continue;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                throw;
            }
        }
        #endregion
    }
}
