using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.DB;
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

namespace IDMS.Models.Package.All.GqlTypes
{
    public class PackageAll_MutationType
    {

        //public async Task<int> AddPackageCleaning([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
        //    [Service] IHttpContextAccessor httpContextAccessor, pack NewTariffClean)
        //{
        //    int retval = 0;
        //    try
        //    {
        //        var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        NewTariffClean.guid = (string.IsNullOrEmpty(NewTariffClean.guid) ? Util.GenerateGUID() : NewTariffClean.guid);
        //        var newTariffClean = new tariff_cleaning();
        //        newTariffClean.guid = NewTariffClean.guid;
        //        newTariffClean.description = NewTariffClean.description;
        //        newTariffClean.alias = NewTariffClean.alias;
        //       // newTariffClean.cost = NewTariffClean.cost;
        //        newTariffClean.cargo = NewTariffClean.cargo;
        //        newTariffClean.un_no = NewTariffClean.un_no;
        //        newTariffClean.cleaning_category_guid = NewTariffClean.cleaning_category_guid;
        //        newTariffClean.cleaning_method_guid = NewTariffClean.cleaning_method_guid;
        //        newTariffClean.ban_type_cv = NewTariffClean.ban_type_cv;
        //        newTariffClean.class_cv = NewTariffClean.class_cv;
        //        //newTariffClean.class_child_cv = NewTariffClean.class_child_cv;
        //        //  newTariffClean.cost_type_cv = NewTariffClean.cost_type_cv;
        //        newTariffClean.depot_note = NewTariffClean.depot_note;
        //        newTariffClean.flash_point = NewTariffClean.flash_point;
        //        newTariffClean.hazard_level_cv = NewTariffClean.hazard_level_cv;
        //        newTariffClean.nature_cv = NewTariffClean.nature_cv;
        //        newTariffClean.open_on_gate_cv = NewTariffClean.open_on_gate_cv;
        //     //   newTariffClean.rebate_type_cv = NewTariffClean.rebate_type_cv;
        //        newTariffClean.alias = NewTariffClean.alias;
        //        newTariffClean.in_gate_alert = NewTariffClean.in_gate_alert;
        //        newTariffClean.remarks = NewTariffClean.remarks;

        //        newTariffClean.create_by = uid;
        //        newTariffClean.create_dt = GqlUtils.GetNowEpochInSec();
        //        context.tariff_cleaning.Add(newTariffClean);

        //      retval=context.SaveChanges();
        //    }
        //    catch { throw; }


        //    return retval;
        //}

        public async Task<int> UpdatePackageCleans([Service] ApplicationPackageDBContext context, [Service] IConfiguration config,
             [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageClean_guids , string remarks, double adjusted_price)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                
                var dbPackageCleans = context.customer_company_cleaning_category.Where(cc=>UpdatePackageClean_guids.Contains(cc.guid)).ToList();
                if (dbPackageCleans == null)
                {
                    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                }
                foreach (var cc in dbPackageCleans)
                {
                    cc.adjusted_price = adjusted_price;

                    cc.remarks = remarks;
                    cc.update_by = uid;
                    cc.update_dt = GqlUtils.GetNowEpochInSec();
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

        public async Task<int> UpdatePackageClean([Service] ApplicationPackageDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, customer_company_cleaning_category_with_customer_company UpdatePackageClean)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageClean.guid;
                var dbPackageClean = context.customer_company_cleaning_category.Find(guid);
                if(dbPackageClean == null)
                {
                    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                }
                dbPackageClean.adjusted_price = UpdatePackageClean.adjusted_price;
               
                dbPackageClean.remarks = UpdatePackageClean.remarks;
                dbPackageClean.update_by = uid;
                dbPackageClean.update_dt = GqlUtils.GetNowEpochInSec();
                retval = context.SaveChanges();
             
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> UpdatePackageDepots([Service] ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageDepot_guids, int free_storage, double lolo_cost,
           double preinspection_cost, double storage_cost, string remarks, string storage_cal_cv)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbPackageDepots = context.package_depot.Where(cc => UpdatePackageDepot_guids.Contains(cc.guid)).ToList();
                if (dbPackageDepots == null)
                {
                    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                }
                foreach (var dbPackageDepot in dbPackageDepots)
                {
                    dbPackageDepot.free_storage = free_storage;
                    dbPackageDepot.lolo_cost = lolo_cost;
                    dbPackageDepot.preinspection_cost = preinspection_cost;
                    dbPackageDepot.remarks = remarks;
                    dbPackageDepot.storage_cal_cv = storage_cal_cv;
                    dbPackageDepot.storage_cost = storage_cost;
                    dbPackageDepot.update_by = uid;
                    dbPackageDepot.update_dt = GqlUtils.GetNowEpochInSec();
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


        public async Task<int> UpdatePackageDepot([Service] ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, package_depot UpdatePackageDepot)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageDepot.guid;
                if (string.IsNullOrEmpty(guid))
                {
                    throw new GraphQLException(new Error("The package guid  is empty", "500"));
                }
                var dbPackageDepot = context.package_depot.Find(guid);

                if (dbPackageDepot == null)
                {
                    throw new GraphQLException(new Error("The Depot Cost not found", "500"));
                }
                // dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                dbPackageDepot.free_storage = UpdatePackageDepot.free_storage;
                dbPackageDepot.lolo_cost = UpdatePackageDepot.lolo_cost;
                dbPackageDepot.preinspection_cost = UpdatePackageDepot.preinspection_cost;
                dbPackageDepot.remarks = UpdatePackageDepot.remarks;
                dbPackageDepot.storage_cal_cv = UpdatePackageDepot.storage_cal_cv;
                dbPackageDepot.storage_cost = UpdatePackageDepot.storage_cost;
                dbPackageDepot.update_by = uid;
                dbPackageDepot.update_dt = GqlUtils.GetNowEpochInSec();



                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeletePackageDepot([Service] ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeletePackageDepot_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = context.package_depot.Where(s => DeletePackageDepot_guids.Contains(s.guid) && s.delete_dt == null);


                foreach (var delTariffClean in delTariffCleans)
                {
                    delTariffClean.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffClean.update_by = uid;
                    delTariffClean.update_dt = GqlUtils.GetNowEpochInSec();
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
    }
}


