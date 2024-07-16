using AutoMapper;
using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.InGateSurvey.Model.Request;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace IDMS.InGateSurvey.GqlTypes
{
    public class IGSurveyMutation
    {
        //[Authorize]
        public async Task<int> AddInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, [Service]IMapper mapper, InGateSurveyRequest inGateSurveyRequest)
        {
            int retval = 0;

            try
            {
                //string so_guid = "";
                //long epochNow = GqlUtils.GetNowEpochInSec();
                //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                in_gate_survey ingateSurvey = new();
                mapper.Map(inGateSurveyRequest, ingateSurvey);

                ingateSurvey.guid = Util.GenerateGUID();
                ingateSurvey.create_by = user;
                ingateSurvey.create_dt = currentDateTime;
                context.Add(ingateSurvey);

                retval = await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        //[Authorize]
        public async Task<int> UpdateInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, InGateSurveyRequest inGateSurveyRequest, [Service]IMapper mapper)
        {
            int retval = 0;

            try
            {
                in_gate_survey ingateSurvey = context.in_gate_survey.Where(i => i.delete_dt == null || i.delete_dt == 0).FirstOrDefault();
                if (ingateSurvey == null)
                    throw new GraphQLException(new Error("Ingate survey not found.", "NOT_FOUND"));

                if (ingateSurvey.in_gate_guid == null)
                    throw new GraphQLException(new Error("Ingate guid cant be null.", "Error"));

                //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
                string user = "admin";
                long currentDateTime = DateTime.Now.ToEpochTime();

                mapper.Map(inGateSurveyRequest, ingateSurvey);
                ingateSurvey.update_by = user;
                ingateSurvey.update_dt = currentDateTime;

                retval = await context.SaveChangesAsync();
            }
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }

        public async Task<int> DeleteInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string IGSurvey_guid)
        {
            int retval = 0;
            try
            {

                //var user = GqlUtils.IsAuthorize(config, httpContextAccessor);
                string user = "admin";
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
            catch(Exception ex)
            {
                throw new GraphQLException(new Error($"{ex.Message} -- {ex.InnerException}", "ERROR"));
            }
            return retval;
        }
    }
}
