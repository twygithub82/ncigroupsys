using AutoMapper;
using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using HotChocolate;
using HotChocolate.Types;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Models.Inventory;
using IDMS.Service.GqlTypes;

namespace IDMS.Cleaning.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class CleaningMutation
    {
        //[Authorize]
        public async Task<int> AddCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, cleaning cleaning)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                cleaning newCleaning = cleaning;
                newCleaning.guid = Util.GenerateGUID();
                newCleaning.create_by = user;
                newCleaning.create_dt = currentDateTime;

                newCleaning.status_cv = string.IsNullOrEmpty(cleaning.status_cv) ? CurrentServiceStatus.APPROVE : cleaning.status_cv;

                if (!string.IsNullOrEmpty(cleaning.job_no))
                    newCleaning.job_no = cleaning.job_no;
                else
                    newCleaning.job_no = cleaning.storing_order_tank.job_no;

                await context.cleaning.AddAsync(newCleaning);
                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }


        public async Task<int> UpdateCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
        [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, cleaning cleaning)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                if (cleaning == null)
                    throw new GraphQLException(new Error("in_gate_cleaning cannot be null or empty.", "ERROR"));

                var updateCleaning = new cleaning() { guid = cleaning.guid };
                context.cleaning.Attach(updateCleaning);

                updateCleaning.update_by = user;
                updateCleaning.update_dt = currentDateTime;
                updateCleaning.job_no = cleaning.job_no;
                updateCleaning.remarks = cleaning.remarks;
               
                if (ObjectAction.APPROVE.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.status_cv = CurrentServiceStatus.APPROVE;
                    updateCleaning.approve_dt = cleaning.approve_dt;
                    updateCleaning.approve_by = cleaning?.storing_order_tank?.storing_order?.customer_company_guid;
                }
                else if (ObjectAction.KIV.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.status_cv = CurrentServiceStatus.KIV;
                }
                else if (ObjectAction.NA.EqualsIgnore(cleaning.action))
                {
                    updateCleaning.na_dt = cleaning.na_dt;
                    updateCleaning.status_cv = CurrentServiceStatus.NO_ACTION;

                    if (string.IsNullOrEmpty(cleaning.sot_guid))
                        throw new GraphQLException(new Error("SOT guid cannot be null or empty when update in_gate_cleaning.", "ERROR"));

                    var sot = new storing_order_tank() { guid = cleaning.sot_guid };
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


        public async Task<int> DeleteCleaning(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, List<string> cleaningGuids)
        {
            int retval = 0;
            try
            {

                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                var delCleaning = context.cleaning.Where(i => cleaningGuids.Contains(i.guid));
                foreach (var cleaning in delCleaning)
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
