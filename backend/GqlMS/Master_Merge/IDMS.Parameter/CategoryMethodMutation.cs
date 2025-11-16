using CommonUtil.Core.Service;
using IDMS.EstimateTemplate.GqlTypes;
using IDMS.Models.Master.GqlTypes.DB;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using static IDMS.Parameter.GqlTypes.StatusConstant;

namespace IDMS.Models.Parameter.GqlTypes
{
    [ExtendObjectType(typeof(TemplateEstMutation))]
    public class CleanningMethodMutation
    {
        private readonly ILogger<CleanningMethodMutation> _logger;
        const string graphqlErrorCode = "ERROR";

        public CleanningMethodMutation(ILogger<CleanningMethodMutation> logger)
        {
            _logger = logger;
        }

        #region Cleaning Methods
        public async Task<int> AddCleaningMethod(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_method NewCleanMethod)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                NewCleanMethod.guid = (string.IsNullOrEmpty(NewCleanMethod.guid) ? Util.GenerateGUID() : NewCleanMethod.guid);
                var maxSequence = context.cleaning_method.Max(cm => cm.sequence);

                var newCleanMthd = new cleaning_method();
                newCleanMthd.guid = NewCleanMethod.guid;
                newCleanMthd.category_guid = NewCleanMethod.category_guid;
                newCleanMthd.description = NewCleanMethod.description;
                newCleanMthd.name = NewCleanMethod.name;
                newCleanMthd.sequence = (maxSequence ?? 0) + 1;
                newCleanMthd.create_by = uid;
                newCleanMthd.create_dt = currentDateTime;
                newCleanMthd.update_by = uid;
                newCleanMthd.update_dt = currentDateTime;

                //Cleaning formula handling
                foreach (var item in NewCleanMethod.cleaning_method_formula)
                {
                    if (item != null)
                    {
                        item.guid = Util.GenerateGUID();
                        item.method_guid = newCleanMthd.guid;
                        item.create_by = uid;
                        item.create_dt = currentDateTime;
                        item.update_by = uid;
                        item.update_dt = currentDateTime;

                        _logger.LogInformation("Adding cleaning_method_formula GUID {Guid} for method {MethodGuid}", item.guid, item.method_guid);
                        await context.cleaning_method_formula.AddAsync(item);
                    }
                }

                await context.AddAsync(newCleanMthd);
                retval = await context.SaveChangesAsync();

                _logger.LogInformation("AddCleaningMethod completed by {User}. Saved {Changes} change(s). Method GUID: {Guid}", uid, retval, newCleanMthd.guid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddCleaningMethod: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }

            return retval;
        }


        public async Task<int> UpdateCleaningMethod(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_method UpdateCleanMethod)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var curMethodGuid = UpdateCleanMethod.guid;
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                cleaning_method dbCleanMethod = await context.cleaning_method.Where(c => c.guid == UpdateCleanMethod.guid).Include(c => c.cleaning_method_formula).FirstOrDefaultAsync();

                if (dbCleanMethod == null)
                {
                    _logger.LogWarning("UpdateCleaningMethod could not find cleaning_method with GUID {Guid}", UpdateCleanMethod?.guid);
                    throw new GraphQLException(new Error($"Cleaning method not found", "ERROR"));
                }

                dbCleanMethod.description = UpdateCleanMethod.description;
                dbCleanMethod.name = UpdateCleanMethod.name;
                dbCleanMethod.category_guid = UpdateCleanMethod.category_guid;
                dbCleanMethod.update_by = user;
                dbCleanMethod.update_dt = currentDateTime;

