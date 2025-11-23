using CommonUtil.Core.Service;
using HotChocolate;
using HotChocolate.Subscriptions;
using HotChocolate.Types;
using IDMS.Booking.GqlTypes.LocaModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace IDMS.Booking.GqlTypes
{
    [ExtendObjectType(typeof(InventoryMutation))]
    public class SchedulingMutation
    {

        private readonly ILogger<SchedulingMutation> _logger;

        public SchedulingMutation(ILogger<SchedulingMutation> logger)
        {
            _logger = logger;
        }

        public async Task<int> AddScheduling(SchedulingRequest scheduling, List<SchedulingSOTRequest> scheduling_SotList, [Service] IHttpContextAccessor httpContextAccessor,
          ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var newScheduling = new scheduling();
                newScheduling.guid = Util.GenerateGUID();
                newScheduling.create_by = user;
                newScheduling.create_dt = currentDateTime;
                newScheduling.update_by = user;
                newScheduling.update_dt = currentDateTime;

                //newScheduling.reference = scheduling.reference;
                newScheduling.status_cv = BookingStatus.NEW;
                newScheduling.book_type_cv = scheduling.book_type_cv;
                //newScheduling.scheduling_dt = scheduling.scheduling_dt;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                foreach (var sch_sot in scheduling_SotList)
                {
                    var newSchedulingSOT = new scheduling_sot();
                    newSchedulingSOT.guid = Util.GenerateGUID();
                    newSchedulingSOT.create_by = user;
                    newSchedulingSOT.create_dt = currentDateTime;
                    newSchedulingSOT.update_by = user;
                    newSchedulingSOT.update_dt = currentDateTime;

                    newSchedulingSOT.sot_guid = sch_sot.sot_guid;
                    newSchedulingSOT.scheduling_guid = newScheduling.guid;
                    newSchedulingSOT.status_cv = BookingStatus.NEW;
                    newSchedulingSOT.reference = sch_sot.reference;
                    newSchedulingSOT.scheduling_dt = sch_sot.scheduling_dt;

                    schedulingsSOTList.Add(newSchedulingSOT);
                }
                context.scheduling.Add(newScheduling);
                context.scheduling_sot.AddRange(schedulingsSOTList);

                var res = await context.SaveChangesAsync();
                _logger.LogInformation($"AddScheduling: New scheduling added with GUID: {newScheduling.guid}");

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in AddScheduling");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> UpdateScheduling(SchedulingRequest scheduling, List<SchedulingSOTRequest> scheduling_SotList, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                var exScheduling = new scheduling() { guid =  scheduling.guid };   
                context.Attach(exScheduling);
                exScheduling.update_by = user;
                exScheduling.update_dt = currentDateTime;
                exScheduling.book_type_cv = scheduling.book_type_cv;
                exScheduling.remarks = scheduling.remarks;

                IList<scheduling_sot> schedulingsSOTList = new List<scheduling_sot>();
                foreach (var schSOT in scheduling_SotList)
                {
                    var exSch = new scheduling_sot() { guid = schSOT.guid };
                    context.Attach(exSch);

                    exSch.update_by = user;
                    exSch.update_dt = currentDateTime;
                    exSch.remarks = schSOT.remarks;
                    exSch.reference = schSOT.reference;
                    exSch.scheduling_dt = schSOT.scheduling_dt;
                }

                var res = await context.SaveChangesAsync();
                _logger.LogInformation($"UpdateScheduling: Scheduling updated with GUID: {scheduling.guid}");

                //TODO
                //await topicEventSender.SendAsync(nameof(Subscription.CourseCreated), course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in UpdateScheduling");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }


        public async Task<int> DeleteScheduling(List<string> schedulingGuids, [Service] IHttpContextAccessor httpContextAccessor,
            ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var id in schedulingGuids)
                {
                    var scheduling = new scheduling() { guid = id };
                    context.Attach(scheduling);

                    scheduling.update_dt = currentDateTime;
                    scheduling.update_by = user;
                    scheduling.delete_dt = currentDateTime;
                }

                var schSots = context.scheduling_sot.Where(b => schedulingGuids.Contains(b.scheduling_guid));
                foreach (var sch in schSots)
                {
                    sch.update_dt = currentDateTime;
                    sch.update_by = user;
                    sch.delete_dt = currentDateTime;
                }

                res = await context.SaveChangesAsync();
                _logger.LogInformation($"DeleteScheduling: Scheduling deleted with GUIDs: {string.Join(", ", schedulingGuids)}");

                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteScheduling");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

        public async Task<int> DeleteSchedulingSOT(List<string> schedulingSOTGuids, [Service] IHttpContextAccessor httpContextAccessor,
          ApplicationInventoryDBContext context, [Service] ITopicEventSender topicEventSender, [Service] IConfiguration config)
        {

            try
            {
                var res = 0;
                string user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                foreach (var id in schedulingSOTGuids)
                {
                    var schedulingSOT = new scheduling_sot() { guid = id };
                    context.Attach(schedulingSOT);

                    schedulingSOT.update_dt = currentDateTime;
                    schedulingSOT.update_by = user;
                    schedulingSOT.delete_dt = currentDateTime;
                }

                res = await context.SaveChangesAsync();
                _logger.LogInformation($"DeleteSchedulingSOT: Scheduling SOT deleted with GUIDs: {string.Join(", ", schedulingSOTGuids)}");

                //TODO
                //string updateCourseTopic = $"{course.Id}_{nameof(Subscription.CourseUpdated)}";
                //await topicEventSender.SendAsync(updateCourseTopic, course);
                return res;
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in DeleteSchedulingSOT");
                throw new GraphQLException(new Error($"{ex.Message}", "ERROR"));
            }
        }

    }
}
