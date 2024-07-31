using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography;
using System.Text;
using System.Threading.Tasks;
using static System.Net.Mime.MediaTypeNames;

namespace IDMS.Models.Tariff.Depot.GqlTypes
{
    public class TariffDepot_MutationType
    {
       
        public async Task<int> AddTariffCleaningDepot([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, tariff_depot NewTariffDepot)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffDepot.guid = (string.IsNullOrEmpty(NewTariffDepot.guid) ? Util.GenerateGUID() : NewTariffDepot.guid);
                var newTariffDepot = new tariff_depot();
                newTariffDepot.guid = NewTariffDepot.guid;
                newTariffDepot.description = NewTariffDepot.description;
                newTariffDepot.profile_name = NewTariffDepot.profile_name;
                // newTariffClean.cost = NewTariffClean.cost;
                newTariffDepot.preinspection_cost = NewTariffDepot.preinspection_cost;
                newTariffDepot.lolo_cost = NewTariffDepot.lolo_cost;
                newTariffDepot.storage_cost = NewTariffDepot.storage_cost;
                newTariffDepot.free_storage_days = NewTariffDepot.free_storage_days;
                newTariffDepot.gate_charges = NewTariffDepot.gate_charges;
                newTariffDepot.unit_type_cv = NewTariffDepot.unit_type_cv;


                newTariffDepot.create_by = uid;
                newTariffDepot.create_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_depot.Add(newTariffDepot);

                var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                foreach (var customerCompany in customerCompanies)
                {
                    //var customerCom_CleanCat = new customer_company_cleaning_category();
                    //customerCom_CleanCat.guid = Util.GenerateGUID();
                    //customerCom_CleanCat.adjusted_price = newCleanCategory.cost;
                    //customerCom_CleanCat.initial_price = newCleanCategory.cost;
                    //customerCom_CleanCat.customer_company_guid = customerCompany.guid;
                    //customerCom_CleanCat.cleaning_category_guid = newCleanCategory.guid;
                    //customerCom_CleanCat.create_by = uid;
                    //customerCom_CleanCat.create_dt = GqlUtils.GetNowEpochInSec();
                    //context.customer_company_cleaning_category.Add(customerCom_CleanCat);
                }
                //context.cleaning_category.Add(newCleanCategory);
                retval =context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

       
        public async Task<int> UpdateTariffCleaDepot([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, tariff_depot UpdateTariffDepot)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffDepot.guid;
                var dbTariffDepot = context.tariff_depot.Find(guid);
                if(dbTariffDepot == null)
                {
                    throw new GraphQLException(new Error("The Depot Cost not found", "500"));
                }
                dbTariffDepot.description = UpdateTariffDepot.description;
                dbTariffDepot.profile_name = UpdateTariffDepot.profile_name;
                // newTariffClean.cost = NewTariffClean.cost;
                dbTariffDepot.preinspection_cost = UpdateTariffDepot.preinspection_cost;
                dbTariffDepot.lolo_cost = UpdateTariffDepot.lolo_cost;
                dbTariffDepot.storage_cost = UpdateTariffDepot.storage_cost;
                dbTariffDepot.free_storage_days = UpdateTariffDepot.free_storage_days;
                dbTariffDepot.gate_charges = UpdateTariffDepot.gate_charges;
                dbTariffDepot.unit_type_cv = UpdateTariffDepot.unit_type_cv;
                dbTariffDepot.update_by = uid;
                dbTariffDepot.update_dt = GqlUtils.GetNowEpochInSec();
                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffDepot([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffDepot_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = context.tariff_depot.Where(s => DeleteTariffDepot_guids.Contains(s.guid) && s.delete_dt == null);
              

                foreach(var delTariffClean in delTariffCleans)
                {
                    delTariffClean.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffClean.update_by = uid;
                    delTariffClean.update_dt = GqlUtils.GetNowEpochInSec();
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
    }

}