                foreach (var item in UpdateCleanMethod.cleaning_method_formula)
                {
                    if (item.action.EqualsIgnore(ObjectAction.NEW))
                    {
                        var newCMF = new cleaning_method_formula();
                        newCMF.guid = Util.GenerateGUID();
                        newCMF.method_guid = curMethodGuid;
                        newCMF.formula_guid = item.formula_guid;
                        newCMF.sequence = item.sequence;
                        newCMF.create_by = user;
                        newCMF.create_dt = currentDateTime;
                        newCMF.update_by = user;
                        newCMF.update_dt = currentDateTime;

                        _logger.LogInformation("Adding new cleaning_method_formula GUID {Guid} for method {MethodGuid}", newCMF.guid, curMethodGuid);
                        await context.cleaning_method_formula.AddAsync(newCMF);
                    }

                    if (item.action.EqualsIgnore(ObjectAction.EDIT))
                    {
                        var updateCMF = dbCleanMethod.cleaning_method_formula.Where(c => c.method_guid == curMethodGuid && c.formula_guid == item.formula_guid).FirstOrDefault();
                        if (updateCMF != null)
                        {
                            updateCMF.sequence = item.sequence;
                            updateCMF.update_by = user;
                            updateCMF.update_dt = currentDateTime;
                            _logger.LogInformation("Edited cleaning_method_formula GUID {Guid} sequence set to {Seq}", updateCMF.guid, updateCMF.sequence);
                        }
                        else
                        {
                            _logger.LogWarning("EDIT action: cleaning_method_formula not found for method {MethodGuid} and formula {FormulaGuid}", curMethodGuid, item.formula_guid);
                        }
                    }

                    if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                    {
                        var updateCMF = dbCleanMethod.cleaning_method_formula.Where(c => c.method_guid == curMethodGuid && c.formula_guid == item.formula_guid).FirstOrDefault();
                        if (updateCMF != null)
                        {
                            updateCMF.delete_dt = currentDateTime;
                            updateCMF.update_by = user;
                            updateCMF.update_dt = currentDateTime;
                            _logger.LogInformation("Cancelled cleaning_method_formula GUID {Guid}", updateCMF.guid);
                        }
                        else
                        {
                            _logger.LogWarning("CANCEL action: cleaning_method_formula not found for method {MethodGuid} and formula {FormulaGuid}", curMethodGuid, item.formula_guid);
                        }
                    }
                }

