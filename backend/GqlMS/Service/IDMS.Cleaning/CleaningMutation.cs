using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using IDMS.Cleaning.GqlTypes.LocalModel;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory;
using IDMS.Repair.GqlTypes.LocalModel;
using System.Data.SqlTypes;
using IDMS.Models.Parameter;
using Microsoft.Extensions.Logging;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class CleaningMutation
    {
        private readonly ILogger<CleaningMutation> _logger;

        public CleaningMutation(ILogger<CleaningMutation> logger)
        {
            _logger = logger;
        }

        //[Authorize]
        public async Task<int> AddCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, cleaning cleaning)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                cleaning newCleaning = cleaning;
                newCleaning.guid = Util.GenerateGUID();
                newCleaning.create_by = user;
                newCleaning.create_dt = currentDateTime;
                newCleaning.update_by = user;
                newCleaning.update_dt = currentDateTime;
                newCleaning.buffer_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.buffer_cost);
                newCleaning.cleaning_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.cleaning_cost);
                newCleaning.est_buffer_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.est_buffer_cost);
                newCleaning.est_cleaning_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.est_cleaning_cost);

                newCleaning.status_cv = string.IsNullOrEmpty(cleaning.status_cv) ? CurrentServiceStatus.APPROVED : cleaning.status_cv;

                if (!string.IsNullOrEmpty(cleaning.job_no))
                    newCleaning.job_no = cleaning.job_no;
                else
                    newCleaning.job_no = cleaning.storing_order_tank.job_no;

                await context.cleaning.AddAsync(newCleaning);

                //Handing of SOT movement status
                if (string.IsNullOrEmpty(cleaning.sot_guid))
                {
                    _logger.LogError("AddCleaning failed: SOT guid is null or empty for cleaning {CleaningGuid}", newCleaning.guid);
                    throw new GraphQLException(new Error($"SOT guid cannot be null or empty", "ERROR"));
                }

                var sot = new storing_order_tank() { guid = cleaning.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.tank_status_cv = TankMovementStatus.CLEANING;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("AddCleaning completed: {Rows} rows affected for cleaning {CleaningGuid}", res, newCleaning.guid);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddCleaning failed for cleaning guid {CleaningGuid}", cleaning?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, cleaning cleaning, in_gate_survey? inGateSurvey)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();
                bool tankMovementCheck = false;

                if (cleaning == null)
                {
                    _logger.LogError("UpdateCleaning called with null cleaning object");
                    throw new GraphQLException(new Error("Cleaning object cannot be null or empty.", "ERROR"));
                }

                _logger.LogInformation("UpdateCleaning for guid {Guid} action {Action}", cleaning.guid, cleaning.action);

                var updateCleaning = await context.cleaning.FindAsync(cleaning.guid);
                if (updateCleaning == null)
                {
                    _logger.LogError("UpdateCleaning: cleaning not found with guid {Guid}", cleaning.guid);
                    throw new GraphQLException(new Error("Cleaning object not found.", "ERROR"));
                }

                updateCleaning.job_no = cleaning.job_no;
                updateCleaning.remarks = cleaning.remarks;
                updateCleaning.est_buffer_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.est_buffer_cost);
                updateCleaning.est_cleaning_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.est_cleaning_cost);
                updateCleaning.update_by = user;
                updateCleaning.update_dt = currentDateTime;

                switch (cleaning.action.ToUpper())
                {
                    case ObjectAction.APPROVE:
                        _logger.LogInformation("UpdateCleaning APPROVE for {Guid}", cleaning.guid);
                        updateCleaning.status_cv = CurrentServiceStatus.APPROVED;
                        updateCleaning.approve_dt = cleaning.approve_dt ?? currentDateTime;
                        updateCleaning.approve_by = user;

                        updateCleaning.bill_to_guid = cleaning.bill_to_guid;
                        updateCleaning.buffer_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.buffer_cost);
                        updateCleaning.cleaning_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.cleaning_cost);

                        await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.APPROVE, processGuid: cleaning.guid);
                        tankMovementCheck = true;
                        
                        break;
                    case ObjectAction.KIV:
                        updateCleaning.status_cv = CurrentServiceStatus.KIV;
                        break;
                    case ObjectAction.IN_PROGRESS:
                        //Cleaning no to check JobInProgress as it only have 1 job to 1 cleaning all time
                        updateCleaning.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                        break;
                    case ObjectAction.ASSIGN:
                        updateCleaning.status_cv = CurrentServiceStatus.ASSIGNED;
                        break;
                    case ObjectAction.PARTIAL:
                        updateCleaning.status_cv = CurrentServiceStatus.PARTIAL;
                        break;
                    case ObjectAction.COMPLETE:
                        updateCleaning.status_cv = CurrentServiceStatus.COMPLETED;
                        updateCleaning.complete_by = user;
                        updateCleaning.complete_dt = currentDateTime;

                        if (string.IsNullOrEmpty(cleaning.sot_guid))
                        {
                            _logger.LogError("UpdateCleaning to COMPLETE failed: SOT guid null for cleaning {Guid}", cleaning.guid);
                            throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));
                        }

                        tankMovementCheck = true;
                        break;
                    case ObjectAction.NA:
                        updateCleaning.na_dt = cleaning.na_dt ?? currentDateTime;
                        updateCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                        if (string.IsNullOrEmpty(cleaning.sot_guid))
                        {
                            _logger.LogError("UpdateCleaning to NA failed: SOT guid null for cleaning {Guid}", cleaning.guid);
                            throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));
                        }

                        tankMovementCheck = true;
                        break;
                    case ObjectAction.OVERWRITE:
                        _logger.LogInformation("UpdateCleaning for OVERWRITE with {Guid}", cleaning.guid);
                        updateCleaning.approve_dt = cleaning.approve_dt;
                        updateCleaning.overwrite_remarks = cleaning.overwrite_remarks;
                        updateCleaning.buffer_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.buffer_cost);
                        updateCleaning.cleaning_cost = GqlUtils.CalculateMaterialCostRoundedUp(cleaning.cleaning_cost);
                 
                        if (inGateSurvey == null || string.IsNullOrEmpty(inGateSurvey.guid))
                        {
                            _logger.LogError("UpdateCleaning OVERWRITE failed: ingate survey missing for cleaning {Guid}", cleaning.guid);
                            throw new GraphQLException(new Error("Ingate survey object cannot be null when overwrite.", "ERROR"));
                        }

                        var updateSurvey = new in_gate_survey() { guid = inGateSurvey.guid };
                        context.Attach(updateSurvey);
                        updateSurvey.tank_comp_guid = inGateSurvey.tank_comp_guid;
                        updateSurvey.update_dt = currentDateTime;
                        updateSurvey.update_by = user;

                        break;
                }
                var res = await context.SaveChangesAsync();

                _logger.LogInformation("UpdateCleaning saved {Rows} rows for cleaning {Guid}", res, cleaning.guid);

                if (tankMovementCheck)
                {
                    _logger.LogInformation("UpdateCleaning performing TankMovementConditionCheck for SOT {SotGuid}", cleaning.sot_guid);
                    await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, cleaning.sot_guid);
                }

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateCleaning failed for cleaning guid {Guid}", cleaning?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }

        }

        public async Task<int> AbortCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, CleaningJobOrder cleaningJobOrder)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaningJobOrder == null)
                {
                    _logger.LogError("AbortCleaning called with null cleaningJobOrder object");
                    throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));
                }


                var abortCleaning = new cleaning() { guid = cleaningJobOrder.guid };
                context.cleaning.Attach(abortCleaning);

                abortCleaning.update_by = user;
                abortCleaning.update_dt = currentDateTime;
                abortCleaning.status_cv = CurrentServiceStatus.NO_ACTION;
                abortCleaning.remarks = cleaningJobOrder.remarks;

                //job order handling
                await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.CANCEL, jobOrders: cleaningJobOrder.job_order);
                var res = await context.SaveChangesAsync();

                _logger.LogInformation("AbortCleaning: job order handling saved {Rows} rows for cleaning {Guid}", res, cleaningJobOrder.guid);

                //Status condition chehck handling
                if (await GqlUtils.StatusChangeConditionCheck(context, "cleaning", cleaningJobOrder.guid, CurrentServiceStatus.COMPLETED))
                {
                    abortCleaning.status_cv = CurrentServiceStatus.COMPLETED;
                    abortCleaning.complete_dt = currentDateTime;
                }
                else
                    abortCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                if (string.IsNullOrEmpty(cleaningJobOrder.sot_guid))
                {
                    _logger.LogError("AbortCleaning failed: SOT guid null for cleaning {Guid}", cleaningJobOrder.guid);
                    throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));
                }

                res = res + await context.SaveChangesAsync();
                _logger.LogInformation("AbortCleaning saved final changes, total rows affected: {Rows} for cleaning {Guid}", res, cleaningJobOrder.guid);

                await GqlUtils.TankMovementConditionCheck(context, user, currentDateTime, cleaningJobOrder.sot_guid);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AbortCleaning failed for cleaning guid {Guid}", cleaningJobOrder?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> RollbackCompletedCleaning(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, CleaningJobOrder cleaningJobOrder)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaningJobOrder == null)
                {
                    _logger.LogError("RollbackCompletedCleaning called with null cleaningJobOrder object");
                    throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));
                }


                var rollbackCleaning = new cleaning() { guid = cleaningJobOrder.guid };
                context.cleaning.Attach(rollbackCleaning);

                rollbackCleaning.update_by = user;
                rollbackCleaning.update_dt = currentDateTime;
                rollbackCleaning.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
                if (!string.IsNullOrEmpty(cleaningJobOrder.remarks))
                    rollbackCleaning.remarks = cleaningJobOrder.remarks;

                //job_orders handling
                var jobRemark = cleaningJobOrder.job_order.Select(j => j.remarks).FirstOrDefault();
                var jobIdList = cleaningJobOrder.job_order.Select(j => j.guid).ToList();
                //var jobGuidString = string.Join(",", jobIdList.Select(g => $"'{g}'"));

                //string sql = "";
                //if (!string.IsNullOrEmpty(jobRemark))
                //{
                //    sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                //            $"update_by = '{user}', remarks = '{jobRemark}' WHERE guid IN ({jobGuidString})";
                //}
                //else
                //{
                //    sql = $"UPDATE job_order SET complete_dt = NULL, status_cv = '{JobStatus.IN_PROGRESS}', update_dt = {currentDateTime}, " +
                //            $"update_by = '{user}' WHERE guid IN ({jobGuidString})";
                //}
                //context.Database.ExecuteSqlRaw(sql);

                var currentJobOrders = await context.job_order.Where(j => jobIdList.Contains(j.guid)).ToListAsync();
                foreach (var job in currentJobOrders)
                {
                    job.complete_dt = null;
                    job.status_cv = JobStatus.IN_PROGRESS;
                    job.update_dt = currentDateTime;
                    job.update_by = user;

                    if (!string.IsNullOrEmpty(jobRemark))
                        job.remarks = jobRemark;
                }
                _logger.LogInformation("RollbackCompletedCleaning updated job_order rows for cleaning {Guid}", cleaningJobOrder.guid);

                //Timetable handling
                var timeTables = await context.time_table.Where(t => jobIdList.Contains(t.job_order_guid))
                                                         .OrderByDescending(t => t.stop_time).FirstOrDefaultAsync();
                if (timeTables != null)
                {
                    timeTables.stop_time = null;
                    timeTables.update_by = user;
                    timeTables.update_dt = currentDateTime;
                }

                var tankStatus = cleaningJobOrder.sot_status;
                //var sot = await context.storing_order_tank.FindAsync(sotGuid);
                //context.storing_order_tank.Attach(sot);
                //sot.tank_status_cv = await TankMovementCheck(context, "repair", sotGuid, processGuid) ? TankMovementStatus.REPAIR : TankMovementStatus.STORAGE;   //TankMovementStatus.STORAGE;
                var sot = new storing_order_tank() { guid = cleaningJobOrder.sot_guid };
                context.storing_order_tank.Attach(sot);
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                if (tankStatus.EqualsIgnore(TankMovementStatus.STORAGE))
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                else
                {
                    var jobOrders = await context.job_order.Where(j => j.sot_guid == cleaningJobOrder.sot_guid & j.job_type_cv == JobType.CLEANING).ToListAsync();
                    if (jobOrders.Any(j => j.status_cv.Contains(JobStatus.IN_PROGRESS)))
                        sot.tank_status_cv = TankMovementStatus.CLEANING;
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("RollbackCompletedCleaning completed for cleaning {Guid}, rows affected: {Rows}", cleaningJobOrder.guid, res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RollbackCompletedCleaning failed for cleaning guid {Guid}", cleaningJobOrder?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> RollbackJobInProgressCleaning(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, CleaningJobOrder cleaningJobOrder)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaningJobOrder == null)
                {
                    _logger.LogError("RollbackJobInProgressCleaning called with null cleaningJobOrder object");
                    throw new GraphQLException(new Error($"Cleaning object cannot be null or empty", "ERROR"));
                }

                var rollbackCleaning = new cleaning() { guid = cleaningJobOrder.guid };
                context.cleaning.Attach(rollbackCleaning);

                rollbackCleaning.update_by = user;
                rollbackCleaning.update_dt = currentDateTime;
                rollbackCleaning.status_cv = CurrentServiceStatus.APPROVED;
                if (!string.IsNullOrEmpty(cleaningJobOrder.remarks))
                    rollbackCleaning.remarks = cleaningJobOrder.remarks;

                //job order handling
                //await GqlUtils.JobOrderHandling(context, "cleaning", user, currentDateTime, ObjectAction.ROLLBACK, jobOrders: cleaningJobOrder.job_order);

                //job_orders handling
                var jobRemark = cleaningJobOrder?.job_order?.Select(j => j.remarks).FirstOrDefault();
                var jobIdList = cleaningJobOrder?.job_order?.Select(j => j.guid).ToList();
                if (jobIdList != null && jobIdList.Any())
                {
                    foreach (var jobId in jobIdList)
                    {
                        var jobOrder = new job_order() { guid = jobId };
                        context.Attach(jobOrder);
                        jobOrder.team_guid = null;
                        jobOrder.start_dt = null;
                        //if need set to null using EF-Core, must manually add below
                        context.Entry(jobOrder).Property(j => j.team_guid).IsModified = true;
                        context.Entry(jobOrder).Property(j=> j.start_dt).IsModified = true;
                        jobOrder.status_cv = JobStatus.PENDING;
                        if (!string.IsNullOrEmpty(jobRemark))
                            jobOrder.remarks = jobRemark;

                        jobOrder.update_dt = currentDateTime;
                        jobOrder.update_by = user;
                    }

                    //Timetable handling
                    var timeTables = await context.time_table.Where(t => jobIdList.Contains(t.job_order_guid)).ToListAsync();
                    foreach (var tt in timeTables)
                    {
                        tt.delete_dt = currentDateTime;
                        tt.update_by = user;
                        tt.update_dt = currentDateTime;
                    }
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("RollbackJobInProgressCleaning completed for cleaning {Guid}, rows affected: {Rows}", cleaningJobOrder.guid, res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "RollbackJobInProgressCleaning failed for cleaning guid {Guid}", cleaningJobOrder?.guid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }
    }
}
