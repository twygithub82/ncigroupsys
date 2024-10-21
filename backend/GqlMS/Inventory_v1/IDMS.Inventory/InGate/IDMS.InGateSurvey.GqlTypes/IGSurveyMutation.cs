using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using HotChocolate.Data.Projections;
using IDMS.InGateSurvey.GqlTypes.LocalModel;
using IDMS.Inventory.GqlTypes;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Package;
using IDMS.Models.Tariff;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;


namespace IDMS.InGateSurvey.GqlTypes
{
    [ExtendObjectType(typeof(Mutation))]
    public class IGSurveyMutation
    {
        //[Authorize]
        public async Task<Record> AddInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            InGateSurveyRequest inGateSurveyRequest, in_gate inGateRequest)
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

                in_gate_survey ingateSurvey = new();
                mapper.Map(inGateSurveyRequest, ingateSurvey);

                ingateSurvey.guid = Util.GenerateGUID();
                ingateSurvey.create_by = user;
                ingateSurvey.create_dt = currentDateTime;
                context.in_gate_survey.Add(ingateSurvey);

                //var igWithTank = inGateRequest;
                var ingate = context.in_gate.Where(i => i.guid == inGateRequest.guid).FirstOrDefault();
                if (ingate != null)
                {
                    ingate.remarks = inGateRequest.remarks;
                    ingate.vehicle_no = inGateRequest.vehicle_no;
                    ingate.driver_name = inGateRequest.driver_name;
                    ingate.haulier = inGateRequest.haulier;
                    //yet to survey --> pending
                    ingate.eir_status_cv = EirStatus.PENDING;
                    ingate.update_by = user;
                    ingate.update_dt = currentDateTime;
                }

                var tnk = inGateRequest.tank;
                storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                context.Attach(sot);
                sot.unit_type_guid = tnk.unit_type_guid;
                sot.owner_guid = tnk.owner_guid;
                sot.update_by = user;
                sot.update_dt = currentDateTime;
                sot.tank_status_cv = TankMovementStatus.STORAGE;
                if ((tnk.purpose_cleaning ?? false) || (tnk.purpose_steam ?? false))
                {
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                }

                //Add the newly created guid into list for return
                retGuids.Add(ingateSurvey.guid);

