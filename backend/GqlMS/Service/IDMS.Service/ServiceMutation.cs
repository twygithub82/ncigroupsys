using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using Microsoft.EntityFrameworkCore;
using IDMS.Service.GqlTypes.LocalModel;
using IDMS.Models.Notification;
using System.Globalization;

namespace IDMS.Service.GqlTypes
{
    public class ServiceMutation
    {
        /// <summary>
        /// Assign part to Job, Update Job Order status to Pending
        /// </summary>
        public async Task<int> AssignJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<JobOrderRequest> jobOrderRequest)
        {
            try
            {
                if (jobOrderRequest == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();
                var currentJobOrderGuid = "";

                using var transaction = context.Database.BeginTransaction();
                try
                {
                    foreach (var item in jobOrderRequest)
                    {
                        if (string.IsNullOrEmpty(item.guid))
                        {
                            var newJobOrder = new job_order();
                            newJobOrder.guid = Util.GenerateGUID();
                            currentJobOrderGuid = newJobOrder.guid;
                            newJobOrder.sot_guid = item.sot_guid;
                            newJobOrder.team_guid = item.team_guid;
                            newJobOrder.job_type_cv = item.job_type_cv;
                            newJobOrder.status_cv = CurrentServiceStatus.PENDING;
                            newJobOrder.total_hour = item.total_hour;
                            //newJobOrder.working_hour = item.working_hour;
                            newJobOrder.remarks = item.remarks;
                            newJobOrder.create_by = user;
                            newJobOrder.create_dt = currentDateTime;
                            await context.AddAsync(newJobOrder);
                        }
                        else
                        {
                            var updateJobOrder = new job_order() { guid = item.guid };
                            context.Attach(updateJobOrder);

                            currentJobOrderGuid = item.guid;
                            updateJobOrder.remarks = item.remarks;
                            updateJobOrder.team_guid = item.team_guid;
                            updateJobOrder.job_type_cv = item.job_type_cv;
                            updateJobOrder.total_hour = item.total_hour;
                            //updateJobOrder.working_hour = item.working_hour;
                            updateJobOrder.remarks = item.remarks;
                            updateJobOrder.update_by = user;
                            updateJobOrder.update_dt = currentDateTime;
                        }

                        await AssignPartToJob(context, currentDateTime, user, item.job_type_cv, currentJobOrderGuid, item.part_guid, item.process_guid);
                    }

                    var res = await context.SaveChangesAsync();
                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();
                    //TODO
                    //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                    return res;
                }
                catch
                {
                    // Rollback in case of an error
                    transaction.Rollback();
                    throw;
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }
        public async Task<int> UpdateJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<UpdateJobOrderRequest> jobOrderRequest)
        {
            try
            {
                if (jobOrderRequest == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in jobOrderRequest)
                {
                    var jobOrder = new job_order() { guid = item.guid };
                    context.Attach(jobOrder);

                    if (item.start_dt.HasValue)
                        jobOrder.start_dt = item.start_dt;

                    if (item.complete_dt.HasValue)
                        jobOrder.complete_dt = item.complete_dt;

                    if (!string.IsNullOrEmpty(item.remarks))
                        jobOrder.remarks = item.remarks;

                    //if (CurrentServiceStatus.QC.EqualsIgnore(item?.status_cv ?? ""))
                    //{
                    //    jobOrder.qc_dt = item.qc_dt.HasValue ? item.qc_dt : currentDateTime;
                    //    jobOrder.qc_by = string.IsNullOrEmpty(item.qc_by) ? user : item.qc_by;
                    //}

                    //if (!string.IsNullOrEmpty(item.status_cv))
                    //    jobOrder.status_cv = item.status_cv;

                    jobOrder.update_dt = currentDateTime;
                    jobOrder.update_by = user;
                }



                var res = await context.SaveChangesAsync();
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        /// <summary>
        /// Update Job Order status to completed, update complete_dt
        /// </summary>
        public async Task<int> CompleteJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<UpdateJobOrderRequest> jobOrderRequest)
        {
            try
            {
                if (jobOrderRequest == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<JobNotification> notificationList = new List<JobNotification>();
                foreach (var item in jobOrderRequest)
                {
                    var jobOrder = new job_order() { guid = item.guid };
                    context.Attach(jobOrder);

                    jobOrder.complete_dt = currentDateTime;
                    jobOrder.remarks = item.remarks;
                    jobOrder.status_cv = JobStatus.COMPLETED;
                    jobOrder.update_dt = currentDateTime;
                    jobOrder.update_by = user;

                    //Handling of sending job notification
                    var jobNotification = new JobNotification();
                    jobNotification.job_order_guid = item.guid;
                    jobNotification.complete_dt = currentDateTime;
                    jobNotification.job_status = JobStatus.COMPLETED;
                    notificationList.Add(jobNotification);
                }
                var res = await context.SaveChangesAsync();

                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.COMPLETE_JOB);
                }

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> DeleteJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<string> jobOrderGuid)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                string tableName = "job_order";

                var guids = string.Join(",", jobOrderGuid.Select(g => $"'{g}'"));
                string sql = $"UPDATE {tableName} SET delete_dt = {currentDateTime}, update_dt = {currentDateTime}, update_by = '{user}' WHERE guid IN ({guids})";

                var ret = context.Database.ExecuteSqlRaw(sql);
                //var res = await context.SaveChangesAsync();
                return ret;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        //public async Task<int> CompleteJobItem(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<JobItemRequest> jobItemRequest)
        //{
        //    try
        //    {
        //        if (jobItemRequest == null)
        //            throw new GraphQLException(new Error($"Job item object cannot be null", "ERROR"));

        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        string tableName = "";
        //        var jobType = jobItemRequest.Select(j => j.job_type_cv).FirstOrDefault();
        //        var jobOrderGuid = jobItemRequest.Select(j => j.job_order_guid).FirstOrDefault();

        //        switch (jobType.ToUpper())
        //        {
        //            case JobType.REPAIR:
        //                tableName = "repair_part";
        //                break;
        //            case JobType.CLEANING:
        //                tableName = "cleaning";
        //                break;
        //            case JobType.RESIDUE:
        //                tableName = "residue_part";
        //                break;
        //            case JobType.STEAM:
        //                tableName = "steaming";
        //                break;
        //        }

        //        var guids = string.Join(",", jobItemRequest.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
        //        string sql = $"UPDATE {tableName} SET complete_dt = {currentDateTime}, update_dt = {currentDateTime}, " +
        //                     $"update_by = '{user}' WHERE guid IN ({guids})";
        //        var ret = context.Database.ExecuteSqlRaw(sql);

        //        //Handling of sending job notification
        //        var jobNotification = new JobNotification();
        //        jobNotification.job_order_guid = jobOrderGuid;
        //        jobNotification.job_type = jobType;
        //        jobNotification.complete_dt = currentDateTime;
        //        await GqlUtils.SendJobNotification(config, jobNotification, JobNotificationType.COMPLETE_ITEM);

        //        return ret;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

        /// <summary>
        ///  Update Process to Status Completed When all Job are done, update complete_dt 
        /// </summary>
        //public async Task<int> CompleteEntireJobProcess(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, List<JobProcessRequest> jobProcessRequest)
        //{
        //    try
        //    {
        //        if (jobProcessRequest == null)
        //            throw new GraphQLException(new Error($"Job process object cannot be null", "ERROR"));

        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        string tableName = "";
        //        var jobType = jobProcessRequest.Select(j => j.job_type_cv).FirstOrDefault();
        //        //var jobOrderGuid = jobProcessRequest.Select(j => j.job_order_guid).FirstOrDefault();

        //        switch (jobType.ToUpper())
        //        {
        //            case JobType.REPAIR:
        //                tableName = "repair";
        //                break;
        //            case JobType.CLEANING:
        //                tableName = "cleaning";
        //                break;
        //            case JobType.RESIDUE:
        //                tableName = "residue";
        //                break;
        //            case JobType.STEAM:
        //                tableName = "steaming";
        //                break;
        //        }

        //        var guids = string.Join(",", jobProcessRequest.Select(j => j.guid).ToList().Select(g => $"'{g}'"));
        //        string sql = $"UPDATE {tableName} SET status_cv = '{CurrentServiceStatus.COMPLETED}', complete_dt = {currentDateTime}, complete_by = '{user}' update_dt = {currentDateTime}, " +
        //                     $"update_by = '{user}' WHERE guid IN ({guids})";

        //        var ret = context.Database.ExecuteSqlRaw(sql);

        //        return ret;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

        /// <summary>
        /// Start current job, and update current Job Order to JOB-IN-PROGRESS
        /// </summary>
        public async Task<int> StartJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable, string? processGuid)
        {
            try
            {
                if (timeTable == null)
                    throw new GraphQLException(new Error($"Time table object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<time_table> newTimeTableList = new List<time_table>();
                IList<JobNotification> notificationList = new List<JobNotification>();

                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));

                    //handling of time_table 
                    var startTimeTable = new time_table();
                    startTimeTable.guid = Util.GenerateGUID();
                    startTimeTable.create_by = user;
                    startTimeTable.create_dt = currentDateTime;
                    startTimeTable.start_time = currentDateTime;
                    startTimeTable.job_order_guid = item.job_order_guid;
                    newTimeTableList.Add(startTimeTable);

                    //handling of job_order
                    if (item.job_order == null)
                        throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                    var job_order = new job_order() { guid = item.job_order_guid };
                    context.job_order.Attach(job_order);
                    job_order.status_cv = JobStatus.IN_PROGRESS;
                    job_order.update_by = user;
                    job_order.update_dt = currentDateTime;
                    if (item?.job_order?.start_dt == null)
                        job_order.start_dt = currentDateTime;

                    //handling of job_notification
                    var jobNotification = new JobNotification();
                    jobNotification.time_table_guid = startTimeTable.guid;
                    jobNotification.job_order_guid = item.job_order_guid;
                    jobNotification.job_status = job_order.status_cv;
                    jobNotification.start_time = startTimeTable.start_time;
                    jobNotification.stop_time = startTimeTable.stop_time;
                    notificationList.Add(jobNotification);
                }

                await context.time_table.AddRangeAsync(newTimeTableList);
                var res = await context.SaveChangesAsync();

                //var ret = await UpdateProcessStatus(context, user, currentDateTime, processGuid);

                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.START_JOB);
                }

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        public async Task<int> StopJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable)
        {
            try
            {
                if (timeTable == null)
                    throw new GraphQLException(new Error($"Time table object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                List<string?> jobOrderGuid = timeTable.Select(t => t.job_order_guid).ToList();

                IList<JobNotification> notificationList = new List<JobNotification>();
                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));

                    var stopTimeTable = new time_table() { guid = item.guid };
                    context.time_table.Attach(stopTimeTable);
                    stopTimeTable.update_by = user;
                    stopTimeTable.update_dt = currentDateTime;
                    stopTimeTable.stop_time = currentDateTime;

                    //handling of job_notification
                    var jobNotification = new JobNotification();
                    jobNotification.time_table_guid = item.guid;
                    jobNotification.job_order_guid = item.job_order_guid;
                    jobNotification.job_status = item.job_order.status_cv;
                    jobNotification.start_time = item.start_time;
                    jobNotification.stop_time = stopTimeTable.stop_time;
                    notificationList.Add(jobNotification);
                }

                var res = await context.SaveChangesAsync();

                if (res > 0)
                    await UpdateAccumalateHour(context, user, currentDateTime, jobOrderGuid);

                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.STOP_JOB);
                }
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
            }
        }

        /// <summary>
        /// Mainly use to update Process status to Job-In-Progress, or other status
        /// </summary>
        //public async Task<int> UpdateJobProcessStatus(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //    [Service] IConfiguration config, JobProcessRequest jobProcessRequest)
        //{
        //    try
        //    {
        //        if (jobProcessRequest == null)
        //            throw new GraphQLException(new Error($"Job process object cannot be null", "ERROR"));

        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();
        //        string tableName = "";

        //        switch (jobProcessRequest.job_type_cv.ToUpper())
        //        {
        //            case JobType.REPAIR:
        //                tableName = "repair";
        //                break;
        //            case JobType.CLEANING:
        //                tableName = "cleaning";
        //                break;
        //            case JobType.RESIDUE:
        //                tableName = "residue";
        //                break;
        //            case JobType.STEAM:
        //                tableName = "steaming";
        //                break;
        //        }

        //        string sql = "";
        //        if (CurrentServiceStatus.NO_ACTION.EqualsIgnore(jobProcessRequest.process_status))
        //            sql = $"UPDATE {tableName} SET status_cv = '{jobProcessRequest.process_status}', update_dt = {currentDateTime}, " +
        //                    $"update_by = '{user}', na_dt = {currentDateTime} WHERE guid = '{jobProcessRequest.guid}'";
        //        else
        //            sql = $"UPDATE {tableName} SET status_cv = '{jobProcessRequest.process_status}', update_dt = {currentDateTime}, " +
        //                     $"update_by = '{user}' WHERE guid = '{jobProcessRequest.guid}'";

        //        var ret = context.Database.ExecuteSqlRaw(sql);
        //        return ret;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

        private async Task<int> AssignPartToJob(ApplicationServiceDBContext context, long currentDateTime, string user,
                                                string jobType, string jobOrderGuid, List<string?>? partGuid, string processGuid)
        {
            string partTableName = "";
            string processTableName = "";
            //bool needAllocateBy = false;

            try
            {
                switch (jobType.ToUpper())
                {
                    case JobType.REPAIR:
                        partTableName = "repair_part";
                        processTableName = "repair";
                        break;
                    case JobType.CLEANING:
                        partTableName = "cleaning";
                        processTableName = "cleaning";
                        //needAllocateBy = true;
                        break;
                    case JobType.RESIDUE:
                        partTableName = "residue_part";
                        processTableName = "residue";
                        //needAllocateBy = true;
                        break;
                    case JobType.STEAM:
                        partTableName = "steaming_part";
                        processTableName = "steaming";
                        //needAllocateBy = true;
                        break;
                }

                var guids = string.Join(",", partGuid.Select(g => $"'{g}'"));
                string sql = $"UPDATE {partTableName} SET update_dt = {currentDateTime}, update_by = '{user}', job_order_guid = '{jobOrderGuid}' WHERE guid IN ({guids})";
                var ret = context.Database.ExecuteSqlRaw(sql);

                if (!string.IsNullOrEmpty(processGuid))
                {
                    string sql1 = sql1 = $"UPDATE {processTableName} SET allocate_by = '{user}', allocate_dt = {currentDateTime}, " +
                                         $"update_by = '{user}', update_dt = {currentDateTime} WHERE guid = '{processGuid}'";
                    var res = context.Database.ExecuteSqlRaw(sql1);
                }

                return ret;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        private async Task<bool> UpdateAccumalateHour(ApplicationServiceDBContext context, string user, long currentDateTime, List<string?> jobOrderGuid)
        {
            try
            {
                foreach (var j_guid in jobOrderGuid)
                {
                    var totalTime = await context.time_table
                        .Where(t => t.stop_time != null && t.start_time != null && t.job_order_guid == j_guid)
                        .SumAsync(t => (t.stop_time - t.start_time));

                    var jobOrdr = new job_order() { guid = j_guid };
                    context.job_order.Attach(jobOrdr);
                    jobOrdr.working_hour = Math.Round(((double)totalTime / 3600.0), 2);
                    jobOrdr.update_by = user;
                    jobOrdr.update_dt = currentDateTime;
                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        //private async Task<int> UpdateProcessStatus(ApplicationServiceDBContext context, string user, long currentDateTime, string processGuid)
        //{
        //    try
        //    {
        //        var repair = await context.repair.Include(r => r.repair_part).ThenInclude(p => p.job_order)
        //                                    .Where(r => r.guid == processGuid).FirstOrDefaultAsync();

        //        if (repair != null)
        //        {
        //            var jobOrderList = repair?.repair_part?.Select(p => p.job_order).ToList();
        //            if (jobOrderList != null && !jobOrderList.Any(j => j == null))
        //            {
        //                bool allValid = jobOrderList.All(jobOrder => jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.COMPLETED) ||
        //                                                    jobOrder.status_cv.EqualsIgnore(CurrentServiceStatus.JOB_IN_PROGRESS));
        //                if (allValid)
        //                {
        //                    repair.status_cv = CurrentServiceStatus.JOB_IN_PROGRESS;
        //                    repair.update_by = user;
        //                    repair.update_dt = currentDateTime;
        //                }
        //            }
        //        }

        //        var ret = await context.SaveChangesAsync();
        //        return ret;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw;
        //    }
        //}

    }
}
