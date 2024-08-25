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

        #region Package Cleaning methods
       
        public async Task<int> UpdatePackageCleans( ApplicationPackageDBContext context, [Service] IConfiguration config,
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

        public async Task<int> UpdatePackageClean(ApplicationPackageDBContext context, [Service] IConfiguration config, 
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

        #endregion Package Cleaning methods

        #region Package Depot methods
        
        public async Task<int> UpdatePackageDepots( ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageDepot_guids, int free_storage, double lolo_cost,
           double preinspection_cost, double storage_cost,double gate_in_cost, double gate_out_cost, string remarks, string storage_cal_cv)
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
                    if(free_storage > -1) dbPackageDepot.free_storage = free_storage;
                    if (lolo_cost > -1) dbPackageDepot.lolo_cost = lolo_cost;
                    if (preinspection_cost > -1) dbPackageDepot.preinspection_cost = preinspection_cost;
                    if (!string.IsNullOrEmpty(remarks)) dbPackageDepot.remarks = (remarks=="--")?"":remarks;
                    if (!string.IsNullOrEmpty(storage_cal_cv)) dbPackageDepot.storage_cal_cv = storage_cal_cv;
                    if (storage_cost > -1) dbPackageDepot.storage_cost = storage_cost;
                    if (gate_in_cost > -1) dbPackageDepot.gate_in_cost = gate_in_cost;
                    if (gate_out_cost>-1) dbPackageDepot.gate_out_cost = gate_out_cost;
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


        public async Task<int> UpdatePackageDepot( ApplicationPackageDBContext context, [Service] IConfiguration config,
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
                dbPackageDepot.gate_in_cost = UpdatePackageDepot.gate_in_cost;
                dbPackageDepot.gate_out_cost = UpdatePackageDepot.gate_out_cost;
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

        public async Task<int> DeletePackageDepot( ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeletePackageDepot_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delPackageDepots = context.package_depot.Where(s => DeletePackageDepot_guids.Contains(s.guid) && s.delete_dt == null);


                foreach (var delPackageDepot in delPackageDepots)
                {
                    delPackageDepot.delete_dt = GqlUtils.GetNowEpochInSec();
                    delPackageDepot.update_by = uid;
                    delPackageDepot.update_dt = GqlUtils.GetNowEpochInSec();
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
        #endregion Package Depot methods

        #region Package Labour methods

        public async Task<int> SyncPackageLabours(ApplicationPackageDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            int retval = 0;
            try
            { }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
        public async Task<int> UpdatePackageLabours(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageLabour_guids, int cost, string remarks, string storage_cal_cv)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbPackageLabours = context.package_labour.Where(cc => UpdatePackageLabour_guids.Contains(cc.guid)).ToList();
                if (dbPackageLabours == null)
                {
                    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                }
                foreach (var dbPackageLabour in dbPackageLabours)
                {
                    dbPackageLabour.cost = cost;
                    dbPackageLabour.remarks = remarks;
                    dbPackageLabour.update_by = uid;
                    dbPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
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


        public async Task<int> UpdatePackageLabour(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, package_labour UpdatePackageLabour)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageLabour.guid;
                if (string.IsNullOrEmpty(guid))
                {
                    throw new GraphQLException(new Error("The package guid  is empty", "500"));
                }
                var dbPackageLabour = context.package_labour.Find(guid);

                if (dbPackageLabour == null)
                {
                    throw new GraphQLException(new Error("The Package Labour not found", "500"));
                }
                // dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                dbPackageLabour.cost = UpdatePackageLabour.cost;
                dbPackageLabour.remarks = UpdatePackageLabour.remarks;
               
                dbPackageLabour.update_by = uid;
                dbPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();



                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeletePackageLabour(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeletePackageLabour_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delPackageLabours = context.package_depot.Where(s => DeletePackageLabour_guids.Contains(s.guid) && s.delete_dt == null);


                foreach (var delPackageLabour in delPackageLabours)
                {
                    delPackageLabour.delete_dt = GqlUtils.GetNowEpochInSec();
                    delPackageLabour.update_by = uid;
                    delPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
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
        #endregion Package Labour methods
    }
}


