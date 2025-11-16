using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Master;
using IDMS.Models.Master.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static IDMS.EstimateTemplate.GqlTypes.LocalModel.StatusConstant;
using Microsoft.Extensions.Logging;

namespace IDMS.EstimateTemplate.GqlTypes
{
    public class TemplateEstMutation
    {
        private readonly ILogger<TemplateEstMutation> _logger;
        const string graphqlErrorCode = "ERROR";

        public TemplateEstMutation(ILogger<TemplateEstMutation> logger)
        {
            _logger = logger;
        }

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
                template.update_by = user;
                template.update_dt = currentDateTime;

                template.template_name = newTemplateEstimate.template_name;
                template.type_cv = newTemplateEstimate.type_cv;
                template.labour_cost_discount = newTemplateEstimate.labour_cost_discount;
                template.material_cost_discount = newTemplateEstimate.material_cost_discount;
                template.remarks = newTemplateEstimate.remarks;

                _logger.LogInformation("Adding template_est with GUID {Guid}, type {Type}", template.guid, template.type_cv);
                await context.template_est.AddAsync(template);

                if (TemplateType.EXCLUSIVE.EqualsIgnore(newTemplateEstimate.type_cv))
                {
                    if (newTemplateEstimate.template_est_customer == null)
                    {
                        _logger.LogWarning("Template_estimate_customer object cannot be null");
                        throw new GraphQLException(new Error($"Template_estimate_customer object cannot be null", "ERROR"));
                    }

                     await UpdateCustomer(context, newTemplateEstimate.template_est_customer, user, currentDateTime, template);
                }

                IList<template_est_part> partList = new List<template_est_part>();
                foreach (var newPart in newTemplateEstimate.template_est_part)
                {
                    newPart.guid = Util.GenerateGUID();
                    newPart.create_by = user;
                    newPart.create_dt = currentDateTime;
                    newPart.update_by = user;
                    newPart.update_dt = currentDateTime;
                    newPart.template_est_guid = template.guid;
                    partList.Add(newPart);

                    _logger.LogInformation("Prepared template_est_part GUID {Guid} for template {TemplateGuid}", newPart.guid, template.guid);
                    await UpdateRepairDamageCode(context, user, currentDateTime, newPart);
                }

                if (partList.Count > 0)
                    await context.template_est_part.AddRangeAsync(partList);

                var res = await context.SaveChangesAsync();

                _logger.LogInformation("AddTemplateEstimation completed by {User}. Template GUID {Guid}. Changes saved: {Changes}", user, template.guid, res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddTemplateEstimation: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
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
                {
                    _logger.LogWarning("Template_estimate not found for GUID {Guid}", editTemplateEsimate.guid);
                    throw new GraphQLException(new Error($"Template_estimate not found", "ERROR"));
                }

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
                            newEstPart.update_by = user;
                            newEstPart.update_dt = currentDateTime;
                            newEstPart.template_est_guid = template.guid;

                            _logger.LogInformation("Adding new template_est_part GUID {Guid} to template {TemplateGuid}", newEstPart.guid, template.guid);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part);
                            await context.template_est_part.AddAsync(newEstPart);
                            continue;
                        }

                        var existingPart = template.template_est_part?.Where(p => p.guid == part.guid && (p.delete_dt == null || p.delete_dt == 0)).FirstOrDefault();
                        if (existingPart == null)
                        {
                            _logger.LogWarning("Template part not found for update: {PartGuid}", part.guid);
                            throw new GraphQLException(new Error($"Template_part guid used for update cannot be null or empty", "ERROR"));
                        }

