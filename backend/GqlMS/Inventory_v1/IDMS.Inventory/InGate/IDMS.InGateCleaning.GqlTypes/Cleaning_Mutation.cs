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

                var updateIngateCleaning = await context.in_gate_cleaning.FindAsync(inGateCleaning.guid);
                if(updateIngateCleaning == null)
                    throw new GraphQLException(new Error("Ingate cleaning not found.", "ERROR"));

                updateIngateCleaning.update_by = user;
                updateIngateCleaning.update_dt = currentDateTime;

                updateIngateCleaning.sot_guid = inGateCleaning.sot_guid;
                updateIngateCleaning.bill_to_guid = inGateCleaning.bill_to_guid;
                updateIngateCleaning.cleaning_cost = inGateCleaning.cleaning_cost;
                updateIngateCleaning.buffer_cost = inGateCleaning.buffer_cost;
                updateIngateCleaning.status_cv = inGateCleaning.status_cv;
                updateIngateCleaning.remarks = inGateCleaning.remarks;  
                updateIngateCleaning.job_no = inGateCleaning.job_no;
                updateIngateCleaning.approve_by = inGateCleaning.approve_by;
                updateIngateCleaning.approve_dt = inGateCleaning.approve_dt;
                updateIngateCleaning.allocate_by = inGateCleaning.allocate_by;
                updateIngateCleaning.allocate_dt = inGateCleaning.allocate_dt;
                updateIngateCleaning.complete_by = inGateCleaning.complete_by;
                updateIngateCleaning.complete_dt = inGateCleaning.complete_dt;

                if (!string.IsNullOrEmpty(inGateCleaning.job_no))
                    updateIngateCleaning.job_no = inGateCleaning.job_no;
                else
                    updateIngateCleaning.job_no = inGateCleaning.storing_order_tank.job_no;

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
                foreach(var cleaning in ingate_cleaning)
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
