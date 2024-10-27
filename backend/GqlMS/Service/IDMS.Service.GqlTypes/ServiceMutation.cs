using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommonUtil.Core.Service;
using Microsoft.EntityFrameworkCore;

namespace IDMS.Service.GqlTypes
{
    public class ServiceMutation
    {
        public async Task<int> AddJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
         [Service] IConfiguration config, job_order jobOrder)
        {
            try
            {
                if (jobOrder == null)
                    throw new GraphQLException(new Error($"Job order object cannot be null", "ERROR"));

                if (jobOrder.working_hour == null)
                    throw new GraphQLException(new Error($"Working hour cannot be null or empty", "ERROR"));

                if (jobOrder.total_hour == null)
                    throw new GraphQLException(new Error($"Total hour cannot be null or empty", "ERROR"));


                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                jobOrder.guid = Util.GenerateGUID();
                jobOrder.create_by = user;
                jobOrder.create_dt = currentDateTime;
                jobOrder.status_cv = CurrentServiceStatus.PENDING;
                await context.job_order.AddAsync(jobOrder);

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

        public async Task<int> UpdateJobOrder(ApplicationServiceDBContext context, [Service] IHttpContextAccessor httpContextAccessor,
        [Service] IConfiguration config, job_order jobOrder)
        {
            try
            {
                var job = await context.job_order.Where(j => j.guid == jobOrder.guid && (j.delete_dt == null || j.delete_dt == 0)).FirstOrDefaultAsync();

                if (jobOrder == null)
                    throw new GraphQLException(new Error($"Job order not found", "NOT FOUND"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                job.update_by = user;
                job.update_dt = currentDateTime;
                job.remarks = jobOrder.remarks;
                job.working_hour = jobOrder.working_hour;
                job.total_hour = jobOrder.total_hour;
                job.team_guid = jobOrder.team_guid;
                //job.sot_guid = jobOrder.sot_guid;

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
    }
}
