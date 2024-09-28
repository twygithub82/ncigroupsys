using CommonUtil.Core.Service;
using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


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
                var currentDateTime = DateTime.Now.ToEpochTime();

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
                    dbPackageLabour.update_dt = currentDateTime;
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

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
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
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var delPackageLabour in delPackageLabours)
                {
                    delPackageLabour.delete_dt = currentDateTime;
                    delPackageLabour.update_by = uid;
                    delPackageLabour.update_dt = currentDateTime;
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
        #endregion Package Labour methods

        #region Package Residue methods
        public async Task<int> UpdatePackageResidues(ApplicationPackageDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatePackageResidue_guids, double cost, string remarks)
        {
            int retval = 0;
            try
            {
                //Ori code -------------------------
                var packageResidues = context.package_residue.Where(cc => updatePackageResidue_guids.Contains(cc.guid)).ToList();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var packageResidue in packageResidues)
                {
                    if (cost > -1) packageResidue.cost = cost;
                    if (!string.IsNullOrEmpty(remarks)) packageResidue.remarks = remarks;
                    packageResidue.update_by = uid;
                    packageResidue.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var currentDateTime = DateTime.Now.ToEpochTime();

                //foreach (string residueGuid in updatePackageResidue_guids)
                //{
                //    var packageResidue = new package_residue() { guid = residueGuid };
                //    context.Attach(packageResidue);

                //    if (cost > -1) packageResidue.cost = cost;
                //    if (!string.IsNullOrEmpty(remarks)) packageResidue.remarks = remarks.Replace("--", "");
                //    packageResidue.update_dt = currentDateTime;
                //    packageResidue.update_by = uid;
                //}
                //retval = await context.SaveChangesAsync();
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
                var packageResidue = await context.package_residue.Where(d => d.guid == updatePackageResidue.guid && (d.delete_dt == null || d.delete_dt == 0)).FirstOrDefaultAsync();
                if (packageResidue != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    //var packageResidue = new package_residue() { guid = updatePackageResidue.guid };
                    //context.Attach(packageResidue);

                    packageResidue.cost = updatePackageResidue.cost;
                    packageResidue.remarks = updatePackageResidue.remarks;
                    packageResidue.update_by = uid;
                    packageResidue.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
                else
                    throw new GraphQLException(new Error($"Package residue not found", "ERROR"));
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

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                var delPackageLabours = context.package_residue.Where(s => deletePackageResidue_guids.Contains(s.guid) && s.delete_dt == null);

                foreach (var delPackageLabour in delPackageLabours)
                {
                    delPackageLabour.delete_dt = currentDateTime;
                    delPackageLabour.update_by = uid;
                    delPackageLabour.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var currentDateTime = DateTime.Now.ToEpochTime();

                //foreach (var delGuid in deletePackageResidue_guids)
                //{
                //    var packageResidue = new package_residue() { guid = delGuid };
                //    context.Attach(packageResidue);

                //    packageResidue.delete_dt = currentDateTime;
                //    packageResidue.update_dt = currentDateTime;
                //    packageResidue.update_by = uid;
                //}
                //retval = await context.SaveChangesAsync();
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
                var packageBuffers = context.package_buffer.Where(cc => updatePackageBuffer_guids.Contains(cc.guid)).ToList();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();
                foreach (var packageBuffer in packageBuffers)
                {
                    if (cost > -1) packageBuffer.cost = cost;
                    if (!string.IsNullOrEmpty(remarks)) packageBuffer.remarks = remarks;
                    packageBuffer.update_by = uid;
                    packageBuffer.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

                //foreach (string bufferGuid in updatePackageBuffer_guids)
                //{
                //    var packageBuffer = new package_buffer() { guid = bufferGuid };
                //    context.Attach(packageBuffer);

                //    if (cost > -1) packageBuffer.cost = cost;
                //    if (!string.IsNullOrEmpty(remarks)) packageBuffer.remarks = remarks.Replace("--", "");
                //    packageBuffer.update_dt = currentDateTime;
                //    packageBuffer.update_by = uid;
                //}
                //retval = await context.SaveChangesAsync();
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
                var packageBuffer = await context.package_buffer.Where(b => b.guid == updatePackageBuffer.guid && (b.delete_dt == null || b.delete_dt == 0)).FirstOrDefaultAsync();
                if (packageBuffer != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    //var packageBuffer = new package_buffer() { guid = updatePackageBuffer.guid };
                    //context.Attach(packageBuffer);

                    packageBuffer.cost = updatePackageBuffer.cost;
                    packageBuffer.remarks = updatePackageBuffer.remarks;
                    packageBuffer.update_by = uid;
                    packageBuffer.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
                else
                    throw new GraphQLException(new Error($"Package buffer not found", "ERROR"));
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
                var packageBuffers = context.package_buffer.Where(s => deletePackageBuffer_guids.Contains(s.guid) && s.delete_dt == null);

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var packageBuffer in packageBuffers)
                {
                    //var packageBuffer = new package_buffer() { guid = delGuid };
                    //context.Attach(packageBuffer);

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

                var packageRepairs = await context.package_repair.Where(t => updatePackageRepair_guids.Contains(t.guid)).ToListAsync();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var packageRepair in packageRepairs)
                {
                    //var packageRepair = new package_repair() { guid = repairGuid };
                    //context.Attach(packageRepair);
                    if (material_cost > -1) packageRepair.material_cost = material_cost;
                    if (labour_hour > -1) packageRepair.labour_hour = labour_hour;
                    if (!string.IsNullOrEmpty(remarks)) packageRepair.remarks = remarks.Replace("--", "");

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

                var packageRepair = await context.package_repair.Where(r => r.guid == updatePackageRepair.guid &&
                                                                        (r.delete_dt == null || r.delete_dt == 0)).FirstOrDefaultAsync();

                if (packageRepair != null)
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    //var packageRepair = new package_repair() 
                    //{ 
                    //    guid = updatePackageRepair.guid, 
                    //    customer_company_guid = updatePackageRepair.customer_company_guid,
                    //    tariff_repair_guid = updatePackageRepair.tariff_repair_guid
                    //};
                    //context.Attach(packageRepair);

                    packageRepair.material_cost = updatePackageRepair.material_cost;
                    packageRepair.labour_hour = updatePackageRepair.labour_hour;
                    packageRepair.remarks = updatePackageRepair.remarks;
                    packageRepair.update_by = uid;
                    packageRepair.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
                else
                    throw new GraphQLException(new Error($"Package repair not found", "ERROR"));

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
                var packageRepairs = await context.package_repair.Where(t => deletePackageRepair_guids.Contains(t.guid)).ToListAsync();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var packageRepair in packageRepairs)
                {
                    //var packageRepair = new package_repair() 
                    //{ 
                    //    guid = delGuid
                    //};
                    //context.Attach(packageRepair);

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
      [Service] IHttpContextAccessor httpContextAccessor, string? group_name_cv, string? subgroup_name_cv, string? part_name, string? dimension,
      int? length, string? tariff_repair_guid, string[]? customer_company_guids, double material_cost_percentage, double labour_hour_percentage)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                var dbPackRepairs = await context.package_repair.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(t => t.tariff_repair)
                    .ToListAsync();
                if (customer_company_guids?.Length > 0) 
                { 
                    dbPackRepairs = dbPackRepairs.Where(t => customer_company_guids.Contains(t.customer_company_guid)).ToList();
                }
                if (!string.IsNullOrEmpty(tariff_repair_guid))
                {
                    dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.guid == tariff_repair_guid).ToList();
                }
                else
                {
                    if (!string.IsNullOrEmpty(group_name_cv))
                        dbPackRepairs = dbPackRepairs.Where(t => group_name_cv.EqualsIgnore(t.tariff_repair?.group_name_cv)).ToList();
                    if (!string.IsNullOrEmpty(subgroup_name_cv))
                        dbPackRepairs = dbPackRepairs.Where(t => subgroup_name_cv.EqualsIgnore(t.tariff_repair?.subgroup_name_cv)).ToList();
                    if (!string.IsNullOrEmpty(part_name))
                        dbPackRepairs = dbPackRepairs.Where(t => part_name.EqualsIgnore(t.tariff_repair?.part_name)).ToList();
                    if (!string.IsNullOrEmpty(dimension))
                        dbPackRepairs = dbPackRepairs.Where(t => dimension.EqualsIgnore(t.tariff_repair?.dimension)).ToList();
                    if (length != null)
                    {
                        if (length > 0)
                        {
                            dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.length == length).ToList();
                        }
                    }
                }

                foreach (var packageRepair in dbPackRepairs)
                {
                    packageRepair.material_cost = Math.Round(Convert.ToDouble(packageRepair.material_cost * material_cost_percentage), 2);
                    packageRepair.labour_hour = Math.Ceiling((packageRepair.labour_hour ?? 0 * labour_hour_percentage) * 4) / 4;

                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
                }
                retval = await context.SaveChangesAsync();

                //retval = await context.package_repair.ExecuteUpdateAsync(s => s
                //                      .SetProperty(e => e.delete_dt, currentDateTime)
                //                      .SetProperty(e => e.update_dt, currentDateTime)
                //                      .SetProperty(e => e.update_by, uid));

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        private double CalculateMaterialCostRoundedUp(double materialCost, double materialCostPercentage)
        {
            double value = materialCost * materialCostPercentage;
            double result = Math.Ceiling(value * 100) / 100;
            return result;
        }
        #endregion Package Repair methods
    }
}