                retval = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateCleaningMethod completed by {User}. Saved {Changes} change(s) for method {MethodGuid}", user, retval, curMethodGuid);

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCleaningMethod: {Message}", ex.Message);
                throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
            }
            return retval;
        }

        public async Task<int> DeleteCleaningMethod(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            string[] DeleteCleanMethod_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanMethods = context.cleaning_method.Where(s => DeleteCleanMethod_guids.Contains(s.guid) && s.delete_dt == null);

                foreach (var delCleanMethod in delCleanMethods)
                {
                    delCleanMethod.delete_dt = GqlUtils.GetNowEpochInSec();
                    delCleanMethod.update_by = uid;
                    delCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();

                    _logger.LogInformation("Marked cleaning_method GUID {Guid} as deleted", delCleanMethod.guid);
                }
                retval = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteCleaningMethod completed by {User}. Changes saved: {Changes}", uid, retval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCleaningMethod: {Message}", ex.Message);
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        #endregion Cleaning Methods

        #region Cleaning Category
        public async Task<int> AddCleaningCategory(ApplicationMasterDBContext context,
            [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, cleaning_category NewCleanCategory)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanCategory.guid = (string.IsNullOrEmpty(NewCleanCategory.guid) ? Util.GenerateGUID() : NewCleanCategory.guid);
                var newCleanCategory = new cleaning_category();
                newCleanCategory.guid = NewCleanCategory.guid;
                newCleanCategory.description = NewCleanCategory.description;
                newCleanCategory.name = NewCleanCategory.name;
                newCleanCategory.cost = NewCleanCategory.cost;

                newCleanCategory.create_by = uid;
                newCleanCategory.create_dt = GqlUtils.GetNowEpochInSec();
                newCleanCategory.update_by = uid;
                newCleanCategory.update_dt = GqlUtils.GetNowEpochInSec();

                _logger.LogInformation("Adding cleaning_category GUID {Guid} name {Name}", newCleanCategory.guid, newCleanCategory.name);
                await context.cleaning_category.AddAsync(newCleanCategory);
                retval = await context.SaveChangesAsync();

                _logger.LogInformation("AddCleaningCategory completed by {User}. Saved {Changes} change(s). Category GUID: {Guid}", uid, retval, newCleanCategory.guid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddCleaningCategory: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }


        public async Task<int> UpdateCleaningCategory(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_category UpdateCleanCategory)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var dbCleanCategory = new cleaning_category() { guid = UpdateCleanCategory.guid };
                context.Attach(dbCleanCategory);

                dbCleanCategory.description = UpdateCleanCategory.description;
                dbCleanCategory.name = UpdateCleanCategory.name;
                dbCleanCategory.cost = UpdateCleanCategory.cost;
                dbCleanCategory.update_by = uid;
                dbCleanCategory.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

                _logger.LogInformation("UpdateCleaningCategory completed by {User}. Saved {Changes} change(s). Category GUID: {Guid}", uid, retval, UpdateCleanCategory.guid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCleaningCategory: {Message}", ex.Message);
                throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
            }
            return retval;
        }

        public async Task<int> DeleteCleaningCategory(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanCategory_guids)
        {
            int retval = 0;
            try
            {
                //var context = _contextFactory.CreateDbContext();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanCategories = context.cleaning_category.Where(s => DeleteCleanCategory_guids.Contains(s.guid) && s.delete_dt == null);


                foreach (var delCleanCategory in delCleanCategories)
                {
                    delCleanCategory.delete_dt = GqlUtils.GetNowEpochInSec();
                    delCleanCategory.update_by = uid;
                    delCleanCategory.update_dt = GqlUtils.GetNowEpochInSec();

                    _logger.LogInformation("Marked cleaning_category GUID {Guid} as deleted", delCleanCategory.guid);
                }
                retval = await context.SaveChangesAsync();

                _logger.LogInformation("DeleteCleaningCategory completed by {User}. Saved {Changes} change(s).", uid, retval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCleaningCategory: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> SyncUpCustomerCompaniesWithCleaningCategories(ApplicationMasterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var queryCats = context.cleaning_category.Where(c => c.delete_dt == null || c.delete_dt == 0).ToArray();
                var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();

                foreach (var cat in queryCats)
                {
                    foreach (var cc in customerCompanies)
                    {
                        var category_guid = cat.guid;
                        var customerComp_guid = cc.guid;

                        var category_custComp = context.customer_company_cleaning_category.Where(c => c.customer_company_guid == customerComp_guid && c.cleaning_category_guid == category_guid).FirstOrDefault();
                        if (category_custComp == null)
                        {
                            var customerCom_CleanCat = new customer_company_cleaning_category();
                            customerCom_CleanCat.guid = Util.GenerateGUID();
                            customerCom_CleanCat.adjusted_price = cat.cost;
                            customerCom_CleanCat.initial_price = cat.cost;
                            customerCom_CleanCat.customer_company_guid = cc.guid;
                            customerCom_CleanCat.cleaning_category_guid = cat.guid;
                            customerCom_CleanCat.create_by = uid;
                            customerCom_CleanCat.create_dt = GqlUtils.GetNowEpochInSec();
                            context.customer_company_cleaning_category.Add(customerCom_CleanCat);

                            _logger.LogInformation("Added customer_company_cleaning_category GUID {Guid} for customer {CustomerGuid} category {CategoryGuid}", customerCom_CleanCat.guid, cc.guid, cat.guid);
                        }
                    }
                }
                retval = context.SaveChanges();
                _logger.LogInformation("SyncUpCustomerCompaniesWithCleaningCategories completed by {User}. Saved {Changes} change(s).", uid, retval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in SyncUpCustomerCompaniesWithCleaningCategories: {Message}", ex.Message);
                throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
            }
            return retval;

        }


        #endregion Cleaning Category

        #region cleaning_formula
        public async Task<int> AddCleaningFormula(ApplicationMasterDBContext context, [Service] IConfiguration config,
             [Service] IHttpContextAccessor httpContextAccessor, cleaning_formula NewCleanFormula)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanFormula.guid = (string.IsNullOrEmpty(NewCleanFormula.guid) ? Util.GenerateGUID() : NewCleanFormula.guid);

                var newCleanFormula = new cleaning_formula();
                newCleanFormula.guid = NewCleanFormula.guid;
                newCleanFormula.description = NewCleanFormula.description;
                newCleanFormula.duration = NewCleanFormula.duration;
                newCleanFormula.create_by = uid;
                newCleanFormula.create_dt = GqlUtils.GetNowEpochInSec();
                newCleanFormula.update_by = uid;
                newCleanFormula.update_dt = GqlUtils.GetNowEpochInSec();

                _logger.LogInformation("Adding cleaning_formula GUID {Guid}", newCleanFormula.guid);
                await context.cleaning_formula.AddAsync(newCleanFormula);
                retval = await context.SaveChangesAsync();

                _logger.LogInformation("AddCleaningFormula completed by {User}. Saved {Changes} change(s). Formula GUID: {Guid}", uid, retval, newCleanFormula.guid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddCleaningFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> UpdateCleaningFormula(ApplicationMasterDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, cleaning_formula UpdateCleanFormula)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanFormula.guid;
                var dbCleanFormula = context.cleaning_formula.Find(guid);
                if (dbCleanFormula == null)
                {
                    _logger.LogWarning("UpdateCleaningFormula could not find cleaning_formula with GUID {Guid}", guid);
                    throw new GraphQLException(new Error("The Cleaning Formula not found", "NOT FOUND"));
                }
                dbCleanFormula.description = UpdateCleanFormula.description;
                dbCleanFormula.duration = UpdateCleanFormula.duration;
                dbCleanFormula.update_by = uid;
                dbCleanFormula.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateCleaningFormula completed by {User}. Saved {Changes} change(s). Formula GUID: {Guid}", uid, retval, guid);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateCleaningFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> DeleteCleaningFormula(ApplicationMasterDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanFormula_guids)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanFormulas = context.cleaning_formula.Where(s => DeleteCleanFormula_guids.Contains(s.guid) && s.delete_dt == null);

                foreach (var delCleanMethod in delCleanFormulas)
                {
                    delCleanMethod.delete_dt = currentDateTime;
                    delCleanMethod.update_by = uid;
                    delCleanMethod.update_dt = currentDateTime;

                    _logger.LogInformation("Marked cleaning_formula GUID {Guid} as deleted", delCleanMethod.guid);
                }
                retval = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteCleaningFormula completed by {User}. Saved {Changes} change(s).", uid, retval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCleaningFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        #endregion

        #region cleaning_method_formula


        public async Task<int> DeleteCleaningMethodFormula(ApplicationMasterDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanMethodFormula_guids)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delCleanMethodFormulas = context.cleaning_method_formula.Where(s => DeleteCleanMethodFormula_guids.Contains(s.guid) && s.delete_dt == null);

                foreach (var delCleanMethodForm in delCleanMethodFormulas)
                {
                    delCleanMethodForm.delete_dt = currentDateTime;
                    delCleanMethodForm.update_by = uid;
                    delCleanMethodForm.update_dt = currentDateTime;

                    _logger.LogInformation("Marked cleaning_method_formula GUID {Guid} as deleted", delCleanMethodForm.guid);
                }
                retval = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteCleaningMethodFormula completed by {User}. Saved {Changes} change(s).", uid, retval);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteCleaningMethodFormula: {Message}", ex.Message);
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }
        #endregion
    }

}
