using CommonUtil.Core.Service;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Parameter.GqlTypes.LocalModel;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System.Data.Entity;
using static IDMS.Parameter.GqlTypes.StatusConstant;

namespace IDMS.Models.Parameter.GqlTypes
{
    public class CleanningMethodMutation
    {

        #region Cleaning Methods
        public async Task<int> AddCleaningMethod(ApplicationParameterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_method NewCleanMethod)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanMethod.guid = (string.IsNullOrEmpty(NewCleanMethod.guid) ? Util.GenerateGUID() : NewCleanMethod.guid);
                var newCleanMthd = new cleaning_method();
                newCleanMthd.guid = NewCleanMethod.guid;
                newCleanMthd.description = NewCleanMethod.description;
                newCleanMthd.name = NewCleanMethod.name;
                newCleanMthd.create_by = uid;
                newCleanMthd.create_dt = GqlUtils.GetNowEpochInSec();
                // var context = _contextFactory.CreateDbContext();
                await context.cleaning_method.AddAsync(newCleanMthd);
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }


            return retval;
        }


        public async Task<int> UpdateCleaningMethod(ApplicationParameterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_method UpdateCleanMethod)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanMethod.guid;
                // var context = _contextFactory.CreateDbContext();
                var dbCleanMethod = context.cleaning_method.Find(guid);
                if (dbCleanMethod == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbCleanMethod.description = UpdateCleanMethod.description;
                dbCleanMethod.name = UpdateCleanMethod.name;
                dbCleanMethod.update_by = uid;
                dbCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteCleaningMethod(ApplicationParameterDBContext context,
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
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        #endregion Cleaning Methods


        #region Cleaning Category
        public async Task<int> AddCleaningCategory(ApplicationParameterDBContext context,
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

                await context.cleaning_category.AddAsync(newCleanCategory);
                retval = await context.SaveChangesAsync();

                //Change below code to use trigger
                //var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null);
                //foreach (var customerCompany in customerCompanies)
                //{
                //    var customerCom_CleanCat = new customer_company_cleaning_category();
                //    customerCom_CleanCat.guid = Util.GenerateGUID();
                //    customerCom_CleanCat.adjusted_price = newCleanCategory.cost;
                //    customerCom_CleanCat.initial_price = newCleanCategory.cost;
                //    customerCom_CleanCat.customer_company_guid = customerCompany.guid;
                //    customerCom_CleanCat.cleaning_category_guid = newCleanCategory.guid;
                //    customerCom_CleanCat.create_by = uid;
                //    customerCom_CleanCat.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.customer_company_cleaning_category.Add(customerCom_CleanCat);
                //}
                //context.cleaning_category.Add(newCleanCategory);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }


            return retval;
        }


        public async Task<int> UpdateCleaningCategory(ApplicationParameterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor,
            cleaning_category UpdateCleanCategory)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = UpdateCleanCategory.guid;

                //var dbCleanCategory = context.cleaning_category.Find(guid);
                //if (dbCleanCategory == null)
                //{
                //    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                //}

                var dbCleanCategory = new cleaning_category() { guid = UpdateCleanCategory.guid };
                context.Attach(dbCleanCategory);

                dbCleanCategory.description = UpdateCleanCategory.description;
                dbCleanCategory.name = UpdateCleanCategory.name;
                dbCleanCategory.cost = UpdateCleanCategory.cost;
                dbCleanCategory.update_by = uid;
                dbCleanCategory.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteCleaningCategory(ApplicationParameterDBContext context,
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
                }
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> SyncUpCustomerCompaniesWithCleaningCategories(ApplicationParameterDBContext context,
            [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var queryCats = context.cleaning_category.Where(c => c.delete_dt == null || c.delete_dt == 0).ToArray();
                var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                //var customerCompCategories = context.customer_company_cleaning_category.Where(d => d.delete_dt == null || d.delete_dt == 0);
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
                        }
                    }
                }
                retval = context.SaveChanges();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;

        }


        #endregion Cleaning Category

        #region cleaning_formula

        public async Task<int> AddCleaningFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
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

                await context.cleaning_formula.AddAsync(newCleanFormula);
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> UpdateCleaningFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
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
                    throw new GraphQLException(new Error("The Cleaning Formula not found", "NOT FOUND"));
                }
                dbCleanFormula.description = UpdateCleanFormula.description;
                dbCleanFormula.duration = UpdateCleanFormula.duration;
                dbCleanFormula.update_by = uid;
                dbCleanFormula.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteCleaningFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
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
                }
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        #endregion

        #region cleaning_method_formula
        public async Task<int> AddCleaningMethodFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, CleaningMethodFormulaRequest NewCleanMethodFormula)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                IList<cleaning_method_formula> cleaningMethodFormulaList = new List<cleaning_method_formula>();

                foreach (var item in NewCleanMethodFormula.cleaning_formulas)
                {
                    var newCMF = new cleaning_method_formula();
                    newCMF.guid = Util.GenerateGUID();
                    newCMF.method_guid = NewCleanMethodFormula.method_guid;
                    newCMF.formula_guid = item.formula_guid;
                    newCMF.sequence = item.sequence;
                    newCMF.create_by = user;
                    newCMF.create_dt = currentDateTime;

                    cleaningMethodFormulaList.Add(newCMF);
                }
                if (cleaningMethodFormulaList.Count > 0)
                {
                    await context.cleaning_method_formula.AddRangeAsync(cleaningMethodFormulaList);
                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> UpdateCleaningMethodFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, CleaningMethodFormulaRequest UpdateCleanMethodFormula)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();
                var curMethodGuid = UpdateCleanMethodFormula.method_guid;

                var dbCleanMethodFormula = await context.cleaning_method_formula.Where(c => c.method_guid == curMethodGuid && (c.delete_dt == null || c.delete_dt == 0)).ToListAsync();

                foreach (var item in UpdateCleanMethodFormula.cleaning_formulas)
                {
                    if (item.action.EqualsIgnore(ObjectAction.NEW))
                    {
                        var newCMF = new cleaning_method_formula();
                        newCMF.guid = Util.GenerateGUID();
                        newCMF.method_guid = UpdateCleanMethodFormula.method_guid;
                        newCMF.formula_guid = item.formula_guid;
                        newCMF.sequence = item.sequence;
                        newCMF.create_by = user;
                        newCMF.create_dt = currentDateTime;
                        //await context.cleaning_method_formula.AddAsync(newCMF);
                        dbCleanMethodFormula.Add(newCMF);
                    }

                    if (item.action.EqualsIgnore(ObjectAction.EDIT))
                    {
                        var updateCMF = dbCleanMethodFormula.Where(c => c.method_guid == curMethodGuid && c.formula_guid == item.formula_guid).FirstOrDefault();
                        if (updateCMF != null) 
                        {
                            updateCMF.sequence = item.sequence;
                            updateCMF.update_by = user;
                            updateCMF.update_dt =currentDateTime;
                        }
                    }

                    if (item.action.EqualsIgnore(ObjectAction.CANCEL))
                    {
                        var updateCMF = dbCleanMethodFormula.Where(c => c.method_guid == curMethodGuid && c.formula_guid == item.formula_guid).FirstOrDefault();
                        if (updateCMF != null)
                        {
                            updateCMF.delete_dt = currentDateTime;  
                            updateCMF.update_by = user;
                            updateCMF.update_dt = currentDateTime;
                        }
                    }
                }

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteCleaningMethodFormula(ApplicationParameterDBContext context, [Service] IConfiguration config,
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
                }
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }
        #endregion
    }

}
