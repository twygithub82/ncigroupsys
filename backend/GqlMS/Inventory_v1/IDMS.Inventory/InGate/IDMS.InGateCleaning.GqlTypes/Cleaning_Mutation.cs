using AutoMapper;
using CommonUtil.Core.Service;
using IDMS.Inventory.GqlTypes;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using IDMS.Models.Inventory;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using IDMS.InGateCleaning.GqlTypes.LocalModel;

namespace IDMS.InGateCleaning.GqlTypes
{
    [ExtendObjectType(typeof(Mutation))]
    public class Cleaning_Mutation
    {
        //[Authorize]
        public async Task<int> AddInGateCleaning(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, in_gate_cleaning inGateCleaning)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                in_gate_cleaning newIngateCleaning = inGateCleaning;
                newIngateCleaning.guid = Util.GenerateGUID();
                newIngateCleaning.create_by = user;
                newIngateCleaning.create_dt = currentDateTime;

                newIngateCleaning.status_cv = string.IsNullOrEmpty(inGateCleaning.status_cv) ? ProcessStatus.APPROVE : inGateCleaning.status_cv;

                if (!string.IsNullOrEmpty(inGateCleaning.job_no))
                    newIngateCleaning.job_no = inGateCleaning.job_no;
                else
                    newIngateCleaning.job_no = inGateCleaning.storing_order_tank.job_no;

                await context.in_gate_cleaning.AddAsync(newIngateCleaning);
                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }


        public async Task<int> UpdateInGateCleaning(ApplicationInventoryDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, in_gate_cleaning inGateCleaning)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (inGateCleaning == null)
                    throw new GraphQLException(new Error("in_gate_cleaning cannot be null or empty.", "ERROR"));

                var updateIngateCleaning = new in_gate_cleaning() { guid = inGateCleaning.guid };
                context.in_gate_cleaning.Attach(updateIngateCleaning);

                updateIngateCleaning.update_by = user;
                updateIngateCleaning.update_dt = currentDateTime;
                updateIngateCleaning.job_no = inGateCleaning.job_no;
                updateIngateCleaning.remarks = inGateCleaning.remarks;
               
                if (ObjectAction.APPROVE.EqualsIgnore(inGateCleaning.action))
                {
                    updateIngateCleaning.status_cv = ProcessStatus.APPROVE;
                    updateIngateCleaning.approve_dt = currentDateTime;
                    updateIngateCleaning.approve_by = inGateCleaning?.storing_order_tank?.storing_order?.customer_company_guid;
                }
                else if (ObjectAction.KIV.EqualsIgnore(inGateCleaning.action))
                {
                    updateIngateCleaning.status_cv = ProcessStatus.KIV;
                }
                else if (ObjectAction.NA.EqualsIgnore(inGateCleaning.action))
                {
                    updateIngateCleaning.na_dt = currentDateTime;
                    updateIngateCleaning.status_cv = ProcessStatus.NO_ACTION;

                    if (string.IsNullOrEmpty(inGateCleaning.sot_guid))
                        throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                    var sot = new storing_order_tank() { guid = inGateCleaning.sot_guid };
                    context.storing_order_tank.Attach(sot);
                    sot.update_by = user;
                    sot.update_dt = currentDateTime;
                    sot.tank_status_cv = "STORAGE";
                }

                var res = await context.SaveChangesAsync();
                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }


        public async Task<int> DeleteInGateCleaning(ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> inGateCleaningGuids)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var ingate_cleaning = context.in_gate_cleaning.Where(i => inGateCleaningGuids.Contains(i.guid));
                foreach (var cleaning in ingate_cleaning)
                {
                    cleaning.delete_dt = currentDateTime;
                    cleaning.update_by = user;
                    cleaning.update_dt = currentDateTime;

                    retval = await context.SaveChangesAsync();
                }
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

    }
}
