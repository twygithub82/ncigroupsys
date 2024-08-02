using CommonUtil.Core.Service;
using HotChocolate.Data;
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

namespace IDMS.Models.Tariff.Depot.GqlTypes
{
    public class TariffDepot_MutationType
    {
       
        public async Task<int> AddTariffDepot([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
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
                newTariffDepot.free_storage = NewTariffDepot.free_storage;
                if (NewTariffDepot.tanks != null)
                {
                    var tankGuids = NewTariffDepot.tanks.Select(t1 => t1.guid).ToList();
                    var tanks = context.tank.Where(t => tankGuids.Contains(t.guid)).ToList();

                    // newTariffDepot.tanks = NewTariffDepot.tanks;
                    // context.tank.
                    //newTariffDepot.unit_type_cv = NewTariffDepot.unit_type_cv;

                    foreach (var t in tanks)
                    {
                        t.tariff_depot_guid = newTariffDepot.guid;
                        t.update_dt = GqlUtils.GetNowEpochInSec();
                        t.update_by = uid;
                    }
                    newTariffDepot.tanks = tanks;
                }
                newTariffDepot.create_by = uid;
                newTariffDepot.create_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_depot.Add(newTariffDepot);

                var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                foreach (var customerCompany in customerCompanies)
                {
                    var pack_depot = new package_depot();
                    pack_depot.guid = Util.GenerateGUID();
                    pack_depot.tariff_depot_guid=newTariffDepot.guid;
                    pack_depot.customer_company_guid = customerCompany.guid;
                    pack_depot.free_storage = newTariffDepot.free_storage;
                    pack_depot.lolo_cost = newTariffDepot.lolo_cost;
                    pack_depot.preinspection_cost= newTariffDepot.preinspection_cost;
                    pack_depot.storage_cost = newTariffDepot.storage_cost;
                    pack_depot.create_by = uid;
                    pack_depot.create_dt = GqlUtils.GetNowEpochInSec();
                    context.package_depot.Add(pack_depot);
                }
                //context.cleaning_category.Add(newCleanCategory);
                retval =context.SaveChanges();
            }
            catch { throw; }

            
            return retval;
        }

       
        public async Task<int> UpdateTariffDepot([Service] ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, tariff_depot UpdateTariffDepot)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffDepot.guid;
                var dbTariffDepot = context.tariff_depot.Where(t=>t.guid==guid).Include(t=>t.tanks).FirstOrDefault();
                
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
                dbTariffDepot.free_storage = UpdateTariffDepot.free_storage;
                
                // dbTariffDepot.unit_type_cv = UpdateTariffDepot.unit_type_cv;
                dbTariffDepot.tanks = UpdateTariffDepot.tanks;
                dbTariffDepot.update_by = uid;
                dbTariffDepot.update_dt = GqlUtils.GetNowEpochInSec();

                if (UpdateTariffDepot.tanks != null)
                {
                    var tankGuids = UpdateTariffDepot.tanks.Select(t1 => t1.guid).ToList();
                    var tanks = context.tank.Where(t => tankGuids.Contains(t.guid)).ToList();

                    // newTariffDepot.tanks = NewTariffDepot.tanks;
                    // context.tank.
                    //newTariffDepot.unit_type_cv = NewTariffDepot.unit_type_cv;
                    foreach(var t in dbTariffDepot.tanks)
                    {
                        t.tariff_depot_guid = null;
                        t.update_dt = GqlUtils.GetNowEpochInSec();
                        t.update_by = uid;
                    }
                    foreach (var t in tanks)
                    {
                        t.tariff_depot_guid = dbTariffDepot.guid;
                        t.update_dt = GqlUtils.GetNowEpochInSec();
                        t.update_by = uid;
                    }
                    dbTariffDepot.tanks = tanks;
                }
                //foreach(var t in dbTariffDepot.tanks)
                //{
                //    if (!UpdateTariffDepot.tanks.Where(tnk => tnk.guid == t.guid).Any())
                //    {
                //        t.tariff_depot_guid = null;
                //    }
                //}



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
                var delTariffCleans = context.tariff_depot.Where(s => DeleteTariffDepot_guids.Contains(s.guid) && s.delete_dt == null).Include(t=>t.tanks).ToList();
              

                foreach(var delTariffClean in delTariffCleans)
                {
                    delTariffClean.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffClean.update_by = uid;
                    delTariffClean.update_dt = GqlUtils.GetNowEpochInSec();
                    foreach(var t in delTariffClean.tanks)
                    {
                        t.tariff_depot_guid = null;
                        t.update_dt = GqlUtils.GetNowEpochInSec();
                        t.update_by = uid;
                    }
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
