using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.InGateSurvey.GqlTypes.LocalModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace IDMS.InGateSurvey.GqlTypes
{
    [ExtendObjectType(typeof(Mutation))]
    public class OGSurveyMutationType
    {
        //[Authorize]
        public async Task<Record> AddOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            OutGateSurveyRequest outGateSurveyRequest, OutGateRequest outGateRequest)
        {
            int retval = 0;
            List<string> retGuids = new List<string>();
            Record record = new();

            try
            {
                //long epochNow = GqlUtils.GetNowEpochInSec();
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                out_gate_survey outgateSurvey = new();
                mapper.Map(outGateSurveyRequest, outgateSurvey);

                outgateSurvey.guid = Util.GenerateGUID();
                outgateSurvey.create_by = user;
                outgateSurvey.create_dt = currentDateTime;
                context.out_gate_survey.Add(outgateSurvey);

                //var igWithTank = inGateWithTankRequest;
                var outgate = context.out_gate.Where(i => i.guid == outGateRequest.guid).FirstOrDefault();
                if (outgate != null)
                {
                    outgate.remarks = outGateRequest.remarks;
                    outgate.vehicle_no = outGateRequest.vehicle_no;
                    outgate.driver_name = outGateRequest.driver_name;
                    outgate.haulier = outGateRequest.haulier;
                    //yet to survey --> pending
                    outgate.eir_status_cv = EirStatus.PENDING;
                    outgate.update_by = user;
                    outgate.update_dt = currentDateTime;
                }

                var tnk = outGateRequest.tank;
                //var sot = context.storing_order_tank.Where(s => s.guid == tnk.guid).FirstOrDefault();
                //if (sot != null)
                //{
                //    sot.unit_type_guid = tnk.unit_type_guid;
                //    sot.update_by = user;
                //    sot.update_dt = currentDateTime;
                //}

                //var sot = context.storing_order_tank.Where(s => s.guid == tnk.guid).FirstOrDefault();
                storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                context.Attach(sot);
                sot.unit_type_guid = tnk.unit_type_guid;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                //Add the newly created guid into list for return
                retGuids.Add(outgateSurvey.guid);

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_OUTGATE;
                string evtName = EventName.NEW_OUTGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);

                //Bundle the retVal and retGuid return as record object
                record = new Record() { affected = retval, guid = retGuids }; 
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return record;
        }

        //[Authorize]
        public async Task<int> UpdateOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            OutGateSurveyRequest outGateSurveyRequest, OutGateRequest outGateRequest)
        {
            int retval = 0;

            try
            {
                out_gate_survey? outgateSurvey = await context.out_gate_survey.Where(i => i.guid == outGateSurveyRequest.guid &&
                                                                                 (i.delete_dt == null || i.delete_dt == 0)).FirstOrDefaultAsync();
                if (outgateSurvey == null)
                    throw new GraphQLException(new Error("Outgate survey not found.", "NOT_FOUND"));

                if (outgateSurvey.out_gate_guid == null)
                    throw new GraphQLException(new Error("Outgate guid cant be null.", "Error"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();
                mapper.Map(outGateSurveyRequest, outgateSurvey);

                if (string.IsNullOrEmpty(outGateSurveyRequest.guid))
                {
                    outgateSurvey.guid = Util.GenerateGUID();
                    outgateSurvey.create_by = user;
                    outgateSurvey.create_dt = currentDateTime;
                    context.out_gate_survey.Add(outgateSurvey);
                }
                else
                {
                    outgateSurvey.update_by = user;
                    outgateSurvey.update_dt = currentDateTime;
                }

                //var igWithTank = inGateWithTankRequest;
                var outgate = context.out_gate.Where(i => i.guid == outGateRequest.guid).FirstOrDefault();
                if (outgate != null)
                {
                    outgate.remarks = outGateRequest.remarks;
                    outgate.vehicle_no = outGateRequest.vehicle_no;
                    outgate.driver_name = outGateRequest.driver_name;
                    outgate.haulier = outGateRequest.haulier;
                    //yet to survey --> pending
                    outgate.eir_status_cv = EirStatus.PENDING;
                    outgate.update_by = user;
                    outgate.update_dt = currentDateTime;
                }

                var tnk = outGateRequest.tank;
                //var sot = context.storing_order_tank.Where(s => s.guid == tnk.guid).FirstOrDefault();
                //if (sot != null)
                //{
                //    sot.unit_type_guid = tnk.unit_type_guid;
                //    sot.update_by = user;
                //    sot.update_dt = currentDateTime;
                //}

                storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                context.Attach(sot);
                sot.unit_type_guid = tnk.unit_type_guid;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_OUTGATE;
                string evtName = EventName.NEW_OUTGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteOutGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string OGSurvey_guid)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var query = context.out_gate_survey.Where(i => i.guid == $"{OGSurvey_guid}");
                if (query.Any())
                {
                    var delOutGateSurvey = query.FirstOrDefault();

                    delOutGateSurvey.delete_dt = currentDateTime;
                    delOutGateSurvey.update_by = user;
                    delOutGateSurvey.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        public async Task<int> PublishOutgateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, string OutGate_guid)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var outgate = new out_gate() { guid = OutGate_guid };
                context.Attach(outgate);

                outgate.eir_status_cv = EirStatus.PUBLISHED;
                outgate.update_by = user;
                outgate.update_dt = currentDateTime;

                retval = await context.SaveChangesAsync(true);

                //TODO: Pending implementation of publish pdf -------------------------------
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }
    }
}