                        if (ObjectAction.EDIT.EqualsIgnore(part.action))
                        {
                            existingPart.update_by = user;
                            existingPart.update_dt = currentDateTime;
                            existingPart.quantity = part.quantity;
                            existingPart.location_cv = part.location_cv;
                            existingPart.description = part.description; 
                            existingPart.hour = part.hour;
                            existingPart.remarks = part.remarks;
                            existingPart.comment = part.comment;

                            _logger.LogInformation("Edited template_est_part GUID {Guid}", existingPart.guid);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.tep_damage_repair);
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(part.action))
                        {
                            existingPart.delete_dt = currentDateTime;
                            existingPart.update_dt = currentDateTime;
                            existingPart.update_by = user;

                            _logger.LogInformation("Cancelled template_est_part GUID {Guid}", existingPart.guid);
                            await UpdateRepairDamageCode(context, user, currentDateTime, part, existingPart.tep_damage_repair);
                            continue;
                        }
                    }
                }

                if (TemplateType.EXCLUSIVE.EqualsIgnore(editTemplateEsimate.type_cv))
                {
                    if (editTemplateEsimate.template_est_customer == null)
                    {
                        _logger.LogWarning("Template_customer object cannot be null");
                        throw new GraphQLException(new Error($"Template_customer object cannot be null", "ERROR"));
                    }

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
                    _logger.LogInformation("Soft-deleted {Count} template_est_customer(s) due to template type change to GENERAL", template.template_est_customer?.Count() ?? 0);
                }

                var res = await context.SaveChangesAsync();

                _logger.LogInformation("UpdateTemplateEstimation completed by {User} for GUID {Guid}. Changes saved: {Changes}", user, template.guid, res);
                return res;

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateTemplateEstimation: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
        }


        public async Task<int> DeleteTemplateEstimation(ApplicationMasterDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, string templateEsimateGuid)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (string.IsNullOrWhiteSpace(templateEsimateGuid))
                {
                    _logger.LogWarning("Templete estimate guid cannot be null or empty");
                    throw new GraphQLException(new Error($"Templete estimate guid cannot be null or empty", "ERROR"));
                }

                var deleteTemplete = new template_est() { guid = templateEsimateGuid };
                context.template_est.Attach(deleteTemplete);

                deleteTemplete.delete_dt = currentDateTime;
                deleteTemplete.update_by = user;
                deleteTemplete.update_dt = currentDateTime;

                var res = await context.SaveChangesAsync();

                _logger.LogInformation("DeleteTemplateEstimation completed by {User} for GUID {Guid}. Changes saved: {Changes}", user, templateEsimateGuid, res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteTemplateEstimation: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
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

                    if (ObjectAction.NEW.EqualsIgnore(cus.action) || (string.IsNullOrEmpty(cus.action) && string.IsNullOrEmpty(cus.guid)))
                    {
                        if (string.IsNullOrEmpty(cus.customer_company_guid))
                        {
                            _logger.LogWarning("Customer_company guid cannot null or empty");
                            throw new GraphQLException(new Error($"Customer_company guid cannot null or empty", "ERROR"));
                        }

                        var templateEstCustomer = cus;
                        templateEstCustomer.guid = Util.GenerateGUID();
                        templateEstCustomer.create_by = user;
                        templateEstCustomer.create_dt = currentDateTime;
                        templateEstCustomer.update_by = user;
                        templateEstCustomer.update_dt = currentDateTime;

                        templateEstCustomer.template_est_guid = templateEst.guid;
                        templateEstCustomer.customer_company_guid = cus.customer_company_guid;
                        await context.template_est_customer.AddAsync(templateEstCustomer);

                        _logger.LogInformation("Added template_est_customer GUID {Guid} for template {TemplateGuid}", templateEstCustomer.guid, templateEst.guid);
                    }
                    else if (ObjectAction.CANCEL.EqualsIgnore(cus.action))
                    {
                        if (string.IsNullOrEmpty(cus.guid))
                        {
                            _logger.LogWarning("Template_estimate_customer guid cannot null or empty for cancel");
                            throw new GraphQLException(new Error($"Template_estimate_customer guid cannot null or empty for cancel", "ERROR"));
                        }

                        var customer = templateEst.template_est_customer.FirstOrDefault(c => c.guid == cus.guid);
                        if (customer != null)
                        {
                            customer.update_dt = currentDateTime;
                            customer.delete_dt = currentDateTime;
                            customer.update_by = user;
                            _logger.LogInformation("Cancelled template_est_customer GUID {Guid} for template {TemplateGuid}", customer.guid, templateEst.guid);
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCustomer for template {TemplateGuid}: {Message}", templateEst.guid, ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
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
                        if (string.IsNullOrEmpty(item.action))
                            continue;

                        if (string.IsNullOrEmpty(item.guid) && (ObjectAction.NEW.EqualsIgnore(item.action) || string.IsNullOrEmpty(item.action)))
                        {
                            var newTepDamage = item;
                            newTepDamage.guid = Util.GenerateGUID();
                            newTepDamage.create_by = user;
                            newTepDamage.create_dt = currentDateTime;
                            newTepDamage.update_by = user;
                            newTepDamage.update_dt = currentDateTime;

                            newTepDamage.tep_guid = estPart.guid;
                            newTepDamage.code_type = item.code_type;
                            newTepDamage.code_cv = item.code_cv;
                            await context.tep_damage_repair.AddAsync(newTepDamage);

                            _logger.LogInformation("Added new tep_damage_repair GUID {Guid} for part {PartGuid}", newTepDamage.guid, estPart.guid);
                            continue;
                        }

                        if (string.IsNullOrEmpty(item.guid))
                        {
                            _logger.LogWarning("Template_part_damage_repair guid cannot null or empty for update");
                            throw new GraphQLException(new Error($"Template_part_damage_repair guid cannot null or empty for update", "ERROR"));
                        }
                            
                        var tepDamage = tepDamageRepair?.Where(t => t.guid == item.guid).FirstOrDefault();

                        if (ObjectAction.EDIT.EqualsIgnore(item.action))
                        {
                            if (tepDamage != null)
                            {
                                tepDamage.update_dt = currentDateTime;
                                tepDamage.update_by = user;
                                tepDamage.code_cv = item.code_cv;
                                tepDamage.code_type = item.code_type;
                                _logger.LogInformation("Edited tep_damage_repair GUID {Guid}", tepDamage.guid);
                            }
                            continue;
                        }

                        if (ObjectAction.CANCEL.EqualsIgnore(item.action))
                        {
                            if (tepDamage != null)
                            {
                                tepDamage.delete_dt = currentDateTime;
                                tepDamage.update_by = user;
                                tepDamage.update_dt = currentDateTime;
                                _logger.LogInformation("Cancelled tep_damage_repair GUID {Guid}", tepDamage.guid);
                            }
                            continue;
                        }

                        if (ObjectAction.ROLLBACK.EqualsIgnore(item.action))
                        {
                            if (tepDamage != null)
                            {
                                tepDamage.delete_dt = null;
                                tepDamage.update_by = user;
                                tepDamage.update_dt = currentDateTime;
                                _logger.LogInformation("Rolled back tep_damage_repair GUID {Guid}", tepDamage.guid);
                            }
                            continue;
                        }

                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateRepairDamageCode for part {PartGuid}: {Message}", estPart?.guid, ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
        }
        #endregion
    }
}
