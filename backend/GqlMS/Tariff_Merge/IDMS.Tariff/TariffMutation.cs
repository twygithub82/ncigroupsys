using CommonUtil.Core.Service;
using IDMS.Models.Package;
using IDMS.Models.Shared;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Models.Tariff.GqlTypes
{
    public class TariffMutation
    {
        const string graphqlErrorCode = "ERROR";

        #region Tariff Depot methods

        public async Task<int> AddTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_depot NewTariffDepot, [Service] ILogger<TariffQuery> logger)
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
                newTariffDepot.gate_in_cost = CalculateMaterialCostRoundedUp(NewTariffDepot.gate_in_cost);
                newTariffDepot.gate_out_cost = CalculateMaterialCostRoundedUp(NewTariffDepot.gate_out_cost);
                newTariffDepot.preinspection_cost = CalculateMaterialCostRoundedUp(NewTariffDepot.preinspection_cost);
                newTariffDepot.lolo_cost = CalculateMaterialCostRoundedUp(NewTariffDepot.lolo_cost);
                newTariffDepot.storage_cost = CalculateMaterialCostRoundedUp(NewTariffDepot.storage_cost);
                newTariffDepot.free_storage = NewTariffDepot.free_storage;
                if (NewTariffDepot.tanks != null)
                {
                    var tankGuids = NewTariffDepot.tanks.Select(t1 => t1.guid).ToList();
                    var tanks = context.tank.Where(t => tankGuids.Contains(t.guid)).ToList();

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
                newTariffDepot.update_by = uid;
                newTariffDepot.update_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_depot.Add(newTariffDepot);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffDepot");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }


            return retval;
        }


        //public async Task<int> UpdateTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
        //    [Service] IHttpContextAccessor httpContextAccessor, tariff_depot UpdateTariffDepot)
        //{
        //    int retval = 0;
        //    try
        //    {

        //        var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        var guid = UpdateTariffDepot.guid;
        //        var dbTariffDepot = context.tariff_depot.Where(t => t.guid == guid).Include(t => t.tanks).FirstOrDefault();

        //        if (dbTariffDepot == null)
        //        {
        //            throw new GraphQLException(new Error("The Depot Cost not found", "500"));
        //        }
        //        dbTariffDepot.description = UpdateTariffDepot.description;
        //        dbTariffDepot.profile_name = UpdateTariffDepot.profile_name;
        //        // newTariffClean.cost = NewTariffClean.cost;
        //        dbTariffDepot.preinspection_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.preinspection_cost);
        //        dbTariffDepot.lolo_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.lolo_cost);
        //        dbTariffDepot.storage_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.storage_cost);
        //        dbTariffDepot.free_storage = UpdateTariffDepot.free_storage;
        //        dbTariffDepot.gate_in_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.gate_in_cost);
        //        dbTariffDepot.gate_out_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.gate_out_cost);
        //        // dbTariffDepot.unit_type_cv = UpdateTariffDepot.unit_type_cv;
        //        dbTariffDepot.tanks = UpdateTariffDepot.tanks;
        //        dbTariffDepot.update_by = uid;
        //        dbTariffDepot.update_dt = GqlUtils.GetNowEpochInSec();

        //        if (UpdateTariffDepot.tanks != null)
        //        {
        //            var tankGuids = UpdateTariffDepot.tanks.Select(t1 => t1.guid).ToList();
        //            var tanks = context.tank.Where(t => tankGuids.Contains(t.guid)).ToList();

        //            // newTariffDepot.tanks = NewTariffDepot.tanks;
        //            // context.tank.
        //            //newTariffDepot.unit_type_cv = NewTariffDepot.unit_type_cv;
        //            foreach (var t in dbTariffDepot.tanks)
        //            {
        //                t.tariff_depot_guid = null;
        //                t.update_dt = GqlUtils.GetNowEpochInSec();
        //                t.update_by = uid;
        //            }
        //            foreach (var t in tanks)
        //            {
        //                t.tariff_depot_guid = dbTariffDepot.guid;
        //                t.update_dt = GqlUtils.GetNowEpochInSec();
        //                t.update_by = uid;
        //            }
        //            dbTariffDepot.tanks = tanks;
        //        }

        //        retval = await context.SaveChangesAsync();

        //    }
        //    catch (Exception ex)
        //    {
        //        Console.WriteLine(ex.StackTrace);
        //        throw ex;
        //    }
        //    return retval;
        //}


        public async Task<int> UpdateTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, tariff_depot UpdateTariffDepot, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                var guid = UpdateTariffDepot.guid;
                var dbTariffDepot = context.tariff_depot.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffDepot == null)
                {
                    throw new GraphQLException(new Error("The Depot Cost not found", "500"));
                }
                dbTariffDepot.description = UpdateTariffDepot.description;
                dbTariffDepot.profile_name = UpdateTariffDepot.profile_name;
                // newTariffClean.cost = NewTariffClean.cost;
                dbTariffDepot.preinspection_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.preinspection_cost);
                dbTariffDepot.lolo_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.lolo_cost);
                dbTariffDepot.storage_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.storage_cost);
                dbTariffDepot.free_storage = UpdateTariffDepot.free_storage;
                dbTariffDepot.gate_in_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.gate_in_cost);
                dbTariffDepot.gate_out_cost = CalculateMaterialCostRoundedUp(UpdateTariffDepot.gate_out_cost);
                // dbTariffDepot.unit_type_cv = UpdateTariffDepot.unit_type_cv;
                //dbTariffDepot.tanks = UpdateTariffDepot.tanks;
                dbTariffDepot.update_by = uid;
                dbTariffDepot.update_dt = currentDateTime;

                if (UpdateTariffDepot.tanks != null && UpdateTariffDepot.tanks.Count() > 0)
                {
                    var tankGuids = UpdateTariffDepot.tanks.Select(t1 => t1.guid).ToList();

                    //First remove all any existing linked unit-type
                    var existingTanks = context.tank.Where(t => t.tariff_depot_guid == dbTariffDepot.guid).ToList();
                    foreach (var t in existingTanks)
                    {
                        t.tariff_depot_guid = null;
                        t.update_dt = currentDateTime;
                        t.update_by = uid;
                    }


                    //var tankGuids = UpdateTariffDepot.tanks.Select(t1 => t1.guid).ToList();
                    var tanks = context.tank.Where(t => tankGuids.Contains(t.guid)).ToList();
                    foreach (var t in tanks)
                    {
                        t.tariff_depot_guid = dbTariffDepot.guid;
                        t.update_dt = currentDateTime;
                        t.update_by = uid;
                    }

                    //foreach (var t in dbTariffDepot.tanks)
                    //{
                    //    t.tariff_depot_guid = null;
                    //    t.update_dt = GqlUtils.GetNowEpochInSec();
                    //    t.update_by = uid;
                    //}

                    //foreach (var t in tanks)
                    //{
                    //    t.tariff_depot_guid = dbTariffDepot.guid;
                    //    t.update_dt = currentDateTime;
                    //    t.update_by = uid;
                    //}

                }
                else
                {
                    var tanks = context.tank.Where(t => t.tariff_depot_guid == dbTariffDepot.guid).ToList();
                    foreach (var t in tanks)
                    {
                        t.tariff_depot_guid = null;
                        t.update_dt = currentDateTime;
                        t.update_by = uid;
                    }
                }

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffDepot");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffDepot_guids, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    List<string?> deletedTariffGuid = new List<string?>();
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var delTariffCleans = await context.tariff_depot.Where(s => DeleteTariffDepot_guids.Contains(s.guid) && s.delete_dt == null).Include(t => t.tanks).ToListAsync();

                    foreach (var delTariffClean in delTariffCleans)
                    {
                        delTariffClean.delete_dt = currentDateTime;
                        delTariffClean.update_by = uid;
                        delTariffClean.update_dt = currentDateTime;
                        foreach (var t in delTariffClean.tanks)
                        {
                            t.tariff_depot_guid = null;
                            t.update_dt = currentDateTime;
                            t.update_by = uid;
                        }

                        //Add the deleted guid into list
                        deletedTariffGuid.Add(delTariffClean.guid);
                    }
                    retval = await context.SaveChangesAsync();

                    foreach (var guid in deletedTariffGuid)
                    {
                        var count = await context.package_depot.Where(b => b.tariff_depot_guid == guid)
                                        .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.delete_dt, currentDateTime)
                                                                  .SetProperty(b => b.update_dt, currentDateTime)
                                                                  .SetProperty(b => b.update_by, uid));
                        retval = retval + count;
                    }
                    await transaction.CommitAsync();

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Error in DeleteTariffDepot");
                    throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
                }
            }

            return retval;
        }
        #endregion Tariff Depot methods

        #region Tariff Cleaning methods

        public async Task<int> AddTariffCleaning(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_cleaning NewTariffClean, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                NewTariffClean.guid = (string.IsNullOrEmpty(NewTariffClean.guid) ? Util.GenerateGUID() : NewTariffClean.guid);
                var newTariffClean = new tariff_cleaning();
                newTariffClean.guid = NewTariffClean.guid;
                newTariffClean.description = NewTariffClean.description;
                newTariffClean.alias = NewTariffClean.alias;
                newTariffClean.cargo = NewTariffClean.cargo;
                newTariffClean.un_no = NewTariffClean.un_no;
                newTariffClean.class_cv = NewTariffClean.class_cv;
                newTariffClean.cleaning_category_guid = NewTariffClean.cleaning_category_guid;
                newTariffClean.cleaning_method_guid = NewTariffClean.cleaning_method_guid;
                newTariffClean.ban_type_cv = NewTariffClean.ban_type_cv;
                newTariffClean.depot_note = NewTariffClean.depot_note;
                newTariffClean.flash_point = NewTariffClean.flash_point;
                newTariffClean.hazard_level_cv = NewTariffClean.hazard_level_cv;
                newTariffClean.nature_cv = NewTariffClean.nature_cv;
                newTariffClean.open_on_gate_cv = NewTariffClean.open_on_gate_cv;
                newTariffClean.alias = NewTariffClean.alias;
                newTariffClean.in_gate_alert = NewTariffClean.in_gate_alert;
                newTariffClean.remarks = NewTariffClean.remarks;

                newTariffClean.create_by = uid;
                newTariffClean.create_dt = currentDateTime;
                newTariffClean.update_by = uid;
                newTariffClean.update_dt = currentDateTime;

                context.tariff_cleaning.Add(newTariffClean);

                await UpdateUNToTable(context, NewTariffClean.un_no, NewTariffClean.class_cv, uid, currentDateTime);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffCleaning");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }


            return retval;
        }


        public async Task<int> UpdateTariffClean(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<TariffQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_cleaning UpdateTariffClean)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var currentDateTime = GqlUtils.GetNowEpochInSec();

                var guid = UpdateTariffClean.guid;
                var dbTariffClean = context.tariff_cleaning.Find(guid);

                if (dbTariffClean == null)
                {
                    logger.LogError("The Cleaning Procedure not found for guid: {Guid}", guid); 
                    throw new GraphQLException(new Error("The Cleaning Procedure not found", "500"));
                }

                dbTariffClean.description = UpdateTariffClean.description;
                dbTariffClean.cargo = UpdateTariffClean.cargo;
                dbTariffClean.un_no = UpdateTariffClean.un_no;
                dbTariffClean.cleaning_category_guid = UpdateTariffClean.cleaning_category_guid;
                dbTariffClean.cleaning_method_guid = UpdateTariffClean.cleaning_method_guid;
                dbTariffClean.ban_type_cv = UpdateTariffClean.ban_type_cv;
                dbTariffClean.class_cv = UpdateTariffClean.class_cv;
                dbTariffClean.depot_note = UpdateTariffClean.depot_note;
                dbTariffClean.flash_point = UpdateTariffClean.flash_point;
                dbTariffClean.hazard_level_cv = UpdateTariffClean.hazard_level_cv;
                dbTariffClean.nature_cv = UpdateTariffClean.nature_cv;
                dbTariffClean.open_on_gate_cv = UpdateTariffClean.open_on_gate_cv;
                dbTariffClean.alias = UpdateTariffClean.alias;
                dbTariffClean.in_gate_alert = UpdateTariffClean.in_gate_alert;
                dbTariffClean.remarks = UpdateTariffClean.remarks;
                dbTariffClean.update_by = uid;
                dbTariffClean.update_dt = currentDateTime;

                await UpdateUNToTable(context, UpdateTariffClean.un_no, UpdateTariffClean.class_cv, uid, currentDateTime);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffClean");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffClean(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<TariffQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffClean_guids)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = await context.tariff_cleaning.Where(s => DeleteTariffClean_guids.Contains(s.guid) && s.delete_dt == null).ToListAsync();


                foreach (var delTariffClean in delTariffCleans)
                {
                    delTariffClean.delete_dt = currentDateTime;
                    delTariffClean.update_by = uid;
                    delTariffClean.update_dt = currentDateTime;
                }
                retval = context.SaveChanges();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in DeleteTariffClean");
                throw new GraphQLException(
                        ErrorBuilder.New()
                            .SetMessage(ex.Message)
                            .SetCode(graphqlErrorCode)
                            .Build());
            }
            return retval;
        }

        private async Task<int> UpdateUNToTable(ApplicationTariffDBContext context, string unNo, string classNo, string user, long currentDateTime)
        {
            try
            {
                int ret = 0;
                var res = await context.un_number.Where(u => u.un_no == unNo && u.class_cv == classNo && (u.delete_dt == null || u.delete_dt == 0)).FirstOrDefaultAsync();
                if (res == null)
                {
                    //No such UN and Class found, so need to insert into DB
                    var UN = new un_number();
                    UN.guid = Util.GenerateGUID();
                    UN.un_no = unNo;
                    UN.class_cv = classNo;
                    UN.create_by = user;
                    UN.create_dt = currentDateTime;
                    UN.update_by = user;
                    UN.update_dt = currentDateTime;
                    await context.AddAsync(UN);
                    //ret = await context.SaveChangesAsync();
                }
                return ret;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        #endregion Tariff Cleaning methods

        #region Tariff Buffer methods

        public async Task<int> AddTariffBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_buffer NewTariffBuffer, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffBuffer.guid = (string.IsNullOrEmpty(NewTariffBuffer.guid) ? Util.GenerateGUID() : NewTariffBuffer.guid);
                var newTariffBuffer = new tariff_buffer();
                newTariffBuffer.guid = NewTariffBuffer.guid;
                newTariffBuffer.remarks = NewTariffBuffer.remarks;
                newTariffBuffer.buffer_type = NewTariffBuffer.buffer_type;
                newTariffBuffer.cost = CalculateMaterialCostRoundedUp(NewTariffBuffer.cost);
                newTariffBuffer.create_by = uid;
                newTariffBuffer.create_dt = GqlUtils.GetNowEpochInSec();
                newTariffBuffer.update_by = uid;
                newTariffBuffer.update_dt = GqlUtils.GetNowEpochInSec();

                context.tariff_buffer.Add(newTariffBuffer);

                //change this to use trigger, instead of using code to perform the insert
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffBuffer");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }


            return retval;
        }

        public async Task<int> UpdateTariffBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_buffer UpdateTariffBuffer, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffBuffer.guid;
                var dbTariffBuffer = context.tariff_buffer.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffBuffer == null)
                {
                    logger.LogWarning("The Tariff Buffer not found for guid: {Guid}", guid);
                    throw new GraphQLException(new Error("The Tariff Buffer not found", "500"));
                }

                dbTariffBuffer.remarks = UpdateTariffBuffer.remarks;
                dbTariffBuffer.buffer_type = UpdateTariffBuffer.buffer_type;
                dbTariffBuffer.cost = CalculateMaterialCostRoundedUp(UpdateTariffBuffer.cost);
                dbTariffBuffer.update_by = uid;
                dbTariffBuffer.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffBuffer");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffBuffer_guids, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
            var currentDateTime = GqlUtils.GetNowEpochInSec();

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    List<string?> deletedTariffGuid = new List<string?>();
                    var delTariffBuffers = await context.tariff_buffer.Where(s => DeleteTariffBuffer_guids.Contains(s.guid) && s.delete_dt == null).ToListAsync();
                    foreach (var delTariffBuffer in delTariffBuffers)
                    {
                        delTariffBuffer.delete_dt = currentDateTime;
                        delTariffBuffer.update_by = uid;
                        delTariffBuffer.update_dt = currentDateTime;

                        //Add the deleted guid into list
                        deletedTariffGuid.Add(delTariffBuffer.guid);
                    }
                    retval = await context.SaveChangesAsync();

                    foreach (var guid in deletedTariffGuid)
                    {
                        var count = await context.package_buffer.Where(b => b.tariff_buffer_guid == guid)
                                        .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.delete_dt, currentDateTime)
                                                                  .SetProperty(b => b.update_dt, currentDateTime)
                                                                  .SetProperty(b => b.update_by, uid));
                        retval = retval + count;
                    }
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {  // Rollback the transaction if any errors occur
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Error in DeleteTariffBuffer");
                    throw new GraphQLException(
                                ErrorBuilder.New()
                                    .SetMessage(ex.Message)
                                    .SetCode(graphqlErrorCode)
                                    .Build());
                }
            }
            return retval;
        }
        #endregion Tariff Buffer methods

        #region Tariff Labour methods

        public async Task<int> SyncUpPackageLabours(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var notFoundCCInPackageLabour = context.customer_company.Where(
                                                c => !context.package_labour.Select(
                                                     pl => pl.customer_company_guid).Contains(c.guid))
                                                     .ToArray();

                var trfLabour = context.tariff_labour.Where(tl => tl.delete_dt == null || tl.delete_dt == 0).FirstOrDefault();

                if (trfLabour != null && notFoundCCInPackageLabour.Length > 0)
                {
                    foreach (var cc in notFoundCCInPackageLabour)
                    {
                        var pack_labour = new package_labour();
                        pack_labour.guid = Util.GenerateGUID();
                        pack_labour.tariff_labour_guid = trfLabour.guid;
                        pack_labour.customer_company_guid = cc.guid;
                        pack_labour.cost = trfLabour.cost;
                        pack_labour.remarks = trfLabour.remarks;
                        pack_labour.create_by = uid;
                        pack_labour.create_dt = GqlUtils.GetNowEpochInSec();
                        context.package_labour.Add(pack_labour);
                    }

                    retval = context.SaveChanges();
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in SyncUpPackageLabours");
                throw new GraphQLException(
                            ErrorBuilder.New()
                                .SetMessage(ex.Message)
                                .SetCode(graphqlErrorCode)
                                .Build());
            }
            return retval;
        }

        public async Task<int> AddTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_labour NewTariffLabour, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffLabour.guid = (string.IsNullOrEmpty(NewTariffLabour.guid) ? Util.GenerateGUID() : NewTariffLabour.guid);
                var newTariffLabour = new tariff_labour();
                newTariffLabour.guid = NewTariffLabour.guid;
                newTariffLabour.remarks = NewTariffLabour.remarks;
                newTariffLabour.description = NewTariffLabour.description;
                newTariffLabour.cost = CalculateMaterialCostRoundedUp(NewTariffLabour.cost);
                newTariffLabour.create_by = uid;
                newTariffLabour.create_dt = GqlUtils.GetNowEpochInSec();
                newTariffLabour.update_by = uid;
                newTariffLabour.update_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_labour.Add(newTariffLabour);

                //change this to use trigger, instead of using code to perform the insert
                //var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                //foreach (var customerCompany in customerCompanies)
                //{
                //    var pack_labour = new package_labour();
                //    pack_labour.guid = Util.GenerateGUID();
                //    pack_labour.tariff_labour_guid = newTariffLabour.guid;
                //    pack_labour.customer_company_guid = customerCompany.guid;
                //    pack_labour.cost = newTariffLabour.cost;
                //    pack_labour.remarks = newTariffLabour.remarks;
                //    pack_labour.create_by = uid;
                //    pack_labour.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.package_labour.Add(pack_labour);
                //}

                retval = await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffLabour");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        public async Task<int> UpdateTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_labour UpdateTariffLabour, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffLabour.guid;
                var dbTariffLabour = context.tariff_labour.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffLabour == null)
                {
                    logger.LogWarning("The Tariff Labour not found for guid: {Guid}", guid);
                    throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                }

                dbTariffLabour.remarks = UpdateTariffLabour.remarks;
                dbTariffLabour.description = UpdateTariffLabour.description;
                dbTariffLabour.cost = CalculateMaterialCostRoundedUp(UpdateTariffLabour.cost);
                dbTariffLabour.update_by = uid;
                dbTariffLabour.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffLabour");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffLabour_guids, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffLabours = context.tariff_labour.Where(s => DeleteTariffLabour_guids.Contains(s.guid) && s.delete_dt == null).ToList();


                foreach (var delTariffLabour in delTariffLabours)
                {
                    delTariffLabour.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffLabour.update_by = uid;
                    delTariffLabour.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in DeleteTariffLabour");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }
        #endregion Tariff Labour methods

        #region Tariff Residue methods

        public async Task<int> AddTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_residue NewTariffResidue, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            //_context = context;

            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var curDate = GqlUtils.GetNowEpochInSec();

                NewTariffResidue.guid = (string.IsNullOrEmpty(NewTariffResidue.guid) ? Util.GenerateGUID() : NewTariffResidue.guid);
                var newTariffResidue = new tariff_residue();
                newTariffResidue.guid = NewTariffResidue.guid;
                newTariffResidue.remarks = NewTariffResidue.remarks;
                newTariffResidue.description = NewTariffResidue.description;
                newTariffResidue.cost = CalculateMaterialCostRoundedUp(NewTariffResidue.cost);
                newTariffResidue.create_by = uid;
                newTariffResidue.create_dt = curDate;
                newTariffResidue.update_by = uid;
                newTariffResidue.update_dt = curDate;
                context.tariff_residue.Add(newTariffResidue);

                //change this to use trigger, instead of using code to perform the insert
                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffResidue");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }


        public async Task<int> UpdateTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_residue UpdateTariffResidue, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffResidue.guid;
                var dbTariffResidue = context.tariff_residue.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffResidue == null)
                {
                    logger.LogWarning("The Tariff Residue not found for guid: {Guid}", guid);
                    throw new GraphQLException(new Error("The Tariff Residue not found", "500"));
                }

                dbTariffResidue.remarks = UpdateTariffResidue.remarks;
                dbTariffResidue.description = UpdateTariffResidue.description;
                dbTariffResidue.cost = CalculateMaterialCostRoundedUp(UpdateTariffResidue.cost);
                dbTariffResidue.update_by = uid;
                dbTariffResidue.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffResidue");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<TariffQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffResidue_guids)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    List<string?> deletedTariffGuid = new List<string?>();
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var delTariffResidues = await context.tariff_residue.Where(s => DeleteTariffResidue_guids.Contains(s.guid) && s.delete_dt == null).ToListAsync();

                    foreach (var delTariffResidue in delTariffResidues)
                    {
                        delTariffResidue.delete_dt = currentDateTime;
                        delTariffResidue.update_by = uid;
                        delTariffResidue.update_dt = currentDateTime;

                        //Add the deleted guid into list
                        deletedTariffGuid.Add(delTariffResidue.guid);
                    }
                    retval = context.SaveChanges();

                    foreach (var guid in deletedTariffGuid)
                    {
                        var count = await context.package_residue.Where(b => b.tariff_residue_guid == guid)
                                        .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.delete_dt, currentDateTime)
                                                                            .SetProperty(b => b.update_dt, currentDateTime)
                                                                            .SetProperty(b => b.update_by, uid));
                        retval = retval + count;
                    }
                    await transaction.CommitAsync();

                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Error in DeleteTariffResidue");
                    throw new GraphQLException(
                                 ErrorBuilder.New()
                                     .SetMessage(ex.Message)
                                     .SetCode(graphqlErrorCode)
                                     .Build());
                }
            }
            return retval;
        }

        #endregion Tariff Labour methods

        #region Tariff Repair methods

        public async Task<int> AddTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_repair NewTariffRepair, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffRepair.guid = (string.IsNullOrEmpty(NewTariffRepair.guid) ? Util.GenerateGUID() : NewTariffRepair.guid);
                var newTariffRepair = new tariff_repair();
                newTariffRepair.guid = NewTariffRepair.guid;
                newTariffRepair.remarks = NewTariffRepair.remarks;
                newTariffRepair.alias = NewTariffRepair.alias;
                newTariffRepair.dimension = NewTariffRepair.dimension;
                newTariffRepair.height_diameter = NewTariffRepair.height_diameter;
                newTariffRepair.height_diameter_unit_cv = NewTariffRepair.height_diameter_unit_cv;
                newTariffRepair.group_name_cv = NewTariffRepair.group_name_cv;
                newTariffRepair.subgroup_name_cv = NewTariffRepair.subgroup_name_cv;
                newTariffRepair.width_diameter = NewTariffRepair.width_diameter;
                newTariffRepair.width_diameter_unit_cv = NewTariffRepair.width_diameter_unit_cv;
                newTariffRepair.labour_hour = NewTariffRepair.labour_hour;
                newTariffRepair.length = NewTariffRepair.length;
                newTariffRepair.length_unit_cv = NewTariffRepair.length_unit_cv;
                newTariffRepair.material_cost = CalculateMaterialCostRoundedUp(NewTariffRepair.material_cost);
                newTariffRepair.part_name = NewTariffRepair.part_name;
                newTariffRepair.thickness = NewTariffRepair.thickness;
                newTariffRepair.thickness_unit_cv = NewTariffRepair.thickness_unit_cv;
                newTariffRepair.create_by = uid;
                newTariffRepair.create_dt = GqlUtils.GetNowEpochInSec();
                newTariffRepair.update_by = uid;
                newTariffRepair.update_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_repair.Add(newTariffRepair);

                //change this to use trigger, instead of using code to perform the insert
                //var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                //foreach (var customerCompany in customerCompanies)
                //{
                //    var pack_repair = new package_repair();
                //    pack_repair.guid = Util.GenerateGUID();
                //    pack_repair.tariff_repair_guid = newTariffRepair.guid;
                //    pack_repair.customer_company_guid = customerCompany.guid;
                //    pack_repair.material_cost = newTariffRepair.material_cost;
                //    pack_repair.labour_hour = newTariffRepair.labour_hour;
                //    pack_repair.remarks = newTariffRepair.remarks;
                //    pack_repair.create_by = uid;
                //    pack_repair.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.package_repair.Add(pack_repair);
                //}

                retval = await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffRepair");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }   

            return retval;
        }


        public async Task<int> UpdateTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_repair UpdateTariffRepair, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffRepair.guid;
                var dbTariffRepair = context.tariff_repair.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffRepair == null)
                {
                    logger.LogWarning("The Tariff Repair not found for guid: {Guid}", guid);
                    throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                }

                dbTariffRepair.remarks = UpdateTariffRepair.remarks;
                dbTariffRepair.dimension = UpdateTariffRepair.dimension;
                dbTariffRepair.alias = UpdateTariffRepair.alias;
                dbTariffRepair.dimension = UpdateTariffRepair.dimension;
                dbTariffRepair.height_diameter = UpdateTariffRepair.height_diameter;
                dbTariffRepair.height_diameter_unit_cv = UpdateTariffRepair.height_diameter_unit_cv;
                dbTariffRepair.group_name_cv = UpdateTariffRepair.group_name_cv;
                dbTariffRepair.subgroup_name_cv = UpdateTariffRepair.subgroup_name_cv;
                dbTariffRepair.width_diameter = UpdateTariffRepair.width_diameter;
                dbTariffRepair.width_diameter_unit_cv = UpdateTariffRepair.width_diameter_unit_cv;
                dbTariffRepair.labour_hour = UpdateTariffRepair.labour_hour;
                dbTariffRepair.length = UpdateTariffRepair.length;
                dbTariffRepair.length_unit_cv = UpdateTariffRepair.length_unit_cv;
                dbTariffRepair.material_cost = CalculateMaterialCostRoundedUp(UpdateTariffRepair.material_cost);
                dbTariffRepair.part_name = UpdateTariffRepair.part_name;
                dbTariffRepair.thickness = UpdateTariffRepair.thickness;
                dbTariffRepair.thickness_unit_cv = UpdateTariffRepair.thickness_unit_cv;

                dbTariffRepair.update_by = uid;
                dbTariffRepair.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffRepair");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        public async Task<int> UpdateTariffRepairs(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> updatedTariffRepair_guids, string group_name_cv, string subgroup_name_cv,
            string dimension, double height_diameter, string height_diameter_unit_cv, double width_diameter, string width_diameter_unit_cv, double labour_hour, double length,
            string length_unit_cv, double material_cost, string part_name, string alias, double thickness, string thickness_unit_cv, string remarks, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbTariffRepairs = context.tariff_repair.Where(t => updatedTariffRepair_guids.Contains(t.guid)).ToArray();

                if (dbTariffRepairs == null)
                {
                    logger.LogError("The Tariff Labour not found");
                    throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                }

                foreach (var r in dbTariffRepairs)
                {
                    if (!string.IsNullOrEmpty(group_name_cv)) r.group_name_cv = group_name_cv;
                    if (!string.IsNullOrEmpty(subgroup_name_cv)) r.subgroup_name_cv = subgroup_name_cv;
                    if (!string.IsNullOrEmpty(dimension)) r.dimension = dimension;
                    if (height_diameter > 0) r.height_diameter = height_diameter;
                    if (!string.IsNullOrEmpty(height_diameter_unit_cv)) r.height_diameter_unit_cv = height_diameter_unit_cv;
                    if (width_diameter > 0) r.width_diameter = width_diameter;
                    if (!string.IsNullOrEmpty(width_diameter_unit_cv)) r.width_diameter_unit_cv = width_diameter_unit_cv;
                    if (labour_hour > 0) r.labour_hour = labour_hour;
                    if (length > 0) r.length = length;
                    if (!string.IsNullOrEmpty(length_unit_cv)) r.length_unit_cv = length_unit_cv;
                    if (material_cost > 0) r.material_cost = CalculateMaterialCostRoundedUp(material_cost);
                    if (thickness > 0) r.thickness = thickness;
                    if (!string.IsNullOrEmpty(part_name)) r.part_name = part_name;
                    if (!string.IsNullOrEmpty(thickness_unit_cv)) r.thickness_unit_cv = thickness_unit_cv;
                    if (!string.IsNullOrEmpty(remarks)) r.remarks = remarks;
                    r.update_by = uid;
                    r.update_dt = GqlUtils.GetNowEpochInSec();
                }

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffRepairs");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }


        public async Task<int> UpdateTariffRepair_MaterialCost(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<TariffQuery> logger,
            [Service] IHttpContextAccessor httpContextAccessor, List<string>? group_name_cv, List<string>? subgroup_name_cv, string? part_name, string? dimension,
            int? length, List<string?>? guid, double material_cost_percentage, double labour_hour_percentage) // double labor_hour_percentage
        {
            int retval = 0;
            bool isAll = true;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = GqlUtils.GetNowEpochInSec();

                    var dbTariffRepairs = await context.tariff_repair.Where(i => i.delete_dt == null || i.delete_dt == 0).ToArrayAsync();
                    if (guid != null && guid.Any())
                    {
                        dbTariffRepairs = dbTariffRepairs.Where(t => guid.Contains(t.guid)).ToArray();
                        isAll = false;
                    }
                    else
                    {
                        if (group_name_cv != null && group_name_cv.Any())
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => group_name_cv.Contains(t.group_name_cv)).ToArray();
                            isAll = false;
                        }
                        if (subgroup_name_cv != null && subgroup_name_cv.Any())
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => subgroup_name_cv.Contains(t.subgroup_name_cv)).ToArray();
                            isAll = false;
                        }

                        if (!string.IsNullOrEmpty(part_name))
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => part_name.EqualsIgnore(t.part_name ?? "")).ToArray();
                            isAll = false;
                        }
                        if (!string.IsNullOrEmpty(dimension))
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => t.dimension == dimension).ToArray();
                            isAll = false;
                        }
                        if (length != null)
                        {
                            if (length > 0)
                            {
                                dbTariffRepairs = dbTariffRepairs.Where(t => t.length == length).ToArray();
                                isAll = false;
                            }
                        }
                    }


                    if (dbTariffRepairs == null)
                    {
                        logger.LogError("The Tariff Labour not found");
                        throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                    }

                    if (isAll)
                    {
                        retval = await context.tariff_repair.ExecuteUpdateAsync(s => s
                          .SetProperty(e => e.update_dt, currentDateTime)
                          .SetProperty(e => e.update_by, uid)
                          //.SetProperty(e => e.material_cost, e => (Math.Round(Convert.ToDouble(e.material_cost * material_cost_percentage), 2)))
                          .SetProperty(e => e.material_cost, e => (Math.Ceiling(Convert.ToDouble((e.material_cost * material_cost_percentage) * 20)) / 20.0))
                          //.SetProperty(e => e.material_cost, e => CalculateMaterialCostRoundedUp(e.material_cost * material_cost_percentage))
                          .SetProperty(e => e.labour_hour, e => (Math.Ceiling(Convert.ToDouble((e.labour_hour ?? 0) * labour_hour_percentage) * 4) / 4))
                           );
                    }
                    else
                    {
                        var guids = dbTariffRepairs.Select(p => p.guid).ToList();
                        string guidList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));

                        //string sql = $"UPDATE tariff_repair SET material_cost = (ROUND(material_cost * {material_cost_percentage}, 2)), " +
                        //             $"labour_hour = (CEILING(COALESCE(labour_hour, 0.0) * {labour_hour_percentage} * 4.0) / 4.0), " +
                        //             $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                        //             $"WHERE guid IN ({guidList})";


                        string sql = $"UPDATE tariff_repair SET material_cost = (CEILING(COALESCE(material_cost, 0.0) * {material_cost_percentage} * 20.0) / 20.0), " +
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

                    logger.LogError(ex, "Error in UpdateTariffRepair_MaterialCost");
                    throw new GraphQLException(
                                     ErrorBuilder.New()
                                         .SetMessage(ex.Message)
                                         .SetCode(graphqlErrorCode)
                                         .Build());
                }
            }

            return retval;
        }

        private double CalculateMaterialCostRoundedUp(double? materialCost)
        {
            if (materialCost == 0.0)
                return 0.0;

            double result = Math.Ceiling(Convert.ToDouble(materialCost * 20)) / 20.0;
            return result;
        }

        public async Task<int> DeleteTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffRepair_guids, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            var currentDateTime = GqlUtils.GetNowEpochInSec();

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    List<string?> deletedTariffGuid = new List<string?>();
                    var delTariffRepairs = await context.tariff_repair.Where(s => DeleteTariffRepair_guids.Contains(s.guid) && s.delete_dt == null).ToListAsync();

                    foreach (var delTariffRepair in delTariffRepairs)
                    {
                        delTariffRepair.delete_dt = currentDateTime;
                        delTariffRepair.update_by = uid;
                        delTariffRepair.update_dt = currentDateTime;

                        //Add the deleted guid into list
                        deletedTariffGuid.Add(delTariffRepair.guid);
                    }
                    retval = await context.SaveChangesAsync();

                    foreach (var guid in deletedTariffGuid)
                    {
                        var count = await context.package_repair.Where(b => b.tariff_repair_guid == guid)
                                        .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.delete_dt, currentDateTime)
                                                                              .SetProperty(b => b.update_dt, currentDateTime)
                                                                              .SetProperty(b => b.update_by, uid));
                        retval = retval + count;
                    }
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Error in DeleteTariffRepair");
                    throw new GraphQLException(
                                 ErrorBuilder.New()
                                     .SetMessage(ex.Message)
                                     .SetCode(graphqlErrorCode)
                                     .Build());
                }
            }


            return retval;
        }
        #endregion Tariff Repair methods

        #region Tariff Steaming methods

        public async Task<int> AddTariffSteaming(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_steaming NewTariffSteaming, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                NewTariffSteaming.guid = (string.IsNullOrEmpty(NewTariffSteaming.guid) ? Util.GenerateGUID() : NewTariffSteaming.guid);
                var newTariffSteaming = new tariff_steaming();
                newTariffSteaming.guid = NewTariffSteaming.guid;
                newTariffSteaming.temp_max = NewTariffSteaming.temp_max;
                newTariffSteaming.temp_min = NewTariffSteaming.temp_min;
                newTariffSteaming.labour = NewTariffSteaming.labour;
                newTariffSteaming.cost = CalculateMaterialCostRoundedUp(NewTariffSteaming.cost);
                newTariffSteaming.remarks = NewTariffSteaming.remarks;
                newTariffSteaming.create_by = uid;
                newTariffSteaming.create_dt = GqlUtils.GetNowEpochInSec();
                newTariffSteaming.update_by = uid;
                newTariffSteaming.update_dt = GqlUtils.GetNowEpochInSec();
                await context.tariff_steaming.AddAsync(newTariffSteaming);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddTariffSteaming");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }


            return retval;
        }


        public async Task<int> UpdateTariffSteaming(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_steaming UpdateTariffSteaming, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffSteaming.guid;
                var dbTariffSteaming = context.tariff_steaming.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffSteaming == null)
                {
                    logger.LogWarning("Tariff steaming not found"); 
                    throw new GraphQLException(new Error("Tariff steaming not found", "500"));
                }

                dbTariffSteaming.temp_max = UpdateTariffSteaming.temp_max;
                dbTariffSteaming.temp_min = UpdateTariffSteaming.temp_min;
                dbTariffSteaming.labour = UpdateTariffSteaming.labour;
                dbTariffSteaming.cost = CalculateMaterialCostRoundedUp(UpdateTariffSteaming.cost);
                dbTariffSteaming.remarks = UpdateTariffSteaming.remarks;
                dbTariffSteaming.update_by = uid;
                dbTariffSteaming.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in UpdateTariffSteaming");
                throw new GraphQLException(
                             ErrorBuilder.New()
                                 .SetMessage(ex.Message)
                                 .SetCode(graphqlErrorCode)
                                 .Build());
            }
            return retval;
        }

        public async Task<int> DeleteTariffSteaming(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffSteam_guids, [Service] ILogger<TariffQuery> logger)
        {
            int retval = 0;
            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    List<string?> deletedTariffGuid = new List<string?>();
                    var delTariffSteaming = await context.tariff_steaming.Where(s => DeleteTariffSteam_guids.Contains(s.guid) && s.delete_dt == null).ToListAsync();
                    var currentDateTime = GqlUtils.GetNowEpochInSec();

                    foreach (var delTariffSteam in delTariffSteaming)
                    {
                        delTariffSteam.delete_dt = currentDateTime;
                        delTariffSteam.update_by = uid;
                        delTariffSteam.update_dt = currentDateTime;

                        //Add the deleted guid into list
                        deletedTariffGuid.Add(delTariffSteam.guid);
                    }
                    retval = await context.SaveChangesAsync();

                    foreach (var guid in deletedTariffGuid)
                    {
                        var count = await context.package_steaming.Where(b => b.tariff_steaming_guid == guid)
                                        .ExecuteUpdateAsync(setters => setters.SetProperty(b => b.delete_dt, currentDateTime)
                                                                              .SetProperty(b => b.update_dt, currentDateTime)
                                                                              .SetProperty(b => b.update_by, uid));
                        retval = retval + count;
                    }
                    await transaction.CommitAsync();
                }
                catch (Exception ex)
                {
                    await transaction.RollbackAsync();
                    logger.LogError(ex, "Error in DeleteTariffSteaming");
                    throw new GraphQLException(
                                 ErrorBuilder.New()
                                     .SetMessage(ex.Message)
                                     .SetCode(graphqlErrorCode)
                                     .Build());
                }
            }


            return retval;
        }
        #endregion Tariff Steaming methods

        #region AddUnNO&Class

        public async Task<int> AddUN_Number(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] ILogger<TariffQuery> logger,
        [Service] IHttpContextAccessor httpContextAccessor, un_number unNumber)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var res = await context.un_number.Where(u => u.un_no.EqualsIgnore(unNumber.un_no) & (u.class_cv.EqualsIgnore(unNumber.class_cv))).FirstOrDefaultAsync();
                if (res != null)
                {
                    logger.LogWarning("Duplicate UN_No & class not allowed");
                    throw new GraphQLException(new Error("Duplicate UN_No & class not allowed", "Error"));
                }


                var newUnNo = new un_number();
                newUnNo.guid = (string.IsNullOrEmpty(unNumber.guid) ? Util.GenerateGUID() : unNumber.guid);

                newUnNo.class_cv = unNumber.class_cv;
                newUnNo.create_by = uid;
                newUnNo.create_dt = GqlUtils.GetNowEpochInSec();
                newUnNo.update_by = uid;
                newUnNo.update_dt = GqlUtils.GetNowEpochInSec();
                context.un_number.Add(newUnNo);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Error in AddUN_Number");
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
