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
                newTariffClean.alias = NewTariffClean.alias;
               // newTariffClean.cost = NewTariffClean.cost;
                newTariffClean.cargo = NewTariffClean.cargo;
                newTariffClean.un_no = NewTariffClean.un_no;
                newTariffClean.cleaning_category_guid = NewTariffClean.cleaning_category_guid;
                newTariffClean.cleaning_method_guid = NewTariffClean.cleaning_method_guid;
                newTariffClean.ban_type_cv = NewTariffClean.ban_type_cv;
                newTariffClean.class_cv = NewTariffClean.class_cv;
                newTariffClean.class_child_cv = NewTariffClean.class_child_cv;
                //  newTariffClean.cost_type_cv = NewTariffClean.cost_type_cv;
                newTariffClean.depot_note = NewTariffClean.depot_note;
                newTariffClean.flash_point = NewTariffClean.flash_point;
                newTariffClean.hazard_level_cv = NewTariffClean.hazard_level_cv;
                newTariffClean.nature_cv = NewTariffClean.nature_cv;
                newTariffClean.open_on_gate_cv = NewTariffClean.open_on_gate_cv;
             //   newTariffClean.rebate_type_cv = NewTariffClean.rebate_type_cv;
                newTariffClean.alias = NewTariffClean.alias;
                newTariffClean.in_gate_alert = NewTariffClean.in_gate_alert;
                newTariffClean.remarks = NewTariffClean.remarks;

                newTariffClean.create_by = uid;
                newTariffClean.create_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_cleaning.Add(newTariffClean);
               
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
                var dbTariffClean = context.tariff_cleaning.Find(guid);
                if(dbTariffClean == null)
                {
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }
                dbTariffClean.description = UpdateTariffClean.description;
                dbTariffClean.cargo = UpdateTariffClean.cargo;
                dbTariffClean.un_no = UpdateTariffClean.un_no;
                dbTariffClean.cleaning_category_guid = UpdateTariffClean.cleaning_category_guid;
                dbTariffClean.cleaning_method_guid = UpdateTariffClean.cleaning_method_guid;
                dbTariffClean.ban_type_cv = UpdateTariffClean.ban_type_cv;
                dbTariffClean.class_cv = UpdateTariffClean.class_cv;
                dbTariffClean.class_child_cv = UpdateTariffClean.class_child_cv;
                dbTariffClean.depot_note = UpdateTariffClean.depot_note;
                dbTariffClean.flash_point = UpdateTariffClean.flash_point;
                dbTariffClean.hazard_level_cv = UpdateTariffClean.hazard_level_cv;
                dbTariffClean.nature_cv = UpdateTariffClean.nature_cv;
                dbTariffClean.open_on_gate_cv = UpdateTariffClean.open_on_gate_cv;
                dbTariffClean.alias = UpdateTariffClean.alias;
                dbTariffClean.in_gate_alert = UpdateTariffClean.in_gate_alert;
                dbTariffClean.remarks = UpdateTariffClean.remarks;
                dbTariffClean.update_by = uid;
                dbTariffClean.update_dt = GqlUtils.GetNowEpochInSec();
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