                //Add into in_gate_cleaning
                await AddIngateCleaning(context, config, httpContextAccessor, tnk.guid, ingate.create_dt, ingateSurvey.tank_comp_cv);

                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_INGATE;
                string evtName = EventName.NEW_INGATE;
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
        public async Task<int> UpdateInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper,
            InGateSurveyRequest inGateSurveyRequest, in_gate inGateRequest)
        {
            int retval = 0;

            try
            {
                in_gate_survey? ingateSurvey = await context.in_gate_survey.Where(i => i.guid == inGateSurveyRequest.guid &&
                                                                                 (i.delete_dt == null || i.delete_dt == 0)).FirstOrDefaultAsync();
                if (ingateSurvey == null)
                    throw new GraphQLException(new Error("Ingate survey not found.", "NOT_FOUND"));

                if (ingateSurvey.in_gate_guid == null)
                    throw new GraphQLException(new Error("Ingate guid cant be null.", "Error"));

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();
                mapper.Map(inGateSurveyRequest, ingateSurvey);

                if (string.IsNullOrEmpty(inGateSurveyRequest.guid))
                {
                    ingateSurvey.guid = Util.GenerateGUID();
                    ingateSurvey.create_by = user;
                    ingateSurvey.create_dt = currentDateTime;
                    context.in_gate_survey.Add(ingateSurvey);
                }
                else
                {
                    ingateSurvey.update_by = user;
                    ingateSurvey.update_dt = currentDateTime;
                }

                //var igWithTank = inGateRequest;
                var ingate = context.in_gate.Where(i => i.guid == inGateRequest.guid).FirstOrDefault();
                if (ingate != null)
                {
                    ingate.remarks = inGateRequest.remarks;
                    ingate.vehicle_no = inGateRequest.vehicle_no;
                    ingate.driver_name = inGateRequest.driver_name;
                    ingate.haulier = inGateRequest.haulier;
                    //yet to survey --> pending
                    ingate.eir_status_cv = EirStatus.PENDING;
                    ingate.update_by = user;
                    ingate.update_dt = currentDateTime;
                }

                var tnk = inGateRequest.tank;
                storing_order_tank sot = new storing_order_tank() { guid = tnk.guid };
                context.Attach(sot);
                sot.unit_type_guid = tnk.unit_type_guid;
                sot.owner_guid = tnk.owner_guid;
                sot.update_by = user;
                sot.update_dt = currentDateTime;

                sot.tank_status_cv = TankMovementStatus.STORAGE;
                if ((tnk.purpose_cleaning ?? false) || (tnk.purpose_steam ?? false))
                {
                    sot.tank_status_cv = TankMovementStatus.CLEANING;
                }


                retval = await context.SaveChangesAsync();
                //TODO
                string evtId = EventId.NEW_INGATE;
                string evtName = EventName.NEW_INGATE;
                GqlUtils.SendGlobalNotification(config, evtId, evtName, 0);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteInGateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string IGSurvey_guid)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var query = context.in_gate_survey.Where(i => i.guid == $"{IGSurvey_guid}");
                if (query.Any())
                {
                    var delInGateSurvey = query.FirstOrDefault();

                    delInGateSurvey.delete_dt = currentDateTime;
                    delInGateSurvey.update_by = user;
                    delInGateSurvey.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync(true);
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }


        public async Task<int> PublishIngateSurvey(ApplicationInventoryDBContext context, [Service] IConfiguration config,
                [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();


                var ingate = new in_gate() { guid = InGate_guid };
                context.Attach(ingate);

                ingate.eir_status_cv = EirStatus.PUBLISHED;
                ingate.update_by = user;
                ingate.update_dt = currentDateTime;

                retval = await context.SaveChangesAsync(true);

                //TODO: Pending implementation of publish pdf -------------------------------
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        private async Task<int> AddIngateCleaning(ApplicationInventoryDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, string sot_Guid, long? ingate_date, string baffleType)
        {
            int retval = 0;
            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var sot = context.storing_order_tank.Include(t => t.storing_order).Include(t => t.tariff_cleaning)
                    .Where(t => t.guid == sot_Guid && (t.delete_dt == null || t.delete_dt == 0)).FirstOrDefault();

                var ingateCleaning = new in_gate_cleaning();
                ingateCleaning.guid = Util.GenerateGUID();
                ingateCleaning.create_by = user;
                ingateCleaning.create_dt = currentDateTime;
                ingateCleaning.sot_guid = sot_Guid;
                ingateCleaning.approve_dt = ingate_date;
                ingateCleaning.approve_by = "system";
                ingateCleaning.status_cv = "APPROVE";
                ingateCleaning.job_no = sot?.job_no;
                var customerGuid = sot?.storing_order?.customer_company_guid;
                ingateCleaning.bill_to_guid = customerGuid;

                var categoryGuid = sot?.tariff_cleaning?.cleaning_category_guid;
                var adjustedPrice = await context.Set<customer_company_cleaning_category>().Where(c => c.customer_company_guid == customerGuid && c.cleaning_category_guid == categoryGuid)
                               .Select(c => c.adjusted_price).FirstOrDefaultAsync();
                ingateCleaning.cleaning_cost = adjustedPrice;

                var tariffBufferGuid = await context.Set<tariff_buffer>().Where(t => t.buffer_type.ToUpper() == baffleType.ToUpper())
                                                    .Select(t => t.guid).FirstOrDefaultAsync();
                var bufferPrice = await context.Set<package_buffer>().Where(b => b.customer_company_guid == customerGuid && b.tariff_buffer_guid == tariffBufferGuid)
                                                   .Select(b => b.cost).FirstOrDefaultAsync();
                ingateCleaning.buffer_cost = bufferPrice;

                await context.AddAsync(ingateCleaning);
                retval = 1;
                //retval = await context.SaveChangesAsync(true);
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }
    }
}
