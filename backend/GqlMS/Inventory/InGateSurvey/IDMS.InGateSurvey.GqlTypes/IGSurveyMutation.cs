using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.InGateSurvey.Model.Request;
using IDMS.Models;
using IDMS.Models.Inventory;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Data.SqlTypes;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace IDMS.InGateSurvey.GqlTypes
{
    public class IGSurveyMutation
    {
        ////[Authorize]
        // public async Task<int> AddInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, 
        //     [Service] IHttpContextAccessor httpContextAccessor, InGateSurveyRequest inGateSurvey)
        // {
        //     int retval = 0;   

        //     try
        //     {
        //         //string so_guid = "";
        //         //long epochNow = GqlUtils.GetNowEpochInSec();
        //         //var user=GqlUtils.IsAuthorize(config,httpContextAccessor);
        //         string user = "admin";
        //         long currentDateTime = DateTime.Now.ToEpochTime();


        //         retval = context.SaveChanges();
        //     }
        //     catch
        //     {
        //         throw;
        //     }
        //     return retval;
        // }

        //[Authorize]
        public async Task<int> UpdateInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, InGateSurveyRequest inGateSurveyRequest)
        {
            int retval = 0;

            try
            {
                in_gate_survey  ingateSurvey = context.in_gate_survey.Where(i=>i.delete_dt == null || i.delete_dt == 0).FirstOrDefault();
                if (ingateSurvey == null)
                    throw new GraphQLException(new Error("Ingate survey not found.", "NOT_FOUND"));
              
                if(ingateSurvey.in_gate_guid == null)
                    throw new GraphQLException(new Error("Ingate Guid cant be null.", "Error"));



                retval = context.SaveChanges();
                // retval = InGate;


            }
            catch
            {
                throw;
            }
            return retval;
        }

        public async Task<int> DeleteInGateSurvey([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config,
            [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            int retval = 0;
            try
            {

                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var query = context.in_gate.Where(i => i.guid == $"{InGate_guid}");
                if (query.Any())
                {
                    long epochNow = GqlUtils.GetNowEpochInSec();
                    var delInGate = query.FirstOrDefault();
                    delInGate.delete_dt = epochNow;
                    delInGate.update_by = uid;
                    delInGate.update_dt = epochNow;

                    retval = context.SaveChanges(true);
                }

                //long epochNow = GqlUtils.GetNowEpochInSec();
                //var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                //var guid = Util.GenerateGUID();
                //var delNow = GqlUtils.GetNowEpochInSec();
                //var command = @$"update in_gate set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{InGate_guid}' ";
                ////var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                ////            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                ////            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                //var result = await GqlUtils.RunNonQueryCommand(config, command);
                //if (result["result"] != null)
                //{
                //    retval.result = Convert.ToInt32(result["result"]);
                //}
            }
            catch
            {
                throw;
            }
            return retval;
        }
    }
}
