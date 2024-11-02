using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate;
using IDMS.Models.Service.GqlTypes.DB;
using IDMS.Models.Service;
using IDMS.Service.GqlTypes;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using HotChocolate.Types;

namespace IDMS.Steaming.GqlTypes
{
    [ExtendObjectType(typeof(ServiceMutation))]
    public class SteamingMutation
    {
        public async Task<int> AddSteaming(ApplicationServiceDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service] IMapper mapper, steaming steaming)
        {

            try
            {
                var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                long currentDateTime = DateTime.Now.ToEpochTime();

                steaming newSteaming = steaming;
                newSteaming.guid = Util.GenerateGUID();
                newSteaming.create_by = user;
                newSteaming.create_dt = currentDateTime;

                newSteaming.status_cv = string.IsNullOrEmpty(steaming.status_cv) ? CurrentServiceStatus.APPROVED : steaming.status_cv;

                if (!string.IsNullOrEmpty(steaming.job_no))
                    newSteaming.job_no = steaming.job_no;
                else
                    newSteaming.job_no = steaming.storing_order_tank.job_no;

                await context.steaming.AddAsync(newSteaming);
                var res = await context.SaveChangesAsync();

                return res;
            }
            catch (Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }

        }
    }
}
