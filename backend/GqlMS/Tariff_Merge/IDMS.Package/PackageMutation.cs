using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using HotChocolate.Data;
using IDMS.Models.DB;
using IDMS.Models.Package;
using IDMS.Models.Parameter.CleaningSteps.GqlTypes.DB;
using IDMS.Models.Tariff;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using IDMS.Models.Tariff.GqlTypes;
using IDMS.Package.GqlTypes.LocalModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;


namespace IDMS.Models.Package.GqlTypes
{
    [ExtendObjectType(typeof(TariffMutation))]
    public class PackageMutation
    {
        const string graphqlErrorCode = "ERROR";

        #region Package Cleaning methods

        public async Task<int> UpdatePackageCleans(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
             [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageClean_guids, string remarks, double adjusted_price, double? price_percentage)
        {
            int retval = 0;
            double? finalAdjustedPrice;

            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbPackageCleans = context.customer_company_cleaning_category.Where(cc => UpdatePackageClean_guids.Contains(cc.guid)).ToList();
                if (dbPackageCleans == null)
                {
                    logger.LogWarning("Package cleaning not found");
                    throw new GraphQLException(new Error("Package cleaning not found", "500"));
                }

                //Update by percentage
                if (price_percentage != null)
                    finalAdjustedPrice = adjusted_price * price_percentage;
                else
                    finalAdjustedPrice = adjusted_price;

                finalAdjustedPrice = CalculateMaterialCostRoundedUp(finalAdjustedPrice);

                foreach (var cc in dbPackageCleans)
                {
                    if(adjusted_price > -1) cc.adjusted_price = finalAdjustedPrice;
                    if (!string.IsNullOrEmpty(cc.guid))
                        cc.remarks = remarks;
                    cc.update_by = uid;
                    cc.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageCleans");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdatePackageClean(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, customer_company_cleaning_category UpdatePackageClean)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageClean.guid;
                var dbPackageClean = context.customer_company_cleaning_category.Find(guid);
                if (dbPackageClean == null)
                {
                    logger.LogWarning("Package cleaning not found");
                    throw new GraphQLException(new Error("Package cleaning not found", "500"));
                }
                dbPackageClean.adjusted_price = CalculateMaterialCostRoundedUp(UpdatePackageClean.adjusted_price);

                dbPackageClean.remarks = UpdatePackageClean.remarks;
                dbPackageClean.update_by = uid;
                dbPackageClean.update_dt = GqlUtils.GetNowEpochInSec();
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageClean");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        #endregion Package Cleaning methods

        #region Package Depot methods

        public async Task<int> UpdatePackageDepots(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageDepot_guids, int free_storage, double lolo_cost,
           double preinspection_cost, double storage_cost, double gate_in_cost, double gate_out_cost, string remarks, string storage_cal_cv, CostPercentage? costPercentage)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbPackageDepots = context.package_depot.Where(cc => UpdatePackageDepot_guids.Contains(cc.guid)).ToList();
                if (dbPackageDepots == null)
                {
                    logger.LogWarning("Package cleaning not found");
                    throw new GraphQLException(new Error("Package cleaning not found", "500"));
                }


                var finalLoloCost = (costPercentage != null && costPercentage.lolo_percentage != null) ? lolo_cost * costPercentage.lolo_percentage : lolo_cost;
                var finalPreInspCost = (costPercentage != null && costPercentage.preinspect_percentage != null) ? preinspection_cost * costPercentage.preinspect_percentage : preinspection_cost;
                var finalGateInCost = (costPercentage != null && costPercentage.gate_in_percentage != null) ? gate_in_cost * costPercentage.gate_in_percentage : gate_in_cost;
                var finalGateOutCost = (costPercentage != null && costPercentage.gate_out_percentage != null) ? gate_out_cost * costPercentage.gate_out_percentage : gate_out_cost;
                var finalStorageCost = (costPercentage != null && costPercentage.storage_percentage != null) ? storage_cost * costPercentage.storage_percentage : storage_cost;

                finalLoloCost = CalculateMaterialCostRoundedUp(finalLoloCost);
                finalPreInspCost = CalculateMaterialCostRoundedUp(finalPreInspCost);
                finalGateInCost = CalculateMaterialCostRoundedUp(finalGateInCost);
                finalGateOutCost = CalculateMaterialCostRoundedUp(finalGateOutCost);
                finalStorageCost = CalculateMaterialCostRoundedUp(finalStorageCost);

                foreach (var dbPackageDepot in dbPackageDepots)
                {
                    if (free_storage > -1) dbPackageDepot.free_storage = free_storage;
                    if (lolo_cost > -1) dbPackageDepot.lolo_cost = finalLoloCost;
                    if (preinspection_cost > -1) dbPackageDepot.preinspection_cost = finalPreInspCost;
                    if (!string.IsNullOrEmpty(remarks)) dbPackageDepot.remarks = (remarks == "--") ? "" : remarks;
                    if (!string.IsNullOrEmpty(storage_cal_cv)) dbPackageDepot.storage_cal_cv = storage_cal_cv;
                    if (storage_cost > -1) dbPackageDepot.storage_cost = finalStorageCost;
                    if (gate_in_cost > -1) dbPackageDepot.gate_in_cost = finalGateInCost;
                    if (gate_out_cost > -1) dbPackageDepot.gate_out_cost = finalGateOutCost;
                    dbPackageDepot.update_by = uid;
                    dbPackageDepot.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageDepots");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }


        public async Task<int> UpdatePackageDepot(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, package_depot UpdatePackageDepot)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageDepot.guid;
                if (string.IsNullOrEmpty(guid))
                {
                    logger.LogWarning("Package depot guid is null or empty");
                    throw new GraphQLException(new Error("Package depot guid cannot be null or empty", "500"));
                }
                var dbPackageDepot = context.package_depot.Find(guid);

                if (dbPackageDepot == null)
                {
                    logger.LogWarning("Package depot not found");
                    throw new GraphQLException(new Error("Package depot not found", "500"));
                }
                // dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                dbPackageDepot.free_storage = UpdatePackageDepot.free_storage;
                dbPackageDepot.lolo_cost = CalculateMaterialCostRoundedUp(UpdatePackageDepot.lolo_cost);
                dbPackageDepot.preinspection_cost = CalculateMaterialCostRoundedUp(UpdatePackageDepot.preinspection_cost);
                dbPackageDepot.remarks = UpdatePackageDepot.remarks;
                dbPackageDepot.storage_cal_cv = UpdatePackageDepot.storage_cal_cv;
                dbPackageDepot.storage_cost = CalculateMaterialCostRoundedUp(UpdatePackageDepot.storage_cost);
                dbPackageDepot.gate_in_cost =  CalculateMaterialCostRoundedUp(UpdatePackageDepot.gate_in_cost);
                dbPackageDepot.gate_out_cost = CalculateMaterialCostRoundedUp(UpdatePackageDepot.gate_out_cost);
                dbPackageDepot.update_by = uid;
                dbPackageDepot.update_dt = GqlUtils.GetNowEpochInSec();

                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageDepot");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }


        public async Task<int> DeletePackageDepot(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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
                logger.LogError(ex, "Error in DeletePackageDepot");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion Package Depot methods

        #region Package Labour methods
        public async Task<int> UpdatePackageLabours(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageLabour_guids, double cost, string remarks, double? cost_percentage)
        {
            int retval = 0;
            double? finalAdjustedPrice;

            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                var dbPackageLabours = context.package_labour.Where(cc => UpdatePackageLabour_guids.Contains(cc.guid)).ToList();
                if (dbPackageLabours == null)
                {
                    logger.LogWarning("Package cleaning not found");    
                    throw new GraphQLException(new Error("Package cleaning not found", "500"));
                }

                //Update by percentage
                if (cost_percentage != null)
                    finalAdjustedPrice = cost * cost_percentage;
                else
                    finalAdjustedPrice = cost;

                foreach (var dbPackageLabour in dbPackageLabours)
                {
                    if (cost > -1) dbPackageLabour.cost = CalculateMaterialCostRoundedUp(finalAdjustedPrice);
                    if (!string.IsNullOrEmpty(remarks)) dbPackageLabour.remarks = remarks;
                    dbPackageLabour.update_by = uid;
                    dbPackageLabour.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageLabours");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }


        public async Task<int> UpdatePackageLabour(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, package_labour UpdatePackageLabour)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageLabour.guid;
                if (string.IsNullOrEmpty(guid))
                {
                    logger.LogWarning("Package Labour guid is null or empty");  
                    throw new GraphQLException(new Error("Package Labour guid is null or empty", "500"));
                }
                var dbPackageLabour = context.package_labour.Find(guid);

                if (dbPackageLabour == null)
                {
                    logger.LogWarning("Package Labour not found");
                    throw new GraphQLException(new Error("Package Labour not found", "500"));
                }
                // dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                dbPackageLabour.cost = CalculateMaterialCostRoundedUp(UpdatePackageLabour.cost);
                dbPackageLabour.remarks = UpdatePackageLabour.remarks;

                dbPackageLabour.update_by = uid;
                dbPackageLabour.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageLabour");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeletePackageLabour(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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
                logger.LogError(ex, "Error in DeletePackageLabour");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion Package Labour methods

        #region Package Residue methods
        public async Task<int> UpdatePackageResidues(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageResidues");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdatePackageResidue(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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
                {
                    logger.LogWarning("Package residue not found"); 
                    throw new GraphQLException(new Error($"Package residue not found", "ERROR"));
                }
           
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageResidue");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeletePackageResidue(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in DeletePackageResidue");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion Package Residue methods

        #region Package Buffer methods
        public async Task<int> UpdatePackageBuffers(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatePackageBuffer_guids, double cost, string remarks, double? cost_percentage)
        {
            int retval = 0;
            double? finalAdjustedPrice;


            try
            {
                //Ori code -------------------------
                var packageBuffers = context.package_buffer.Where(cc => updatePackageBuffer_guids.Contains(cc.guid)).ToList();

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();


                //Update by percentage
                if (cost_percentage != null)
                    finalAdjustedPrice = cost * cost_percentage;
                else
                    finalAdjustedPrice = cost;

                foreach (var packageBuffer in packageBuffers)
                {
                    if (cost > -1) packageBuffer.cost = CalculateMaterialCostRoundedUp(finalAdjustedPrice);
                    if (!string.IsNullOrEmpty(remarks)) packageBuffer.remarks = remarks;
                    packageBuffer.update_by = uid;
                    packageBuffer.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageBuffers");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdatePackageBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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

                    packageBuffer.cost = CalculateMaterialCostRoundedUp(updatePackageBuffer.cost);
                    packageBuffer.remarks = updatePackageBuffer.remarks;
                    packageBuffer.update_by = uid;
                    packageBuffer.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
                else
                {
                    logger.LogWarning("Package buffer not found");
                    throw new GraphQLException(new Error($"Package buffer not found", "ERROR"));
                }
                
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageBuffer");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeletePackageBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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
                logger.LogError(ex, "Error in DeletePackageBuffer");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion Package Buffer methods

        #region Package Repair methods
        public async Task<int> UpdatePackageRepairs(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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
                    if (material_cost > -1) packageRepair.material_cost = CalculateMaterialCostRoundedUp(material_cost);
                    if (labour_hour > -1) packageRepair.labour_hour = labour_hour;
                    if (!string.IsNullOrEmpty(remarks)) packageRepair.remarks = remarks.Replace("--", "");

                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
                }
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageRepairs");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdatePackageRepair(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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

                    packageRepair.material_cost = CalculateMaterialCostRoundedUp(updatePackageRepair.material_cost);
                    packageRepair.labour_hour = updatePackageRepair.labour_hour;
                    packageRepair.remarks = updatePackageRepair.remarks;
                    packageRepair.update_by = uid;
                    packageRepair.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
                else
                {
                    logger.LogWarning("Package repair not found");
                    throw new GraphQLException(new Error($"Package repair not found", "ERROR"));
                }

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdatePackageRepair");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeletePackageRepair(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
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

                    packageRepair.delete_dt = currentDateTime;
                    packageRepair.update_dt = currentDateTime;
                    packageRepair.update_by = uid;
                }
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in DeletePackageRepair");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdatePackageRepair_ByPercentage(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string[] package_repair_guid, double material_cost_percentage, double labour_hour_percentage)
        {
            int retval = 0;
            bool isAll = true;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var dbPackRepairs = await context.package_repair.Where(i => package_repair_guid.Contains(i.guid) &&
                                                                            i.delete_dt == null || i.delete_dt == 0).ToListAsync();

                    if (dbPackRepairs != null && dbPackRepairs.Count > 0)
                    {
                        var guids = dbPackRepairs.Select(p => p.guid).ToList();
                        string guidList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));

                        //string sql = $"UPDATE package_repair SET material_cost = (ROUND(material_cost * {material_cost_percentage}, 2)), " +
                        //             $"labour_hour = (CEILING(COALESCE(labour_hour, 0.0) * {labour_hour_percentage} * 4.0) / 4.0), " +
                        //             $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                        //             $"WHERE guid IN ({guidList})";


                        string sql = $"UPDATE package_repair SET material_cost = (CEILING(COALESCE(material_cost, 0.0) * {material_cost_percentage} * 20.0) / 20.0), " +
                                     $"labour_hour = (CEILING(COALESCE(labour_hour, 0.0) * {labour_hour_percentage} * 4.0) / 4.0), " +
                                     $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                                     $"WHERE guid IN ({guidList})";

                        // Execute the raw SQL command
                        retval = await context.Database.ExecuteSqlRawAsync(sql);

                        // Commit the transaction if all operations succeed
                        await transaction.CommitAsync();
                    }
                    else
                    {
                        logger.LogWarning("Package repair not found");
                        throw new GraphQLException(new Error("Package repair not found", "NOT FOUND"));
                    }

                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();

                    logger.LogError(ex, "Error in UpdatePackageRepair_ByPercentage");
                    // Return a GraphQL friendly error
                    throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage(ex.Message)
                            .SetCode(graphqlErrorCode)
                            .Build());
                }
                return retval;
            }
        }


        public async Task<int> UpdatePackageRepair_MaterialCost(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string? group_name_cv, string? subgroup_name_cv, string? part_name, string? dimension,
            int? length, string? tariff_repair_guid, string[]? customer_company_guids, double material_cost_percentage, double labour_hour_percentage)
        {
            int retval = 0;
            bool isAll = true;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var dbPackRepairs = await context.package_repair.Include(p => p.tariff_repair)
                        .Where(i => i.delete_dt == null || i.delete_dt == 0)
                        .ToListAsync();

                    if (customer_company_guids?.Length > 0)
                    {
                        dbPackRepairs = dbPackRepairs.Where(t => customer_company_guids.Contains(t.customer_company_guid)).ToList();
                        isAll = false;
                    }

                    if (!string.IsNullOrEmpty(tariff_repair_guid))
                    {
                        dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.guid == tariff_repair_guid).ToList();
                        isAll = false;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(group_name_cv))
                        {
                            dbPackRepairs = dbPackRepairs.Where(t => group_name_cv.EqualsIgnore(t.tariff_repair?.group_name_cv)).ToList();
                            isAll = false;
                        }

                        if (!string.IsNullOrEmpty(subgroup_name_cv))
                        {
                            dbPackRepairs = dbPackRepairs.Where(t => subgroup_name_cv.EqualsIgnore(t.tariff_repair?.subgroup_name_cv)).ToList();
                            isAll = false;
                        }

                        if (!string.IsNullOrEmpty(part_name))
                        {
                            dbPackRepairs = dbPackRepairs.Where(t => part_name.EqualsIgnore(t.tariff_repair?.part_name)).ToList();
                            isAll = false;
                        }
                        if (!string.IsNullOrEmpty(dimension))
                        {
                            dbPackRepairs = dbPackRepairs.Where(t => dimension.EqualsIgnore(t.tariff_repair?.dimension)).ToList();
                            isAll = false;
                        }

                        if (length != null)
                        {
                            if (length > 0)
                            {
                                dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.length == length).ToList();
                                isAll = false;
                            }
                        }
                    }

                    if (isAll)
                    {
                        retval = await context.package_repair.ExecuteUpdateAsync(s => s
                          .SetProperty(e => e.update_dt, currentDateTime)
                          .SetProperty(e => e.update_by, uid)
                          //.SetProperty(e => e.material_cost, e => (Math.Round(Convert.ToDouble(e.material_cost * material_cost_percentage), 2)))
                          //.SetProperty(e => e.material_cost, e => CalculateMaterialCostRoundedUp(e.material_cost * material_cost_percentage))
                          .SetProperty(e => e.material_cost, e => (Math.Ceiling(Convert.ToDouble((e.material_cost * material_cost_percentage) * 20)) / 20.0))
                          .SetProperty(e => e.labour_hour, e => (Math.Ceiling(Convert.ToDouble((e.labour_hour ?? 0) * labour_hour_percentage) * 4) / 4))
                           );
                    }
                    else
                    {
                        var guids = dbPackRepairs.Select(p => p.guid).ToList();
                        string guidList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));

                        //string sql = $"UPDATE package_repair SET material_cost = (ROUND(material_cost * {material_cost_percentage}, 2)), " +
                        //             $"labour_hour = (CEILING(COALESCE(labour_hour, 0.0) * {labour_hour_percentage} * 4.0) / 4.0), " +
                        //             $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                        //             $"WHERE guid IN ({guidList})";


                        string sql = $"UPDATE package_repair SET material_cost = (CEILING(COALESCE(material_cost, 0.0) * {material_cost_percentage} * 20.0) / 20.0), " +
                                     $"labour_hour = (CEILING(COALESCE(labour_hour, 0.0) * {labour_hour_percentage} * 4.0) / 4.0), " +
                                     $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                                     $"WHERE guid IN ({guidList})";

                        // Execute the raw SQL command
                        retval = await context.Database.ExecuteSqlRawAsync(sql);
                    }
                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();

