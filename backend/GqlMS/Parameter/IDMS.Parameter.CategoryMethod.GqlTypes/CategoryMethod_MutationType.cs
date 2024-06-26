using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningMethod.GqlTypes
{
    public class CleanningMethod_MutationType
    {

      

        #region Cleaning Methods
        public async Task<int> AddCleaningMethod(ApplicationParameterDBContext context, 
            [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, 
            EntityClass_CleaningMethod NewCleanMethod)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanMethod.guid = (string.IsNullOrEmpty(NewCleanMethod.guid) ? Util.GenerateGUID() : NewCleanMethod.guid);
                var newCleanMthd = new EntityClass_CleaningMethod();
                newCleanMthd.guid = NewCleanMethod.guid;
                newCleanMthd.description = NewCleanMethod.description;
                newCleanMthd.name = NewCleanMethod.name;
                newCleanMthd.create_by = uid;
                newCleanMthd.create_dt = GqlUtils.GetNowEpochInSec();
               // var context = _contextFactory.CreateDbContext();
                context.cleaning_method.Add(newCleanMthd);
              retval=context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

       
        public async Task<int> UpdateCleaningMethod(ApplicationParameterDBContext context, 
            [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, 
            EntityClass_CleaningMethod UpdateCleanMethod)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanMethod.guid;
               // var context = _contextFactory.CreateDbContext();
                var dbCleanMethod = context.cleaning_method.Find(guid);
                if(dbCleanMethod == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbCleanMethod.description = UpdateCleanMethod.description;
                dbCleanMethod.name = UpdateCleanMethod.name;
                dbCleanMethod.update_by = uid;
                dbCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();
               
                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
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
              //  var context = _contextFactory.CreateDbContext();
                var delCleanMethods = context.cleaning_method.Where(s => DeleteCleanMethod_guids.Contains(s.guid) && s.delete_dt == null);
              

                foreach(var delCleanMethod in delCleanMethods)
                {
                    delCleanMethod.delete_dt = GqlUtils.GetNowEpochInSec();
                    delCleanMethod.update_by = uid;
                    delCleanMethod.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval=context.SaveChanges();
                
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        #endregion Cleaning Methods


        #region Cleaning Category
        public async Task<int> AddCleaningCategory(ApplicationParameterDBContext context, 
            [Service] IConfiguration config,[Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningCategory NewCleanCategory)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewCleanCategory.guid = (string.IsNullOrEmpty(NewCleanCategory.guid) ? Util.GenerateGUID() : NewCleanCategory.guid);
                var newCleanCategory = new EntityClass_CleaningCategory();
                newCleanCategory.guid = NewCleanCategory.guid;
                newCleanCategory.description = NewCleanCategory.description;
                newCleanCategory.name = NewCleanCategory.name;
                newCleanCategory.cost = NewCleanCategory.cost;

                newCleanCategory.create_by = uid;
                newCleanCategory.create_dt = GqlUtils.GetNowEpochInSec();
                //var context = _contextFactory.CreateDbContext();

                var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null);
                foreach(var customerCompany in customerCompanies)
                {
                    var customerCom_CleanCat = new EntityClass_CustomerCompany_CleaningCategory();
                    customerCom_CleanCat.guid = Util.GenerateGUID();
                    customerCom_CleanCat.adjusted_price = newCleanCategory.cost;
                    customerCom_CleanCat.initial_price= newCleanCategory.cost;
                    customerCom_CleanCat.customer_company_guid=customerCompany.guid;
                    customerCom_CleanCat.cleaning_category_guid = newCleanCategory.guid;
                    customerCom_CleanCat.create_by= uid;
                    customerCom_CleanCat.create_dt= GqlUtils.GetNowEpochInSec();
                    context.customer_company_cleaning_category.Add(customerCom_CleanCat);
                }
                context.cleaning_category.Add(newCleanCategory);
                retval = context.SaveChanges();
            }
            catch { throw; }


            return retval;
        }


        public async Task<int> UpdateCleaningCategory( ApplicationParameterDBContext context, 
            [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, 
            EntityClass_CleaningCategory UpdateCleanCategory)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateCleanCategory.guid;
               // var context = _contextFactory.CreateDbContext();
                var dbCleanCategory = context.cleaning_category.Find(guid);
                if (dbCleanCategory == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbCleanCategory.description = UpdateCleanCategory.description;
                dbCleanCategory.name = UpdateCleanCategory.name;
                dbCleanCategory.cost= UpdateCleanCategory.cost;
                dbCleanCategory.update_by = uid;
                dbCleanCategory.update_dt = GqlUtils.GetNowEpochInSec();

                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
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
                throw ex;
            }
            return retval;
        }

        #endregion Cleaning Category
    }

}
