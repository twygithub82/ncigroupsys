using CommonUtil.Core.Service;
using IDMS.Models.Package;
using IDMS.Models.Shared;
using IDMS.Models.Tariff.Cleaning.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static System.Net.Mime.MediaTypeNames;

namespace IDMS.Models.Tariff.GqlTypes
{
    public class TariffMutation
    {
        #region Tariff Depot methods

        public async Task<int> AddTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
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
                newTariffDepot.gate_in_cost = NewTariffDepot.gate_in_cost;
                newTariffDepot.gate_out_cost = NewTariffDepot.gate_out_cost;
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

                //change this to use trigger, instead of using code to perform the insert
                //var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                //foreach (var customerCompany in customerCompanies)
                //{
                //    var pack_depot = new package_depot();
                //    pack_depot.guid = Util.GenerateGUID();
                //    pack_depot.tariff_depot_guid = newTariffDepot.guid;
                //    pack_depot.customer_company_guid = customerCompany.guid;
                //    pack_depot.free_storage = newTariffDepot.free_storage;
                //    pack_depot.lolo_cost = newTariffDepot.lolo_cost;
                //    pack_depot.preinspection_cost = newTariffDepot.preinspection_cost;
                //    pack_depot.storage_cost = newTariffDepot.storage_cost;
                //    pack_depot.gate_in_cost = newTariffDepot.gate_in_cost;
                //    pack_depot.gate_out_cost = newTariffDepot.gate_out_cost;
                //    pack_depot.storage_cal_cv = "TANK_IN_DATE";
                //    pack_depot.create_by = uid;
                //    pack_depot.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.package_depot.Add(pack_depot);
                //}

                retval = await context.SaveChangesAsync();
            }
            catch { throw; }


