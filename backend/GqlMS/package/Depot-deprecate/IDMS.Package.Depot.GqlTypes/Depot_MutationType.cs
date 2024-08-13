using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
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
using static System.Net.Mime.MediaTypeNames;

namespace IDMS.Models.Package.Depot.GqlTypes
{
    public class PackageDepot_MutationType
    {

        //public async Task<int> AddPackageDepot([Service] ApplicationPackageDBContext context, [Service] IConfiguration config, 
        //    [Service] IHttpContextAccessor httpContextAccessor, package_depot NewPackageDepot)
        //{
        //    int retval = 0;
        //    try
        //    {
        //        var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        NewPackageDepot.guid = (string.IsNullOrEmpty(NewPackageDepot.guid) ? Util.GenerateGUID() : NewPackageDepot.guid);
        //        var newPackageDepot = new package_depot();
        //        newPackageDepot.guid = NewPackageDepot.guid;
        //        newPackageDepot.customer_company_guid = NewPackageDepot.customer_company_guid;
        //        newPackageDepot.free_storage = NewPackageDepot.free_storage;
        //        newPackageDepot.lolo_cost = NewPackageDepot.lolo_cost;
        //        newPackageDepot.preinspection_cost = NewPackageDepot.preinspection_cost;
        //        newPackageDepot.remarks = NewPackageDepot.remarks;
        //        newPackageDepot.storage_cal_cv = NewPackageDepot.remarks;
        //        newPackageDepot.storage_cost = NewPackageDepot.storage_cost;
        //        newPackageDepot.create_by = uid;
        //        newPackageDepot.create_dt = GqlUtils.GetNowEpochInSec();

        //        context.package_depot.Add(newPackageDepot);


        //        //context.cleaning_category.Add(newCleanCategory);
        //        retval =context.SaveChanges();
        //    }
        //    catch { throw; }


        //    return retval;
        //}

        public async Task<int> UpdatePackageDepots([Service] ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageDepot_guids, int free_storage, double lolo_cost,
           double preinspection_cost, double storage_cost,string remarks,string storage_cal_cv)
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
                if(string.IsNullOrEmpty(guid))
                {
                    throw new GraphQLException(new Error("The package guid  is empty", "500"));
                }
                var dbPackageDepot = context.package_depot.Find(guid);
                
                if(dbPackageDepot == null)
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
