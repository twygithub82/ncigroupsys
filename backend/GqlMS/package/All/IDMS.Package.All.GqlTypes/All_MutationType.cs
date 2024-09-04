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
using System.Globalization;
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

        public async Task<int> UpdatePackageCleans(ApplicationPackageDBContext context, [Service] IConfiguration config,
             [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageClean_guids, string remarks, double adjusted_price)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbPackageCleans = context.customer_company_cleaning_category.Where(cc => UpdatePackageClean_guids.Contains(cc.guid)).ToList();
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
                if (dbPackageClean == null)
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

        public async Task<int> UpdatePackageDepots(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageDepot_guids, int free_storage, double lolo_cost,
           double preinspection_cost, double storage_cost, double gate_in_cost, double gate_out_cost, string remarks, string storage_cal_cv)
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
                    if (free_storage > -1) dbPackageDepot.free_storage = free_storage;
                    if (lolo_cost > -1) dbPackageDepot.lolo_cost = lolo_cost;
                    if (preinspection_cost > -1) dbPackageDepot.preinspection_cost = preinspection_cost;
                    if (!string.IsNullOrEmpty(remarks)) dbPackageDepot.remarks = (remarks == "--") ? "" : remarks;
                    if (!string.IsNullOrEmpty(storage_cal_cv)) dbPackageDepot.storage_cal_cv = storage_cal_cv;
                    if (storage_cost > -1) dbPackageDepot.storage_cost = storage_cost;
                    if (gate_in_cost > -1) dbPackageDepot.gate_in_cost = gate_in_cost;
                    if (gate_out_cost > -1) dbPackageDepot.gate_out_cost = gate_out_cost;
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


        public async Task<int> UpdatePackageDepot(ApplicationPackageDBContext context, [Service] IConfiguration config,
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

        public async Task<int> DeletePackageDepot(ApplicationPackageDBContext context, [Service] IConfiguration config,
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
        public async Task<int> UpdatePackageLabours(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageLabour_guids, double cost, string remarks)
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
                    if (cost > -1) dbPackageLabour.cost = cost;
                    if (!string.IsNullOrEmpty(remarks)) dbPackageLabour.remarks = remarks;
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
                var delPackageLabours = context.package_labour.Where(s => DeletePackageLabour_guids.Contains(s.guid) && s.delete_dt == null);


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

        #region Package Residue methods
        public async Task<int> UpdatePackageResidues(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatePackageResidue_guids, double cost, string remarks)
        {
            int retval = 0;
            try
            {
                //Ori code -------------------------
                //var dbPackageLabours = context.package_residue.Where(cc => UpdatePackageResidue_guids.Contains(cc.guid)).ToList();
                //if (dbPackageLabours == null)
                //{
                //    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                //}
                //foreach (var dbPackageLabour in dbPackageLabours)
                //{
                //    if (cost > -1) dbPackageLabour.cost = cost;
                //    if (!string.IsNullOrEmpty(remarks)) dbPackageLabour.remarks = remarks;
                //    dbPackageLabour.update_by = uid;
                //    dbPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
                //}
                //retval = context.SaveChanges();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (string residueGuid in updatePackageResidue_guids)
                {
                    var packageResidue = new package_residue() { guid = residueGuid };
                    context.Attach(packageResidue);

                    if (cost > -1) packageResidue.cost = cost;
                    if (!string.IsNullOrEmpty(remarks)) packageResidue.remarks = remarks.Replace("--", "");
                    packageResidue.update_dt = currentDateTime;
                    packageResidue.update_by = uid;
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

        public async Task<int> UpdatePackageResidue(ApplicationPackageDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, package_residue updatePackageResidue)
        {
            int retval = 0;
            try
            {

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = UpdatePackageResidue.guid;

                //if (string.IsNullOrEmpty(guid))
                //{
                //    throw new GraphQLException(new Error("The package guid  is empty", "500"));
                //}
                //var dbPackageResidue = context.package_residue.Find(guid);

                //if (dbPackageResidue == null)
                //{
                //    throw new GraphQLException(new Error("The Package Labour not found", "500"));
                //}
                //// dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                //dbPackageResidue.cost = UpdatePackageResidue.cost;
                //dbPackageResidue.remarks = UpdatePackageResidue.remarks;

                //dbPackageResidue.update_by = uid;
                //dbPackageResidue.update_dt = GqlUtils.GetNowEpochInSec();

                if (updatePackageResidue != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var packageResidue = new package_residue() { guid = updatePackageResidue.guid };
                    context.Attach(packageResidue);

                    packageResidue.cost = updatePackageResidue.cost;
                    packageResidue.remarks = updatePackageResidue.remarks;
                    packageResidue.update_by = uid;
                    packageResidue.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeletePackageResidue(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] deletePackageResidue_guids)
        {
            int retval = 0;
            try
            {

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var delPackageLabours = context.package_residue.Where(s => deletePackageResidue_guids.Contains(s.guid) && s.delete_dt == null);

                //foreach (var delPackageLabour in delPackageLabours)
                //{
                //    delPackageLabour.delete_dt = GqlUtils.GetNowEpochInSec();
                //    delPackageLabour.update_by = uid;
                //    delPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
                //}
                //retval = context.SaveChanges();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delGuid in deletePackageResidue_guids)
                {
                    var packageResidue = new package_residue() { guid = delGuid };
                    context.Attach(packageResidue);

                    packageResidue.delete_dt = currentDateTime;
                    packageResidue.update_dt = currentDateTime;
                    packageResidue.update_by = uid;
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
        #endregion Package Residue methods

        #region Package Buffer methods
        public async Task<int> UpdatePackageBuffers(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatePackageBuffer_guids, double cost, string remarks)
        {
            int retval = 0;
            try
            {
                //Ori code -------------------------
                //var dbPackageLabours = context.package_residue.Where(cc => UpdatePackageResidue_guids.Contains(cc.guid)).ToList();
                //if (dbPackageLabours == null)
                //{
                //    throw new GraphQLException(new Error("The Package Cleaning not found", "500"));
                //}
                //foreach (var dbPackageLabour in dbPackageLabours)
                //{
                //    if (cost > -1) dbPackageLabour.cost = cost;
                //    if (!string.IsNullOrEmpty(remarks)) dbPackageLabour.remarks = remarks;
                //    dbPackageLabour.update_by = uid;
                //    dbPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
                //}
                //retval = context.SaveChanges();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (string bufferGuid in updatePackageBuffer_guids)
                {
                    var packageBuffer = new package_buffer() { guid = bufferGuid };
                    context.Attach(packageBuffer);

                    if (cost > -1) packageBuffer.cost = cost;
                    if (!string.IsNullOrEmpty(remarks)) packageBuffer.remarks = remarks.Replace("--", "");
                    packageBuffer.update_dt = currentDateTime;
                    packageBuffer.update_by = uid;
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

        public async Task<int> UpdatePackageBuffer(ApplicationPackageDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, package_buffer updatePackageBuffer)
        {
            int retval = 0;
            try
            {

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = UpdatePackageResidue.guid;

                //if (string.IsNullOrEmpty(guid))
                //{
                //    throw new GraphQLException(new Error("The package guid  is empty", "500"));
                //}
                //var dbPackageResidue = context.package_residue.Find(guid);

                //if (dbPackageResidue == null)
                //{
                //    throw new GraphQLException(new Error("The Package Labour not found", "500"));
                //}
                //// dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                //dbPackageResidue.cost = UpdatePackageResidue.cost;
                //dbPackageResidue.remarks = UpdatePackageResidue.remarks;

                //dbPackageResidue.update_by = uid;
                //dbPackageResidue.update_dt = GqlUtils.GetNowEpochInSec();

                if (updatePackageBuffer != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var packageBuffer = new package_buffer() { guid = updatePackageBuffer.guid };
                    context.Attach(packageBuffer);

                    packageBuffer.cost = updatePackageBuffer.cost;
                    packageBuffer.remarks = updatePackageBuffer.remarks;
                    packageBuffer.update_by = uid;
                    packageBuffer.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeletePackageBuffer(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] deletePackageBuffer_guids)
        {
            int retval = 0;
            try
            {

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var delPackageLabours = context.package_residue.Where(s => deletePackageResidue_guids.Contains(s.guid) && s.delete_dt == null);

                //foreach (var delPackageLabour in delPackageLabours)
                //{
                //    delPackageLabour.delete_dt = GqlUtils.GetNowEpochInSec();
                //    delPackageLabour.update_by = uid;
                //    delPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();
                //}
                //retval = context.SaveChanges();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delGuid in deletePackageBuffer_guids)
                {
                    var packageBuffer = new package_buffer() { guid = delGuid };
                    context.Attach(packageBuffer);

                    packageBuffer.delete_dt = currentDateTime;
                    packageBuffer.update_dt = currentDateTime;
                    packageBuffer.update_by = uid;
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
        #endregion Package Buffer methods

        #region Package Repair methods
        public async Task<int> UpdatePackageRepairs(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatePackageRepair_guids, double material_cost, double labour_hour, string remarks)
        {
            int retval = 0;
            try
            {
                

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (string repairGuid in updatePackageRepair_guids)
                {
                    var packageRepair = new package_repair() { guid = repairGuid };
                    context.Attach(packageRepair);
                    if (material_cost > -1) packageRepair.material_cost = material_cost;
                    if (labour_hour > -1) packageRepair.labour_hour = labour_hour;
                    if (!string.IsNullOrEmpty(remarks)) packageRepair.remarks = remarks.Replace("--","");

                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
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

        public async Task<int> UpdatePackageRepair(ApplicationPackageDBContext context, [Service] IConfiguration config,
          [Service] IHttpContextAccessor httpContextAccessor, package_repair updatePackageRepair)
        {
            int retval = 0;
            try
            {

                

                if (updatePackageRepair != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var packageRepair = new package_repair() { guid = updatePackageRepair.guid };
                    context.Attach(packageRepair);

                    packageRepair.material_cost  = updatePackageRepair.material_cost;
                    packageRepair.labour_hour = updatePackageRepair.labour_hour;
                    packageRepair.remarks = updatePackageRepair.remarks;
                    packageRepair.update_by = uid;
                    packageRepair.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeletePackageRepair(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] deletePackageRepair_guids)
        {
            int retval = 0;
            try
            {

               

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delGuid in deletePackageRepair_guids)
                {
                    var packageRepair = new package_repair() { guid = delGuid };
                    context.Attach(packageRepair);

                    packageRepair.delete_dt = currentDateTime;
                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
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


        public async Task<int> UpdatePackageRepair_MaterialCost(ApplicationPackageDBContext context, [Service] IConfiguration config,
      [Service] IHttpContextAccessor httpContextAccessor, string? group_name_cv, string? subgroup_name_cv, string? part_name, string[]? customer_company_guids, double material_cost_percentage)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                
                var currentDateTime = DateTime.Now.ToEpochTime();
                var dbPackRepairs = context.package_repair.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(t=>t.tariff_repair)
                    .ToArray();
                if (customer_company_guids?.Length > 0) { dbPackRepairs = dbPackRepairs.Where(t => customer_company_guids.Contains(t.customer_company_guid)).ToArray(); }
                if (!string.IsNullOrEmpty(group_name_cv)) dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.group_name_cv == group_name_cv).ToArray();
                if (!string.IsNullOrEmpty(subgroup_name_cv)) dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.subgroup_name_cv == subgroup_name_cv).ToArray();
                if (!string.IsNullOrEmpty(part_name)) dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.part_name == part_name).ToArray();
                

                foreach (var packageRepair in dbPackRepairs)
                {
                    packageRepair.material_cost = Math.Round(Convert.ToDouble(packageRepair.material_cost * material_cost_percentage), 2);
                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
                }
                retval = await context.SaveChangesAsync();

                //var dbTariffRepairs = context.tariff_repair.Where(i => i.delete_dt == null || i.delete_dt == 0).ToArray();
                //if (!string.IsNullOrEmpty(group_name_cv)) dbTariffRepairs = dbTariffRepairs.Where(t => t.group_name_cv == group_name_cv).ToArray();
                //if (!string.IsNullOrEmpty(subgroup_name_cv)) dbTariffRepairs = dbTariffRepairs.Where(t => t.subgroup_name_cv == subgroup_name_cv).ToArray();
                //if (!string.IsNullOrEmpty(part_name)) dbTariffRepairs = dbTariffRepairs.Where(t => t.part_name == part_name).ToArray();


                //if (dbTariffRepairs == null)
                //{
                //    throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                //}

                //foreach (var r in dbTariffRepairs)
                //{
                //    r.material_cost = Math.Round(Convert.ToDouble(r.material_cost.Value * material_cost_percentage), 2);
                //    r.update_by = uid;
                //    r.update_dt = GqlUtils.GetNowEpochInSec();
                //}


                //retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public double CalculateMaterialCostRoundedUp(double materialCost, double materialCostPercentage)
        {
            double value = materialCost * materialCostPercentage;
            double result = Math.Ceiling(value * 100) / 100;
            return result;
        }
        #endregion Package Repair methods
    }
}