            return retval;
        }


        public async Task<int> UpdateTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_depot UpdateTariffDepot)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffDepot.guid;
                var dbTariffDepot = context.tariff_depot.Where(t => t.guid == guid).Include(t => t.tanks).FirstOrDefault();

                if (dbTariffDepot == null)
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
                dbTariffDepot.gate_in_cost = UpdateTariffDepot.gate_in_cost;
                dbTariffDepot.gate_out_cost = UpdateTariffDepot.gate_out_cost;
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
                    foreach (var t in dbTariffDepot.tanks)
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

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffDepot(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffDepot_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = context.tariff_depot.Where(s => DeleteTariffDepot_guids.Contains(s.guid) && s.delete_dt == null).Include(t => t.tanks).ToList();


                foreach (var delTariffClean in delTariffCleans)
                {
                    delTariffClean.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffClean.update_by = uid;
                    delTariffClean.update_dt = GqlUtils.GetNowEpochInSec();
                    foreach (var t in delTariffClean.tanks)
                    {
                        t.tariff_depot_guid = null;
                        t.update_dt = GqlUtils.GetNowEpochInSec();
                        t.update_by = uid;
                    }
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
        #endregion Tariff Depot methods

        #region Tariff Cleaning methods

        public async Task<int> AddTariffCleaning(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_cleaning NewTariffClean)
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
                context.tariff_cleaning.Add(newTariffClean);

                await UpdateUNToTable(context, NewTariffClean.un_no, NewTariffClean.class_cv, uid, currentDateTime);

                retval = await context.SaveChangesAsync();
            }
            catch (Exception ex)
            {
                throw;
            }


            return retval;
        }


        public async Task<int> UpdateTariffClean(ApplicationTariffDBContext context, [Service] IConfiguration config,
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
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffClean(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffClean_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffCleans = context.tariff_cleaning.Where(s => DeleteTariffClean_guids.Contains(s.guid) && s.delete_dt == null);


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
            [Service] IHttpContextAccessor httpContextAccessor, tariff_buffer NewTariffBuffer)
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
                newTariffBuffer.cost = NewTariffBuffer.cost;
                newTariffBuffer.create_by = uid;
                newTariffBuffer.create_dt = GqlUtils.GetNowEpochInSec();
                context.tariff_buffer.Add(newTariffBuffer);

                //change this to use trigger, instead of using code to perform the insert
                //var customerCompaniesGuid = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null)
                //                                                .Select(c => c.guid).ToArray();
                //foreach (var guid in customerCompaniesGuid)
                //{
                //    var pack_buffer = new package_buffer();
                //    pack_buffer.guid = Util.GenerateGUID();
                //    pack_buffer.tariff_buffer_guid = NewTariffBuffer.guid;
                //    pack_buffer.customer_company_guid = guid;
                //    pack_buffer.remarks = NewTariffBuffer.remarks;
                //    pack_buffer.cost = NewTariffBuffer.cost;

                //    pack_buffer.create_by = uid;
                //    pack_buffer.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.package_buffer.Add(pack_buffer);
                //}

                retval = await context.SaveChangesAsync();
            }
            catch { throw; }


            return retval;
        }


        public async Task<int> UpdateTariffBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_buffer UpdateTariffBuffer)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffBuffer.guid;
                var dbTariffBuffer = context.tariff_buffer.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffBuffer == null)
                {
                    throw new GraphQLException(new Error("The Tariff Buffer not found", "500"));
                }

                dbTariffBuffer.remarks = UpdateTariffBuffer.remarks;
                dbTariffBuffer.buffer_type = UpdateTariffBuffer.buffer_type;
                dbTariffBuffer.cost = UpdateTariffBuffer.cost;
                dbTariffBuffer.update_by = uid;
                dbTariffBuffer.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffBuffer(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffBuffer_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffBuffers = context.tariff_buffer.Where(s => DeleteTariffBuffer_guids.Contains(s.guid) && s.delete_dt == null).ToList();


                foreach (var delTariffBuffer in delTariffBuffers)
                {
                    delTariffBuffer.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffBuffer.update_by = uid;
                    delTariffBuffer.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
        #endregion Tariff Buffer methods

        #region Tariff Labour methods

        public async Task<int> SyncUpPackageLabours(ApplicationTariffDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
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
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> AddTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_labour NewTariffLabour)
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
                newTariffLabour.cost = NewTariffLabour.cost;
                newTariffLabour.create_by = uid;
                newTariffLabour.create_dt = GqlUtils.GetNowEpochInSec();
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
            catch { throw; }


            return retval;
        }

        public async Task<int> UpdateTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_labour UpdateTariffLabour)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffLabour.guid;
                var dbTariffLabour = context.tariff_labour.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffLabour == null)
                {
                    throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                }

                dbTariffLabour.remarks = UpdateTariffLabour.remarks;
                dbTariffLabour.description = UpdateTariffLabour.description;
                dbTariffLabour.cost = UpdateTariffLabour.cost;
                dbTariffLabour.update_by = uid;
                dbTariffLabour.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffLabour(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffLabour_guids)
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
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
        #endregion Tariff Labour methods

        #region Tariff Residue methods

        public async Task<int> AddTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_residue NewTariffResidue)
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
                newTariffResidue.cost = NewTariffResidue.cost;
                newTariffResidue.create_by = uid;
                newTariffResidue.create_dt = curDate;
                context.tariff_residue.Add(newTariffResidue);

                //change this to use trigger, instead of using code to perform the insert
                //var customerCompanies = context.customer_company.Where(cc => cc.delete_dt == 0 || cc.delete_dt == null).ToArray();
                //foreach (var customerCompany in customerCompanies)
                //{
                //    var pack_residue = new package_residue();
                //    pack_residue.guid = Util.GenerateGUID();
                //    pack_residue.remarks = newTariffResidue.remarks;
                //    pack_residue.customer_company_guid = customerCompany.guid;
                //    pack_residue.cost = newTariffResidue.cost;
                //    pack_residue.tariff_residue_guid =newTariffResidue.guid;

                //    pack_residue.create_by = uid;
                //    pack_residue.create_dt = GqlUtils.GetNowEpochInSec();
                //    context.package_residue.Add(pack_residue);
                //}
                retval = await context.SaveChangesAsync();

                //Change this to use trigger, instead of store_procedure
                //Task.Run(() => AddPackageResidueTask(context, uid, NewTariffResidue.guid, NewTariffResidue.remarks, NewTariffResidue.cost, curDate));
            }
            catch { throw; }
            return retval;
        }


        public async Task<int> UpdateTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_residue UpdateTariffResidue)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffResidue.guid;
                var dbTariffResidue = context.tariff_residue.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffResidue == null)
                {
                    throw new GraphQLException(new Error("The Tariff Residue not found", "500"));
                }

                dbTariffResidue.remarks = UpdateTariffResidue.remarks;
                dbTariffResidue.description = UpdateTariffResidue.description;
                dbTariffResidue.cost = UpdateTariffResidue.cost;
                dbTariffResidue.update_by = uid;
                dbTariffResidue.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<int> DeleteTariffResidue(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffResidue_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffResidues = context.tariff_residue.Where(s => DeleteTariffResidue_guids.Contains(s.guid) && s.delete_dt == null).ToList();


                foreach (var delTariffResidue in delTariffResidues)
                {
                    delTariffResidue.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffResidue.update_by = uid;
                    delTariffResidue.update_dt = GqlUtils.GetNowEpochInSec();
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

        //This function is for testing store_procedure purpose
        private async void AddPackageResidueTask(ApplicationTariffDBContext context, string user, string guid, string remarks, double? cost, long date)
        {

            await context.Database.ExecuteSqlRawAsync("CALL SP_Insert_PackageResidue(@p0, @p1, @p2, @p3, @p4)", user, guid, remarks, cost, date);
            Console.WriteLine("-------------End Task Add--------------");
        }
        #endregion Tariff Labour methods

        #region Tariff Repair methods

        public async Task<int> AddTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_repair NewTariffRepair)
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
                newTariffRepair.material_cost = NewTariffRepair.material_cost;
                newTariffRepair.part_name = NewTariffRepair.part_name;
                newTariffRepair.thickness = NewTariffRepair.thickness;
                newTariffRepair.thickness_unit_cv = NewTariffRepair.thickness_unit_cv;
                newTariffRepair.create_by = uid;
                newTariffRepair.create_dt = GqlUtils.GetNowEpochInSec();
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
            catch { throw; }


            return retval;
        }


        public async Task<int> UpdateTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, tariff_repair UpdateTariffRepair)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = UpdateTariffRepair.guid;
                var dbTariffRepair = context.tariff_repair.Where(t => t.guid == guid).FirstOrDefault();

                if (dbTariffRepair == null)
                {
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
                dbTariffRepair.material_cost = UpdateTariffRepair.material_cost;
                dbTariffRepair.part_name = UpdateTariffRepair.part_name;
                dbTariffRepair.thickness = UpdateTariffRepair.thickness;
                dbTariffRepair.thickness_unit_cv = UpdateTariffRepair.thickness_unit_cv;

                dbTariffRepair.update_by = uid;
                dbTariffRepair.update_dt = GqlUtils.GetNowEpochInSec();

                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }


        public async Task<int> UpdateTariffRepairs(ApplicationTariffDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, List<string> updatedTariffRepair_guids, string group_name_cv, string subgroup_name_cv,
            string dimension, double height_diameter, string height_diameter_unit_cv, double width_diameter, string width_diameter_unit_cv, double labour_hour, double length,
            string length_unit_cv, double material_cost, string part_name, string alias, double thickness, string thickness_unit_cv, string remarks)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var dbTariffRepairs = context.tariff_repair.Where(t => updatedTariffRepair_guids.Contains(t.guid)).ToArray();

                if (dbTariffRepairs == null)
                {
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
                    if (material_cost > 0) r.material_cost = material_cost;
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
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }


        public async Task<int> UpdateTariffRepair_MaterialCost(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string? group_name_cv, string? subgroup_name_cv, string? part_name, string? dimension,
            int? length, string? guid, double material_cost_percentage, double labour_hour_percentage) // double labor_hour_percentage
        {
            int retval = 0;
            bool isAll = true;

            using (var transaction = await context.Database.BeginTransactionAsync())
            {
                try
                {
                    var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                    var currentDateTime = GqlUtils.GetNowEpochInSec();

                    var dbTariffRepairs = context.tariff_repair.Where(i => i.delete_dt == null || i.delete_dt == 0).ToArray();
                    if (!string.IsNullOrEmpty(guid))
                    {
                        dbTariffRepairs = dbTariffRepairs.Where(t => t.guid == guid).ToArray();
                        isAll = false;
                    }
                    else
                    {
                        if (!string.IsNullOrEmpty(group_name_cv))
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => t.group_name_cv == group_name_cv).ToArray();
                            isAll = false;
                        }
                        if (!string.IsNullOrEmpty(subgroup_name_cv))
                        {
                            dbTariffRepairs = dbTariffRepairs.Where(t => subgroup_name_cv.EqualsIgnore(t.subgroup_name_cv ?? "")).ToArray();
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
                        throw new GraphQLException(new Error("The Tariff Labour not found", "500"));
                    }

                    if (isAll)
                    {
                        retval = await context.package_repair.ExecuteUpdateAsync(s => s
                          .SetProperty(e => e.update_dt, currentDateTime)
                          .SetProperty(e => e.update_by, uid)
                          .SetProperty(e => e.material_cost, e => (Math.Round(Convert.ToDouble(e.material_cost * material_cost_percentage), 2)))
                          .SetProperty(e => e.labour_hour, e => (Math.Ceiling(Convert.ToDouble((e.labour_hour ?? 0) * labour_hour_percentage) * 4) / 4))
                           );
                    }
                    else
                    {
                        //foreach (var r in dbTariffRepairs)
                        //{
                        //    r.material_cost = Math.Round(Convert.ToDouble(r.material_cost.Value * material_cost_percentage), 2);
                        //    r.labour_hour = Math.Ceiling((r.labour_hour ?? 0 * labour_hour_percentage) * 4) / 4;

                        //    r.update_by = uid;
                        //    r.update_dt = currentDateTime;
                        //}
                        //retval = await context.SaveChangesAsync();

                        var guids = dbTariffRepairs.Select(p => p.guid).ToList();
                        string guidList = string.Join(", ", guids.ConvertAll(id => $"'{id}'"));

                        //string sql = $"UPDATE tariff_repair SET material_cost = (material_cost * {material_cost_percentage}), " +
                        //             $"labour_hour = (labour_hour * {labour_hour_percentage}), " +
                        //             $"update_dt = {currentDateTime}, update_by = '{uid}' " +
                        //             $"WHERE guid IN ({guidList})";

                        string sql = $"UPDATE tariff_repair SET material_cost = (ROUND(material_cost * {material_cost_percentage}, 2)), " +
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

                    // Handle or log the exception
                    throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
                    //throw; // Re-throw if necessary
                }
            }

            return retval;
        }

        public double CalculateMaterialCostRoundedUp(double materialCost, double materialCostPercentage)
        {
            double value = materialCost * materialCostPercentage;
            double result = Math.Ceiling(value * 100) / 100;
            return result;
        }

        public async Task<int> DeleteTariffRepair(ApplicationTariffDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteTariffRepair_guids)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delTariffRepairs = context.tariff_repair.Where(s => DeleteTariffRepair_guids.Contains(s.guid) && s.delete_dt == null).ToList();


                foreach (var delTariffRepair in delTariffRepairs)
                {
                    delTariffRepair.delete_dt = GqlUtils.GetNowEpochInSec();
                    delTariffRepair.update_by = uid;
                    delTariffRepair.update_dt = GqlUtils.GetNowEpochInSec();
                }
                retval = await context.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
        #endregion Tariff Repair methods

        #region AddUnNO&Class

        public async Task<int> AddUN_Number(ApplicationTariffDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, un_number unNumber)
        {
            int retval = 0;
            try
            {
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);

                var res = await context.un_number.Where(u => u.un_no.EqualsIgnore(unNumber.un_no) & (u.class_cv.EqualsIgnore(unNumber.class_cv))).FirstOrDefaultAsync();
                if (res != null)
                    throw new GraphQLException(new Error("Duplicate UN_No & class not allowed", "Error"));

                var newUnNo = new un_number();
                newUnNo.guid = (string.IsNullOrEmpty(unNumber.guid) ? Util.GenerateGUID() : unNumber.guid);

                newUnNo.class_cv = unNumber.class_cv;
                newUnNo.create_by = uid;
                newUnNo.create_dt = GqlUtils.GetNowEpochInSec();
                context.un_number.Add(newUnNo);

                retval = await context.SaveChangesAsync();
            }
            catch
            {
                throw;
            }

            return retval;
        }

        #endregion
    }

}
