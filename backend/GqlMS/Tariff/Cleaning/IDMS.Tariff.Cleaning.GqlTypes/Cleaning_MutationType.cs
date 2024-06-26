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

namespace IDMS.Models.Tariff.Cleaning.GqlTypes
{
    public class TariffCleanning_MutationType
    {
       
        public async Task<int> AddTariffCleaning([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_TariffCleaning NewTariffClean)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffClean.guid = (string.IsNullOrEmpty(NewTariffClean.guid) ? Util.GenerateGUID() : NewTariffClean.guid);
                var newTariffClean = new EntityClass_TariffCleaning();
                newTariffClean.guid = NewTariffClean.guid;
                newTariffClean.description = NewTariffClean.description;
                newTariffClean.cost = NewTariffClean.cost;
                newTariffClean.cargo_name = NewTariffClean.cargo_name;
                newTariffClean.un_no = NewTariffClean.un_no;
                newTariffClean.cleaning_method_guid = NewTariffClean.cleaning_method_guid;
                newTariffClean.ban_type_cv = NewTariffClean.ban_type_cv;
                newTariffClean.class_no_cv = NewTariffClean.class_no_cv;
                newTariffClean.cost_type_cv = NewTariffClean.cost_type_cv;
                newTariffClean.depot_note = NewTariffClean.depot_note;
                newTariffClean.flash_point = NewTariffClean.flash_point;
                newTariffClean.hazard_level_cv = NewTariffClean.hazard_level_cv;
                newTariffClean.nature_cv = NewTariffClean.nature_cv;
                newTariffClean.open_on_gate_cv = NewTariffClean.open_on_gate_cv;
                newTariffClean.rebate_type_cv = NewTariffClean.rebate_type_cv;
                newTariffClean.alias_name = NewTariffClean.alias_name;
                newTariffClean.in_gate_alert = NewTariffClean.in_gate_alert;
                newTariffClean.remarks = NewTariffClean.remarks;

                newTariffClean.create_by = uid;
                newTariffClean.create_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_cleaning.Add(newTariffClean);

                var customercompanies = context.customer_company.Where(i => i.delete_dt == null || i.delete_dt == 0);

                foreach(var company in customercompanies)
                {
                    var customercompany_tariffcleaning = new EntityClass_CustomerCompany_TariffCleaning();
                    customercompany_tariffcleaning.guid = Util.GenerateGUID();
                    customercompany_tariffcleaning.tariff_cleaning_guid = NewTariffClean.guid;
                    customercompany_tariffcleaning.initial_price = newTariffClean.cost;
                    customercompany_tariffcleaning.adjusted_price = newTariffClean.cost;
                    customercompany_tariffcleaning.remarks= newTariffClean.remarks;
                    customercompany_tariffcleaning.customer_company_guid=company.guid;
                    customercompany_tariffcleaning.create_by = uid;
                    customercompany_tariffcleaning.create_dt= GqlUtils.GetNowEpochInSec();
                    context.customer_company_tariff_cleaning.Add(customercompany_tariffcleaning);
                }
                
               
              retval=context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

       
        public async Task<int> UpdateTariffClean([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, EntityClass_TariffCleaning UpdateTariffClean)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffClean.guid;
                var dbTarrifClean = context.tariff_cleaning.Find(guid);
                if(dbTarrifClean == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbTarrifClean.description = UpdateTariffClean.description;
                dbTarrifClean.cost = UpdateTariffClean.cost;
                dbTarrifClean.cargo_name = UpdateTariffClean.cargo_name;
                dbTarrifClean.un_no = UpdateTariffClean.un_no;
                dbTarrifClean.cleaning_method_guid = UpdateTariffClean.cleaning_method_guid;
                dbTarrifClean.ban_type_cv = UpdateTariffClean.ban_type_cv;
                dbTarrifClean.class_no_cv = UpdateTariffClean.class_no_cv;
                dbTarrifClean.cost_type_cv = UpdateTariffClean.cost_type_cv;
                dbTarrifClean.depot_note = UpdateTariffClean.depot_note;
                dbTarrifClean.flash_point = UpdateTariffClean.flash_point;
                dbTarrifClean.hazard_level_cv = UpdateTariffClean.hazard_level_cv;
                dbTarrifClean.nature_cv = UpdateTariffClean.nature_cv;
                dbTarrifClean.open_on_gate_cv = UpdateTariffClean.open_on_gate_cv;
                dbTarrifClean.rebate_type_cv = UpdateTariffClean.rebate_type_cv;
                dbTarrifClean.alias_name = UpdateTariffClean.alias_name;
                dbTarrifClean.in_gate_alert = UpdateTariffClean.in_gate_alert;
                dbTarrifClean.remarks = UpdateTariffClean.remarks;

                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffClean([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffClean_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = context.tariff_cleaning.Where(s => DeleteTariffClean_guids.Contains(s.guid) && s.delete_dt == null);
              

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
