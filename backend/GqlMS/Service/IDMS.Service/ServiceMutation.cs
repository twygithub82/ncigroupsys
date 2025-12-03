using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Notification;
using IDMS.Models.Service;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Shared;
using IDMS.Service.GqlTypes.LocalModel;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MySqlConnector;
using System.Data.SqlClient;

namespace IDMS.Service.GqlTypes
{
    public class ServiceMutation
    {
        private readonly ILogger<ServiceMutation> _logger;

        public ServiceMutation(ILogger<ServiceMutation> logger)
        {
            _logger = logger;
        }

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
                            newJobOrder.update_by = user;
                            newJobOrder.update_dt = currentDateTime;
                            await context.AddAsync(newJobOrder);
                            _logger.LogInformation("Created job_order {JobOrderGuid} by {User}", newJobOrder.guid, user);
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

                            _logger.LogInformation("Updated job_order {JobOrderGuid} by {User}", item.guid, user);
                        }

                        await AssignPartToJob(context, currentDateTime, user, item.job_type_cv, currentJobOrderGuid, item.part_guid, item.process_guid);
                    }

                    var res = await context.SaveChangesAsync();
                    // Commit the transaction if all operations succeed
                    await transaction.CommitAsync();
                    _logger.LogInformation("AssignJobOrder transaction committed by {User}; saved {Changes} changes", user, res);
                    //TODO
                    //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                    return res;
                }
                catch (Exception txEx)
                {
                    // Rollback in case of an error
                    await transaction.RollbackAsync();
                    _logger.LogError(txEx, "AssignJobOrder transaction failed");
                    throw;
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AssignJobOrder failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                _logger.LogInformation("UpdateJobOrder authorized user {User}; items {Count}", user, jobOrderRequest.Count);
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
                _logger.LogInformation("UpdateJobOrder saved {Changes} changes by {User}", res, user);
                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateJobOrder failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        /// <summary>
        /// Update Job Order status to completed, update complete_dt
        /// </summary>
        public async Task<int> CompleteJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<UpdateJobOrderRequest> jobOrderRequest, steaming? steaming = null)
        {
            try
            {
                if (jobOrderRequest == null)
                {
                    _logger.LogError("CompleteJobOrder called with null jobOrderRequest");
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));
                }


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

                    _logger.LogInformation("Marked job_order {JobOrderGuid} as COMPLETED by {User}", item.guid, user);
                }

                //handling steaming process for total hour
                if (steaming != null && !string.IsNullOrEmpty(steaming.guid))
                {
                    var steam = new steaming() { guid = steaming.guid };
                    context.Attach(steam);
                    steam.total_hour = steaming.total_hour;
                    steam.update_by = user;
                    steam.update_dt = currentDateTime;
                    _logger.LogInformation("Updated steaming {SteamingGuid} total_hour by {User}", steaming.guid, user);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("CompleteJobOrder saved {Changes} changes by {User}", res, user);
                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.onJobCompleted.ToString());
                }

                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "CompleteJobOrder failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
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
                _logger.LogInformation("DeleteJobOrder executed SQL for {Count} guids by {User}", jobOrderGuid?.Count ?? 0, user);
                //var res = await context.SaveChangesAsync();
                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteJobOrder failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        /// <summary>
        /// Start current job, and update current Job Order to JOB-IN-PROGRESS
        /// </summary>
        public async Task<int> StartJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable, string? processGuid)
        {
            try
            {
                if (timeTable == null)
                {
                    _logger.LogError("StartJobTimer called with null timeTable");
                    throw new GraphQLException(new Error($"Time table object cannot be null", "ERROR"));
                }


                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<time_table> newTimeTableList = new List<time_table>();
                IList<JobNotification> notificationList = new List<JobNotification>();

                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                    {
                        _logger.LogError("StartJobTimer called with null job_order_guid");
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));
                    }

                    //handling of time_table 
                    var startTimeTable = new time_table();
                    startTimeTable.guid = Util.GenerateGUID();
                    startTimeTable.create_by = user;
                    startTimeTable.create_dt = currentDateTime;
                    startTimeTable.update_by = user;
                    startTimeTable.update_dt = currentDateTime;
                    startTimeTable.start_time = currentDateTime;
                    startTimeTable.job_order_guid = item.job_order_guid;
                    newTimeTableList.Add(startTimeTable);

                    //handling of job_order
                    if (item.job_order == null)
                    {
                        _logger.LogError("StartJobTimer called with null job_order object");
                        throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));
                    }

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
                    if (item.job_order.job_order_no.StartsWith("CJ"))
                        //if cleaning job, need to use the team_guid
                        jobNotification.job_order_guid = item.job_order.team_guid;
                    else
                        jobNotification.job_order_guid = item.job_order_guid;
                    jobNotification.job_status = job_order.status_cv;
                    jobNotification.start_time = startTimeTable.start_time;
                    jobNotification.stop_time = startTimeTable.stop_time;
                    notificationList.Add(jobNotification);

                    _logger.LogInformation("Started timer {TimeTableGuid} for job_order {JobOrderGuid} by {User}", startTimeTable.guid, item.job_order_guid, user);
                }

                await context.time_table.AddRangeAsync(newTimeTableList);
                var res = await context.SaveChangesAsync();

                //var ret = await UpdateProcessStatus(context, user, currentDateTime, processGuid);

                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.onJobStarted.ToString());
                }

                _logger.LogInformation("StartJobTimer saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StartJobTimer failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> StopJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable)
        {
            try
            {
                if (timeTable == null)
                {
                    _logger.LogError("StopJobTimer called with null timeTable");
                    throw new GraphQLException(new Error($"Time table object cannot be null", "ERROR"));
                }

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                List<string?> jobOrderGuid = timeTable.Select(t => t.job_order_guid).ToList();

                IList<JobNotification> notificationList = new List<JobNotification>();
                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                    {
                        _logger.LogError("StopJobTimer called with null job_order_guid");
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));
                    }


                    var stopTimeTable = new time_table() { guid = item.guid };
                    context.time_table.Attach(stopTimeTable);
                    stopTimeTable.update_by = user;
                    stopTimeTable.update_dt = currentDateTime;
                    stopTimeTable.stop_time = currentDateTime;

                    //handling of job_notification
                    var jobNotification = new JobNotification();
                    jobNotification.time_table_guid = item.guid;
                    if (item.job_order.job_order_no.StartsWith("CJ"))
                        //if cleaning job, need to use the team_guid
                        jobNotification.job_order_guid = item.job_order.team_guid;
                    else
                        jobNotification.job_order_guid = item.job_order_guid;
                    jobNotification.job_status = item.job_order.status_cv;
                    jobNotification.start_time = item.start_time;
                    jobNotification.stop_time = stopTimeTable.stop_time;
                    notificationList.Add(jobNotification);

                    _logger.LogInformation("Stopped timer {TimeTableGuid} for job_order {JobOrderGuid}", item.guid, item.job_order_guid);
                }

                var res = await context.SaveChangesAsync();

                if (res > 0)
                    await UpdateAccumalateHour(context, user, currentDateTime, jobOrderGuid);

                //TODO
                foreach (var item in notificationList)
                {
                    await GqlUtils.SendJobNotification(config, item, JobNotificationType.onJobStopped.ToString());
                }
                _logger.LogInformation("StopJobTimer saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "StopJobTimer failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> AssignPartToJob_Bk(ApplicationServiceDBContext context, long currentDateTime, string user,
                                                string jobType, string jobOrderGuid, List<string?>? partGuid, string processGuid)
        {
            string partTableName = "";
            string processTableName = "";

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

                _logger.LogInformation("AssignPartToJob updated {Count} parts in {Table} for jobOrder {JobOrderGuid}", partGuid?.Count ?? 0, partTableName, jobOrderGuid);


                if (!string.IsNullOrEmpty(processGuid))
                {
                    string sql1 = sql1 = $"UPDATE {processTableName} SET allocate_by = '{user}', allocate_dt = {currentDateTime}, " +
                                         $"update_by = '{user}', update_dt = {currentDateTime} WHERE guid = '{processGuid}'";
                    var res = context.Database.ExecuteSqlRaw(sql1);
                    _logger.LogInformation("AssignPartToJob updated process {ProcessGuid} in {Table}", processGuid, processTableName);
                }

                return ret;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AssignPartToJob failed for jobOrder {JobOrderGuid}", jobOrderGuid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        public async Task<int> AssignPartToJob(ApplicationServiceDBContext context, long currentDateTime, string user,
                                             string jobType, string jobOrderGuid, List<string?>? partGuid, string processGuid)
        {
            string partTableName = "";
            string processTableName = "";

            try
            {
                if (partGuid == null || partGuid.Count == 0)
                {
                    _logger.LogError("AssignPartToJob called with null or empty partGuids");
                    throw new GraphQLException("partGuids cannot be null or empty.");
                }

                // Resolve table names
                var (partTable, processTable) = jobType.ToUpper() switch
                {
                    JobType.REPAIR => ("repair_part", "repair"),
                    JobType.CLEANING => ("cleaning", "cleaning"),
                    JobType.RESIDUE => ("residue_part", "residue"),
                    JobType.STEAM => ("steaming_part", "steaming"),
                    _ => throw new GraphQLException($"Invalid job type: {jobType}")
                };

                // Parameterized PART update
                var partParams = new List<object>
                {
                    new MySqlParameter("@update_dt", currentDateTime),
                    new MySqlParameter("@update_by", user),
                    new MySqlParameter("@job_order_guid", jobOrderGuid)
                };

                var partGuidInList = string.Join(", ", partGuid.Select((g, i) =>
                {
                    partParams.Add(new MySqlParameter($"@p{i}", g ?? string.Empty));
                    return $"@p{i}";
                }));


                var partSql = $@"
                UPDATE {partTable}
                SET update_dt = @update_dt,
                update_by = @update_by,
                job_order_guid = @job_order_guid
                WHERE guid IN ({partGuidInList});
                ";
                int updatedParts = await context.Database.ExecuteSqlRawAsync(partSql, partParams.ToArray());
                _logger.LogInformation("AssignPartToJob updated {Count} parts in {Table} for jobOrder {JobOrderGuid}", updatedParts, partTable, jobOrderGuid);


                if (!string.IsNullOrEmpty(processGuid))
                {
                    var processSql = $@"
                    UPDATE {processTable}
                    SET allocate_by = @user,
                    allocate_dt = @dt,
                    update_by = @user,
                    update_dt = @dt
                    WHERE guid = @guid;
                    ";

                    var processParams = new[]
                    {
                        new MySqlParameter("@user", user),
                        new MySqlParameter("@dt", currentDateTime),
                        new MySqlParameter("@guid", processGuid)
                    };

                    await context.Database.ExecuteSqlRawAsync(processSql, processParams);

                    _logger.LogInformation(
                        "AssignPartToJob updated process {ProcessGuid} in {Table}", processGuid, processTable);
                }

                return updatedParts;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AssignPartToJob failed for jobOrder {JobOrderGuid}", jobOrderGuid);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        private async Task<bool> UpdateAccumalateHour(ApplicationServiceDBContext context, string user, long currentDateTime, List<string?> jobOrderGuid)
        {
            try
            {
                foreach (var j_guid in jobOrderGuid)
                {
                    var totalTime = await context.time_table
                        .Where(t => t.stop_time != null && t.start_time != null && t.job_order_guid == j_guid && t.delete_dt == null)
                        .SumAsync(t => (t.stop_time - t.start_time));

                    var jobOrdr = new job_order() { guid = j_guid };
                    context.job_order.Attach(jobOrdr);
                    jobOrdr.working_hour = Math.Round(((double)totalTime / 3600.0), 2);
                    jobOrdr.update_by = user;
                    jobOrdr.update_dt = currentDateTime;

                    _logger.LogInformation("UpdateAccumalateHour updated working_hour for jobOrder {JobOrderGuid} to {WorkingHour}", j_guid, jobOrdr.working_hour);
                }

                await context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateAccumalateHour failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        public async Task<int> AddRole(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<role> rolesRequest)
        {
            try
            {
                if (rolesRequest == null)
                {
                    _logger.LogError("AddRole called with null rolesRequest");
                    throw new GraphQLException(new Error($"Roles object cannot be null", "ERROR"));
                }

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in rolesRequest)
                {
                    var newRole = new role();
                    newRole.guid = Util.GenerateGUID();
                    newRole.code = item.code;
                    newRole.description = item.description;
                    newRole.position = item.position;
                    newRole.department = item.department;
                    newRole.create_by = user;
                    newRole.update_by = user;
                    newRole.update_dt = currentDateTime;
                    newRole.create_dt = currentDateTime;

                    await context.role.AddAsync(newRole);

                    if (item.role_functions != null)
                    {
                        foreach (var rf in item.role_functions)
                        {
                            var newRF = new role_functions();
                            newRF.guid = Util.GenerateGUID();
                            newRF.functions_guid = rf.functions_guid;
                            newRF.role_guid = rf.role_guid;
                            newRF.create_by = user;
                            newRF.create_dt = currentDateTime;
                            newRF.update_by = user; ;
                            newRF.update_dt = currentDateTime;

                            await context.Set<role_functions>().AddAsync(newRF);
                        }
                    }

                    _logger.LogInformation("Added role {RoleGuid}", newRole.guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("AddRole saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddRole failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateRole(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<role> rolesRequest)
        {
            try
            {
                if (rolesRequest == null)
                {
                    _logger.LogError("UpdateRole called with null rolesRequest");
                    throw new GraphQLException(new Error($"Roles object cannot be null", "ERROR"));
                }


                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in rolesRequest)
                {
                    var updateRole = new role() { guid = item.guid };
                    context.role.Attach(updateRole);

                    updateRole.code = item.code;
                    updateRole.description = item.description;
                    updateRole.position = item.position;
                    updateRole.department = item.department;

                    updateRole.update_by = user;
                    updateRole.update_dt = currentDateTime;

                    if (item.role_functions != null)
                    {
                        foreach (var rf in item.role_functions)
                        {
                            if (ObjectAction.NEW.EqualsIgnore(rf.action))
                            {
                                var newRF = new role_functions();
                                newRF.guid = Util.GenerateGUID();
                                newRF.create_by = user;
                                newRF.create_dt = currentDateTime;
                                newRF.update_by = user;
                                newRF.update_dt = currentDateTime;
                                newRF.role_guid = rf.role_guid;
                                newRF.functions_guid = rf.functions_guid;

                                await context.Set<role_functions>().AddAsync(newRF);
                                _logger.LogInformation("Added role_functions {RFGuid} for role {RoleGuid}", newRF.guid, newRF.role_guid);
                            }

                            if ((ObjectAction.CANCEL).EqualsIgnore(rf.action))
                            {
                                var deleteRF = new role_functions() { guid = rf.guid };
                                context.Set<role_functions>().Attach(deleteRF);
                                deleteRF.update_by = user;
                                deleteRF.update_dt = currentDateTime;
                                deleteRF.delete_dt = currentDateTime;
                                _logger.LogInformation("Marked role_functions {RFGuid} as deleted", rf.guid);
                            }
                        }
                    }
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateRole saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateRole failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> DeleteRole(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<string> rolesGuid)
        {
            try
            {
                if (rolesGuid == null)
                {
                    _logger.LogError("DeleteRole called with null rolesGuid");
                    throw new GraphQLException(new Error($"Roles guid cannot be null", "ERROR"));
                }

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var guid in rolesGuid)
                {
                    var deleteRole = new role() { guid = guid };
                    context.role.Attach(deleteRole);

                    deleteRole.update_by = user;
                    deleteRole.update_dt = currentDateTime;
                    deleteRole.delete_dt = currentDateTime;

                    _logger.LogInformation("Marked role {RoleGuid} as deleted", guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteRole saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteRole failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> AddTeam(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<team> teamsRequest)
        {
            try
            {
                if (teamsRequest == null)
                {
                    _logger.LogError("AddTeam called with null teamsRequest");
                    throw new GraphQLException(new Error($"Team object cannot be null", "ERROR"));
                }

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in teamsRequest)
                {
                    var newTeam = new team();
                    newTeam.guid = Util.GenerateGUID();
                    newTeam.description = item.description;
                    newTeam.department_cv = item.department_cv;
                    newTeam.create_by = user;
                    newTeam.update_by = user;
                    newTeam.update_dt = currentDateTime;
                    newTeam.create_dt = currentDateTime;

                    await context.team.AddAsync(newTeam);

                    _logger.LogInformation("Added team {TeamGuid}", newTeam.guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("AddTeam saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "AddTeam failed");
                //throw;
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateTeam(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, List<team> teamRequest)
        {
            try
            {
                if (teamRequest == null)
                {
                    _logger.LogError("UpdateTeam called with null teamRequest");
                    throw new GraphQLException(new Error($"Roles object cannot be null", "ERROR"));
                }


                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var item in teamRequest)
                {
                    var updateTeam = new team() { guid = item.guid };
                    context.team.Attach(updateTeam);
                    updateTeam.description = item.description;
                    updateTeam.department_cv = item.department_cv;

                    updateTeam.update_by = user;
                    updateTeam.update_dt = currentDateTime;

                    _logger.LogInformation("Updated team {TeamGuid}", item.guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateTeam saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateTeam failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> DeleteTeam(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
           [Service] IConfiguration config, List<string> teamsGuid)
        {
            try
            {
                if (teamsGuid == null)
                {
                    _logger.LogError("DeleteTeam called with null teamsGuid");
                    throw new GraphQLException(new Error($"Teams guid cannot be null", "ERROR"));
                }


                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var guid in teamsGuid)
                {
                    var deleteTeam = new team() { guid = guid };
                    context.team.Attach(deleteTeam);

                    deleteTeam.update_by = user;
                    deleteTeam.update_dt = currentDateTime;
                    deleteTeam.delete_dt = currentDateTime;

                    _logger.LogInformation("Marked team {TeamGuid} as deleted", guid);
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("DeleteTeam saved {Changes}", res);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "DeleteTeam failed");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateUser(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, aspnetusers userRequest, List<role?> rolesRequest, List<team?> teamsRequest, List<FunctionsRequest?> functionsRequest)
        {
            try
            {
                if (userRequest == null)
                {
                    _logger.LogError("UpdateUser called with null userRequest");
                    throw new GraphQLException(new Error($"User object cannot be null", "ERROR"));
                }

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();


                //Update User
                var updateUser = new aspnetusers() { Id = userRequest.Id };
                context.aspnetusers.Attach(updateUser);
                updateUser.PhoneNumber = userRequest.PhoneNumber;
                updateUser.CorporateID = userRequest.CorporateID;

                foreach (var item in rolesRequest)
                {
                    if (ObjectAction.NEW.EqualsIgnore(item?.action ?? ""))
                    {
                        if (string.IsNullOrEmpty(item?.guid))
                        {
                            _logger.LogError("UpdateUser called with null role guid");
                            throw new GraphQLException(new Error($"Role guid cannot be null or empty", "ERROR"));
                        }

                        var newUserRole = new user_role();
                        newUserRole.guid = Util.GenerateGUID();
                        newUserRole.user_guid = userRequest.Id;
                        newUserRole.role_guid = item.guid;
                        newUserRole.create_by = user;
                        newUserRole.update_by = user;
                        newUserRole.create_dt = currentDateTime;
                        newUserRole.update_dt = currentDateTime;
                        await context.Set<user_role>().AddAsync(newUserRole);

                        _logger.LogInformation("Added user_role {UserRoleGuid} for user {TargetId}", newUserRole.guid, userRequest.Id);
                    }

                    if (ObjectAction.CANCEL.EqualsIgnore(item?.action ?? ""))
                    {
                        var delUserRole = await context.Set<user_role>().Where(t => t.user_guid == userRequest.Id && t.role_guid == item.guid).FirstOrDefaultAsync();
                        if (delUserRole != null)
                        {
                            delUserRole.update_by = user;
                            delUserRole.update_dt = currentDateTime;
                            delUserRole.delete_dt = currentDateTime;

                            _logger.LogInformation("Marked user_role {UserRoleGuid} as deleted for user {TargetId}", delUserRole.guid, userRequest.Id);
                        }
                    }
                }

                foreach (var item1 in teamsRequest)
                {
                    if (string.IsNullOrEmpty(item1?.guid))
                    {
                        _logger.LogError("UpdateUser called with null team guid");
                        throw new GraphQLException(new Error($"Team guid cannot be null or empty", "ERROR"));
                    }


                    if (ObjectAction.NEW.EqualsIgnore(item1?.action ?? ""))
                    {
                        var newUserTeam = new team_user();
                        newUserTeam.guid = Util.GenerateGUID();
                        newUserTeam.userId = userRequest.Id;
                        newUserTeam.team_guid = item1.guid;
                        newUserTeam.create_by = user;
                        newUserTeam.update_by = user;
                        newUserTeam.create_dt = currentDateTime;
                        newUserTeam.update_dt = currentDateTime;
                        await context.team_user.AddAsync(newUserTeam);

                        _logger.LogInformation("Added team_user {UserTeamGuid} for user {TargetId}", newUserTeam.guid, userRequest.Id);
                    }

                    if (ObjectAction.CANCEL.EqualsIgnore(item1?.action ?? ""))
                    {
                        var delUserTeam = await context.Set<team_user>().Where(t => t.userId == userRequest.Id && t.team_guid == item1.guid).FirstOrDefaultAsync();
                        if (delUserTeam != null)
                        {
                            delUserTeam.update_by = user;
                            delUserTeam.update_dt = currentDateTime;
                            delUserTeam.delete_dt = currentDateTime;

                            _logger.LogInformation("Marked team_user {UserTeamGuid} as deleted for user {TargetId}", delUserTeam.guid, userRequest.Id);
                        }
                    }
                }

                foreach (var item2 in functionsRequest)
                {
                    if (string.IsNullOrEmpty(item2?.guid))
                    {
                        _logger.LogError("UpdateUser called with null function guid");
                        throw new GraphQLException(new Error($"Function guid cannot be null or empty", "ERROR"));
                    }


                    if (ObjectAction.NEW.EqualsIgnore(item2?.action ?? ""))
                    {
                        var newUserFunctions = new user_functions();
                        newUserFunctions.guid = Util.GenerateGUID();
                        newUserFunctions.user_guid = userRequest.Id;
                        newUserFunctions.functions_guid = item2.guid;
                        newUserFunctions.adhoc = item2.addhoc ?? true;
                        newUserFunctions.remarks = item2.remarks;
                        newUserFunctions.create_by = user;
                        newUserFunctions.update_by = user;
                        newUserFunctions.create_dt = currentDateTime;
                        newUserFunctions.update_dt = currentDateTime;
                        await context.Set<user_functions>().AddAsync(newUserFunctions);

                        _logger.LogInformation("Added user_functions {UserFunctionsGuid} for user {TargetId}", newUserFunctions.guid, userRequest.Id);
                    }


                    if (ObjectAction.EDIT.EqualsIgnore(item2?.action ?? ""))
                    {
                        var updateUserFunctions = await context.Set<user_functions>().Where(f => f.guid == item2.guid).FirstOrDefaultAsync();
                        if (updateUserFunctions != null)
                        {
                            updateUserFunctions.adhoc = item2.addhoc;
                            updateUserFunctions.remarks = item2.remarks;
                            updateUserFunctions.update_by = user;
                            updateUserFunctions.update_dt = currentDateTime;

                            _logger.LogInformation("Edited user_functions {UserFunctionsGuid} for user {TargetId}", item2.guid, userRequest.Id);
                        }
                    }


                    if (ObjectAction.CANCEL.EqualsIgnore(item2?.action ?? ""))
                    {
                        var delUserFunctions = await context.Set<user_functions>().Where(f => f.guid == item2.guid).FirstOrDefaultAsync();
                        if (delUserFunctions != null)
                        {
                            delUserFunctions.adhoc = false;
                            delUserFunctions.remarks = item2.remarks;
                            delUserFunctions.update_by = user;
                            delUserFunctions.update_dt = currentDateTime;
                            delUserFunctions.delete_dt = currentDateTime;

                            _logger.LogInformation("Marked user_functions {UserFunctionsGuid} as deleted for user {TargetId}", item2.guid, userRequest.Id);
                        }
                    }
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation("UpdateUser saved {Changes} changes for user {TargetId}", res, userRequest.Id);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "UpdateUser failed");
                //Console.WriteLine(ex.StackTrace);
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        private async Task<bool> TankMovementConditionCheck(ApplicationServiceDBContext context, string user, long currentDateTime, string sotGuid)
        {

            //first check tank purpose
            var tank = await context.storing_order_tank.Where(t => t.guid == sotGuid & (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefaultAsync();
            if (tank != null)
            {
                var completedStatuses = new[] { CurrentServiceStatus.COMPLETED, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };
                var qcCompletedStatuses = new[] { CurrentServiceStatus.QC, CurrentServiceStatus.CANCELED, CurrentServiceStatus.NO_ACTION };

                //check if tank have any steaming purpose
                if (tank.purpose_steam ?? false)
                {
                    var res = context.steaming.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0) &&
                    (
                        (t.approve_by == "system" && !completedStatuses.Contains(t.status_cv)) ||
                        (t.approve_by != "system" && !qcCompletedStatuses.Contains(t.status_cv))
                    ))
                    .Select(t => t.guid)
                    .Distinct()
                    .ToList();

                    //if any record not meet above, remain in current tank movement
                    //else, change to that status
                    if (res.Any())
                    {
                        tank.tank_status_cv = TankMovementStatus.STEAM;
                        goto ProceesUpdate;
                    }
                }

                //check if tank have any cleaning purpose
                if (tank.purpose_cleaning ?? false)
                {
                    var res = context.cleaning.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0) &&
                    (
                        (t.approve_by == "system" && !completedStatuses.Contains(t.status_cv)) ||
                        (t.approve_by != "system" && !qcCompletedStatuses.Contains(t.status_cv))
                    ))
                    .Select(t => t.guid)
                    .Distinct()
                    .ToList();

                    if (res.Any())
                    {
                        tank.tank_status_cv = TankMovementStatus.CLEANING;
                        goto ProceesUpdate;
                    }
                    else
                    {
                        //Else, check if tank have any residue estimate already created but pending
                        res.Clear();
                        res = context.residue.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0) &&
                         (
                             (t.approve_by == "system" && !completedStatuses.Contains(t.status_cv)) ||
                             (t.approve_by != "system" && !qcCompletedStatuses.Contains(t.status_cv))
                         ))
                         .Select(t => t.guid)
                         .Distinct()
                         .ToList();

                        if (res.Any())
                        {
                            tank.tank_status_cv = TankMovementStatus.CLEANING;
                            goto ProceesUpdate;
                        }
                    }
                }

                //check if tank have any repair purpose
                if (!string.IsNullOrEmpty(tank.purpose_repair_cv))
                {
                    var res = await context.repair.Where(t => t.sot_guid == sotGuid && (t.delete_dt == null || t.delete_dt == 0)).ToListAsync();
                    if (res.Any())
                    {
                        if (res.Any(t => !qcCompletedStatuses.Contains(t.status_cv)))
                        {
                            tank.tank_status_cv = TankMovementStatus.REPAIR;
                            goto ProceesUpdate;
                        }
                        else
                        {
                            //can proceed to check next movement
                        }
                    }
                    else
                    {
                        tank.tank_status_cv = TankMovementStatus.REPAIR;
                        goto ProceesUpdate;
                    }
                }

                if (tank.purpose_storage ?? false)
                {
                    tank.status_cv = TankMovementStatus.STORAGE;
                }

            ProceesUpdate:
                tank.update_by = user;
                tank.update_dt = currentDateTime;
                var ret = await context.SaveChangesAsync();
                _logger.LogInformation("TankMovementConditionCheck updated tank {SotGuid} status to {Status}", sotGuid, tank.tank_status_cv);
                return true;
            }
            _logger.LogDebug("TankMovementConditionCheck found no tank for {SotGuid}", sotGuid);
            return false;
        }
    }
}
