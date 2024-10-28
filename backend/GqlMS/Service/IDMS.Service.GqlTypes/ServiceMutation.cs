using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using CommonUtil.Core.Service;
using Microsoft.EntityFrameworkCore;
using IDMS.Service.GqlTypes.LocalModel;
using System.Collections;

namespace IDMS.Service.GqlTypes
{
    public class ServiceMutation
    {

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
                        newJobOrder.working_hour = item.working_hour;
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
                        updateJobOrder.working_hour = item.working_hour;
                        updateJobOrder.remarks = item.remarks;
                        updateJobOrder.update_by = user;
                        updateJobOrder.update_dt = currentDateTime;
                    }

                    AssignPartToJob(context, item.job_type_cv, currentJobOrderGuid, item.part_guid);
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

        private void AssignPartToJob(ApplicationServiceDBContext context, string jobType, string jobOrderGuid, List<string?>? partGuid)
        {
            switch (jobType.ToUpper())
            {
                case JobType.REPAIR:
                    foreach (var item in partGuid)
                    {
                        var repPart = new repair_part() { guid = item };
                        context.repair_part.Attach(repPart);
                        repPart.job_order_guid = jobOrderGuid;
                    }
                    break;
                case JobType.CLEANING:
                    foreach (var item in partGuid)
                    {
                        var cleaningPart = new cleaning() { guid = item };
                        context.cleaning.Attach(cleaningPart);
                        cleaningPart.job_order_guid = jobOrderGuid;
                    }
                    break;
                case JobType.RESIDUE:
                    foreach (var item in partGuid)
                    {
                        var resPart = new residue_part() { guid = item };
                        context.residue_part.Attach(resPart);
                        resPart.job_order_guid = jobOrderGuid;
                    }
                    break;
                case JobType.STEAM:
                    //foreach (var item in partGuid)
                    //{
                    //    var resPart = new residue_part() { guid = item };
                    //    context.residue_part.Attach(resPart);
                    //    resPart.job_order_guid = jobOrderGuid;
                    //}
                    break;
            }
        }



        public async Task<int> StartJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable)
        {
            try
            {
                if (timeTable == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                IList<time_table> newTimeTableList = new List<time_table>();
                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));

                    item.guid = Util.GenerateGUID();
                    item.create_by = user;
                    item.create_dt = currentDateTime;
                    item.start_time = currentDateTime;
                    newTimeTableList.Add(item);
                }

                //Change the job_order status
                var jobOrderGuids = timeTable.Select(t => t.job_order_guid).ToList();
                foreach (var item in jobOrderGuids)
                {
                    var job_order = new job_order() { guid = item };
                    context.job_order.Attach(job_order);
                    job_order.status_cv = CurrentServiceStatus.IN_PROGRESS;
                    job_order.update_by = user;
                    job_order.update_dt = currentDateTime;
                }

                await context.time_table.AddRangeAsync(newTimeTableList);
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

        public async Task<int> StopJobTimer(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
            [Service] IConfiguration config, List<time_table> timeTable)
        {
            try
            {
                if (timeTable == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                //IList<time_table> newTimeTableList = new List<time_table>();
                foreach (var item in timeTable)
                {
                    if (item.job_order_guid == null)
                        throw new GraphQLException(new Error($"Job order guid cannot be null", "ERROR"));

                    var stopTimeTable = new time_table() { guid = item.guid };
                    context.time_table.Attach(stopTimeTable);
                    item.update_by = user;
                    item.update_dt = currentDateTime;
                    item.stop_time = currentDateTime;
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

        //public async Task<int> AddJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        // [Service] IConfiguration config, job_order jobOrder)
        //{
        //    try
        //    {
        //        if (jobOrder == null)
        //            throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

        //        if (jobOrder.working_hour == null)
        //            throw new GraphQLException(new Error($"Working hour cannot be null or empty", "ERROR"));

        //        if (jobOrder.total_hour == null)
        //            throw new GraphQLException(new Error($"Total hour cannot be null or empty", "ERROR"));


        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        jobOrder.guid = Util.GenerateGUID();
        //        jobOrder.create_by = user;
        //        jobOrder.create_dt = currentDateTime;
        //        jobOrder.status_cv = CurrentServiceStatus.PENDING;
        //        await context.job_order.AddAsync(jobOrder);

        //        var res = await context.SaveChangesAsync();
        //        //TODO
        //        //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}

        //public async Task<int> UpdateJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        //[Service] IConfiguration config, job_order jobOrder)
        //{
        //    try
        //    {
        //        var job = await context.job_order.Where(j => j.guid == jobOrder.guid && (j.delete_dt == null || j.delete_dt == 0)).FirstOrDefaultAsync();

        //        if (jobOrder == null)
        //            throw new GraphQLException(new Error($"Job order not found", "NOT FOUND"));

        //        var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        long currentDateTime = DateTime.Now.ToEpochTime();

        //        job.update_by = user;
        //        job.update_dt = currentDateTime;
        //        job.remarks = jobOrder.remarks;
        //        job.working_hour = jobOrder.working_hour;
        //        job.total_hour = jobOrder.total_hour;
        //        job.team_guid = jobOrder.team_guid;
        //        //job.sot_guid = jobOrder.sot_guid;

        //        var res = await context.SaveChangesAsync();
        //        //TODO
        //        //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
        //        return res;
        //    }
        //    catch (Exception ex)
        //    {
        //        throw new GraphQLException(new Error($"{ex.Message}--{ex.InnerException}", "ERROR"));
        //    }
        //}
    }
}
