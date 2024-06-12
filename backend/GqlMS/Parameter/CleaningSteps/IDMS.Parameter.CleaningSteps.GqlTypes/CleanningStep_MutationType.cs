using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningSteps.GqlTypes
{
    public class CleanningStep_MutationType
    {

        public async Task<EntityClass_CleaningStep> AddCleaningStep([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningStep NewCleanStep)
        {
            EntityClass_CleaningStep retval = new();
            try
            {
                var tablename = "idms.cleaning_steps";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                NewCleanStep.guid = (string.IsNullOrEmpty(NewCleanStep.guid) ? Util.GenerateGUID() : NewCleanStep.guid);
                var jtkNewCleanStep = JObject.FromObject(NewCleanStep);
                jtkNewCleanStep["create_dt"] = epochNow;
                jtkNewCleanStep["create_by"] = uid;
                jtkNewCleanStep["update_by"] = uid;
                var cmd = GqlUtils.GenerateSqlInsert(jtkNewCleanStep, tablename);
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,eir_dt,vehicle_no,yard_guid,driver_name,LOLO,preinspection,haulier,create_dt,create_by)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}',{InGate.eir_dt},'{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}','{InGate.haulier}',{epochNow},'{uid}')";

                var result = await GqlUtils.RunNonQueryCommand(config, cmd);
                if (result["result"] != null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if (count > 0)
                    {
                        retval = NewCleanStep;
                        return retval;
                    }
                }
            }
            catch
            {
                throw;
            }
            return retval;
        }


        public async Task<EntityClass_CleaningStep> UpdateCleaningStep([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningStep UpdateCleanStep)
        {
            EntityClass_CleaningStep retval = new();
            try
            {
                var tablename = "idms.cleaning_steps";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                
                var jtkNewCleanStep = JObject.FromObject(UpdateCleanStep);
                jtkNewCleanStep["update_dt"] = epochNow;
                jtkNewCleanStep["update_by"] = uid;
                jtkNewCleanStep.Remove("guid");
                string jsonString = $@"{{
                        'set': 
                         {jtkNewCleanStep.ToString()}
                        ,
                        'where': {{
                            'guid': '{UpdateCleanStep.guid}'
                            
                        }}
                    }}";
                jsonString = jsonString.Replace(Environment.NewLine, "");
                var jtkJson = JToken.Parse(jsonString);
                var cmd = GqlUtils.GenerateSqlUpdate(jtkJson, tablename);
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,eir_dt,vehicle_no,yard_guid,driver_name,LOLO,preinspection,haulier,create_dt,create_by)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}',{InGate.eir_dt},'{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}','{InGate.haulier}',{epochNow},'{uid}')";

                var result = await GqlUtils.RunNonQueryCommand(config, cmd);
                if (result["result"] != null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if (count > 0)
                    {
                        retval = UpdateCleanStep;
                        return retval;
                    }
                }
            }
            catch
            {
                throw;
            }
            return retval;
        }

        public async Task<EntityClass_Result> DeleteCleaningStep([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string DeleteCleanStep_guid)
        {
            EntityClass_Result retval = new EntityClass_Result();
            try
            {
                var tablename = "idms.cleaning_steps";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delNow = GqlUtils.GetNowEpochInSec();
                var command = @$"update {tablename} set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{DeleteCleanStep_guid}' ";
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                var result = await GqlUtils.RunNonQueryCommand(config, command);
                if (result["result"] != null)
                {
                    retval.result = Convert.ToInt32(result["result"]);
                }
            }
            catch
            {
                throw;
            }
            return retval;
        }
    }

}