                    logger.LogError(ex, "Error in UpdatePackageRepair_MaterialCost");
                    // Return a GraphQL friendly error
                    throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage(ex.Message)
                            .SetCode(graphqlErrorCode)
                            .Build());
                }
                return retval;
            }
        }



        [Obsolete]
        private async Task<int> UpdatePackageRepair_MaterialCost_New(ApplicationTariffDBContext context, [Service] IConfiguration config, 
            [Service] IHttpContextAccessor httpContextAccessor, string? group_name_cv, string? subgroup_name_cv, string? part_name, string? dimension,
            int? length, string? tariff_repair_guid, string[]? customer_company_guids, double material_cost_percentage, double labour_hour_percentage)
        {
            int retval = 0;
            bool isAll = true;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = DateTime.Now.ToEpochTime();

                    var pa = from pr in context.package_repair
                             join tf in context.tariff_repair
                             on pr.tariff_repair_guid equals tf.guid
                             where pr.delete_dt == null || pr.delete_dt == 0
                             select new
                             {
                                 pr.guid,
                                 pr.customer_company_guid,
                                 pr.update_by,
                                 pr.update_dt,
                                 pr.labour_hour,
                                 pr.material_cost,
                                 tf.group_name_cv,
                                 tf.subgroup_name_cv,
                                 tf.part_name,
                                 tf.dimension,
                                 tf.length,
                                 tfguid = tf.guid
                             };
                    var dbPackRepairs = await pa.ToListAsync();

                    if (customer_company_guids?.Length > 0)
                    {
                        dbPackRepairs = dbPackRepairs.Where(t => customer_company_guids.Contains(t.customer_company_guid)).ToList();
                        isAll = false;
                    }
                    if (!string.IsNullOrEmpty(tariff_repair_guid))
                    {
                        //dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.guid == tariff_repair_guid).ToList();
                        dbPackRepairs = dbPackRepairs.Where(t => t.tfguid == tariff_repair_guid).ToList();
                        isAll = false;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(group_name_cv))
                        {
                            //dbPackRepairs = dbPackRepairs.Where(t => group_name_cv.EqualsIgnore(t.tariff_repair?.group_name_cv)).ToList();
                            dbPackRepairs = dbPackRepairs.Where(t => group_name_cv.EqualsIgnore(t.group_name_cv)).ToList();
                            isAll = false;
                        }

                        if (!string.IsNullOrEmpty(subgroup_name_cv))
                        {
                            //dbPackRepairs = dbPackRepairs.Where(t => subgroup_name_cv.EqualsIgnore(t.tariff_repair?.subgroup_name_cv)).ToList();
                            dbPackRepairs = dbPackRepairs.Where(t => subgroup_name_cv.EqualsIgnore(t.subgroup_name_cv)).ToList();
                            isAll = false;
                        }

                        if (!string.IsNullOrEmpty(part_name))
                        {
                            // dbPackRepairs = dbPackRepairs.Where(t => part_name.EqualsIgnore(t.tariff_repair?.part_name)).ToList();
                            dbPackRepairs = dbPackRepairs.Where(t => part_name.EqualsIgnore(t.part_name)).ToList();
                            isAll = false;
                        }
                        if (!string.IsNullOrEmpty(dimension))
                        {
                            //dbPackRepairs = dbPackRepairs.Where(t => dimension.EqualsIgnore(t.tariff_repair?.dimension)).ToList();
                            dbPackRepairs = dbPackRepairs.Where(t => dimension.EqualsIgnore(t.dimension)).ToList();
                            isAll = false;
                        }

                        if (length != null)
                        {
                            if (length > 0)
                            {
                                //dbPackRepairs = dbPackRepairs.Where(t => t.tariff_repair?.length == length).ToList();
                                dbPackRepairs = dbPackRepairs.Where(t => t.length == length).ToList();
                                isAll = false;
                            }
                        }
                    }

                    if (isAll)
                    {
                        retval = await context.package_repair.ExecuteUpdateAsync(s => s
                          .SetProperty(e => e.update_dt, currentDateTime)
                          .SetProperty(e => e.update_by, uid)
                          .SetProperty(e => e.material_cost, e => (Math.Round(Convert.ToDouble(e.material_cost * material_cost_percentage), 2)))
                          .SetProperty(e => e.labour_hour, e => (Math.Round(Convert.ToDouble(e.labour_hour ?? 0 * labour_hour_percentage) * 4) / 4))
                           );
                    }
                    else
                    {
                        var guids = dbPackRepairs.Select(p => p.guid).ToList();
                        string guidList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));

                        string sql = $"UPDATE package_repair SET material_cost = (material_cost * {material_cost_percentage}), " +
                                     $"labour_hour = (labour_hour * {labour_hour_percentage}), " +
                                     $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                                     $"WHERE guid IN ({guidList})";

                        // Execute the raw SQL command
                        retval = await context.Database.ExecuteSqlRawAsync(sql);

                    }
                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();

                    // Handle or log the exception
                    throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
                    //throw; // Re-throw if necessary
                }
                return retval;
            }
        }

        [Obsolete]
        private int BulkUpdate(ApplicationTariffDBContext context, List<string?> ids, string user, double percentageCost, double percentageLabour)
        {
            try
            {
                string guid = string.Join(", ", ids.ConvertAll(id => $"'{id}'"));
                long updateDate = DateTime.Now.ToEpochTime();

                string sql = $"UPDATE package_repair SET material_cost = (material_cost * {percentageCost}), " +
                             $"labour_hour = (labour_hour * {percentageLabour}), " +
                             $"update_dt = {updateDate}, update_by = '{user}' " +
                             $"WHERE guid IN ({guid})";

                // Execute the raw SQL command
                var ret = context.Database.ExecuteSqlRaw(sql);
                //await Task.Delay(1);
                return ret;
            }
            catch (Exception ex)
            {
                return 0;
            }

            //}
        }

        private double CalculateMaterialCostRoundedUp(double? materialCost)
        {
            if (materialCost == 0.0)
                return 0.0;

            double result = Math.Ceiling(Convert.ToDouble(materialCost * 20)) / 20.0;
            return result;
        }

        #endregion Package Repair methods

        #region Package Steaming methods
        public async Task<int> UpdatePackageSteamings(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> UpdatePackageSteaming_guids, double cost, double labour, string remarks)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = DateTime.Now.ToEpochTime();

                var dbPackageSteaming = context.package_steaming.Where(cc => UpdatePackageSteaming_guids.Contains(cc.guid)).ToList();
                if (dbPackageSteaming == null)
                {
                    logger.LogWarning("Package Steaming not found");
                    throw new GraphQLException(new Error("Package Steaming not found", "500"));
                }
                foreach (var item in dbPackageSteaming)
                {
                    if (cost > -1) item.cost = cost;
                    if (labour > -1) item.labour = labour;
                    if (!string.IsNullOrEmpty(remarks)) item.remarks = remarks;

                    item.update_by = uid;
                    item.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in UpdatePackageSteamings");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }


        public async Task<int> UpdatePackageSteaming(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, package_steaming UpdatePackageSteaming)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdatePackageSteaming.guid;
                if (string.IsNullOrEmpty(guid))
                {
                    logger.LogWarning("Package steaming guid is null or empty"); 
                    throw new GraphQLException(new Error("Package steaming guid is empty", "500"));
                }
                var dbPackageSteaming = context.package_steaming.Find(guid);

                if (dbPackageSteaming == null)
                {
                    logger.LogWarning("Package Steaming not found");
                    throw new GraphQLException(new Error("Package Steaming not found", "500"));
                }
                // dbPackageDepot.customer_company_guid = UpdatePackageDepot.customer_company_guid;
                dbPackageSteaming.cost = UpdatePackageSteaming.cost;
                dbPackageSteaming.labour = UpdatePackageSteaming.labour;
                dbPackageSteaming.remarks = UpdatePackageSteaming.remarks;

                dbPackageSteaming.update_by = uid;
                dbPackageSteaming.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in UpdatePackageSteaming");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeletePackageSteaming(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeletePackageSteaming_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delPackageSteaming = context.package_steaming.Where(s => DeletePackageSteaming_guids.Contains(s.guid) && s.delete_dt == null);
                var currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in delPackageSteaming)
                {
                    item.delete_dt = currentDateTime;
                    item.update_by = uid;
                    item.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in DeletePackageSteaming");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion Package Steaming methods


        #region Package Steaming methods
        public async Task<int> AddSteamingExclusive(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<steaming_exclusive> NewSteamingExclusive)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<steaming_exclusive> newSteamingExclusiveList = new List<steaming_exclusive>();
                IList<package_steaming> newPackageSteamingList = new List<package_steaming>();

                foreach (var item in NewSteamingExclusive)
                {
                    item.guid = (string.IsNullOrEmpty(item.guid) ? Util.GenerateGUID() : item.guid);
                    var newSE = new steaming_exclusive();
                    newSE.guid = item.guid;
                    newSE.tariff_cleaning_guid = item.tariff_cleaning_guid;
                    newSE.temp_max = item.temp_max;
                    newSE.temp_min = item.temp_min;
                    newSE.labour = item.labour;
                    newSE.remarks = item.remarks;
                    newSE.create_by = uid;
                    newSE.create_dt = currentDateTime;
                    //await context.steaming_exclusive.AddAsync(newSE);
                    newSteamingExclusiveList.Add(newSE);

                    if (item.package_steaming == null)
                    {
                        logger.LogWarning("Package steaming not found");
                        throw new GraphQLException(new Error("Package steaming not found", "500"));
                    }

                    var newPackageSteam = new package_steaming();
                    newPackageSteam.guid = Util.GenerateGUID();
                    newPackageSteam.customer_company_guid = item.package_steaming.customer_company_guid;
                    newPackageSteam.steaming_exclusive_guid = newSE.guid;
                    newPackageSteam.cost = item.package_steaming.cost;
                    newPackageSteam.labour = item.package_steaming.labour;
                    newPackageSteam.remarks = item.package_steaming.remarks;
                    newPackageSteam.create_by = uid;
                    newPackageSteam.create_dt = currentDateTime;
                    //await context.package_steaming.AddAsync(newPackageSteam);
                    newPackageSteamingList.Add(newPackageSteam);
                }

                await context.steaming_exclusive.AddRangeAsync(newSteamingExclusiveList);
                await context.package_steaming.AddRangeAsync(newPackageSteamingList);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in AddSteamingExclusive");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> UpdateSteamingExclusive(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, steaming_exclusive UpdateSteamingExclusive)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var guid = UpdateSteamingExclusive.guid;
                var dbTSteamingExclusive = await context.steaming_exclusive.Where(t => t.guid == guid).FirstOrDefaultAsync();

                if (dbTSteamingExclusive == null)
                {
                    logger.LogWarning("The record not found in UpdateSteamingExclusive for guid: {guid}", guid);
                    throw new GraphQLException(new Error("The record not found", "500"));
                }

                dbTSteamingExclusive.tariff_cleaning_guid = UpdateSteamingExclusive.tariff_cleaning_guid;
                dbTSteamingExclusive.temp_max = UpdateSteamingExclusive.temp_max;
                dbTSteamingExclusive.temp_min = UpdateSteamingExclusive.temp_min;
                dbTSteamingExclusive.labour = UpdateSteamingExclusive.labour;
                dbTSteamingExclusive.remarks = UpdateSteamingExclusive.remarks;
                dbTSteamingExclusive.update_by = uid;
                dbTSteamingExclusive.update_dt = currentDateTime;

                if (string.IsNullOrEmpty(UpdateSteamingExclusive.package_steaming.guid))
                {
                    logger.LogWarning("Package steaming guid cannot be null");
                    throw new GraphQLException(new Error("Package steaming guid cannot be null", "Error"));
                }
   
                var updatePackageSteam = new package_steaming() { guid = UpdateSteamingExclusive.package_steaming.guid };
                context.package_steaming.Attach(updatePackageSteam);
                updatePackageSteam.customer_company_guid = UpdateSteamingExclusive.package_steaming.customer_company_guid;
                updatePackageSteam.cost = UpdateSteamingExclusive.package_steaming.cost;
                updatePackageSteam.labour = UpdateSteamingExclusive.package_steaming.labour;
                updatePackageSteam.remarks = UpdateSteamingExclusive.remarks;
                updatePackageSteam.update_by = uid;
                updatePackageSteam.remarks = UpdateSteamingExclusive.remarks;


                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in UpdateSteamingExclusive");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }

        public async Task<int> DeleteSteamingExclusive(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<PackageQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteSteamExclusive_guids)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var steamsExclusive = context.steaming_exclusive.Where(s => DeleteSteamExclusive_guids.Contains(s.guid) && s.delete_dt == null).ToList();
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                foreach (var sE in steamsExclusive)
                {
                    sE.delete_dt = currentDateTime;
                    sE.update_by = uid;
                    sE.update_dt = currentDateTime;
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {

                logger.LogError(ex, "Error in DeleteSteamingExclusive");
                // Return a GraphQL friendly error
                throw new GraphQLException(
                    ErrorBuilder.New()
                        .SetMessage(ex.Message)
                        .SetCode(graphqlErrorCode)
                        .Build());
            }
            return retval;
        }
        #endregion

    }
}


