using CommonUtil.Core.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Parameter.CleaningProcedure.GqlTypes
{
    public class CleanningProcedure_MutationType
    {

        public async Task<EntityClass_CleaningProcedureWithSteps> AddCleaningProcedure([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningProcedureWithSteps NewCleanProcedureSteps)
        {
            EntityClass_CleaningProcedureWithSteps retval = new();
            try
            {
                var tablename = "idms.cleaning_procedure";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                NewCleanProcedureSteps.guid = (string.IsNullOrEmpty(NewCleanProcedureSteps.guid) ? Util.GenerateGUID() : NewCleanProcedureSteps.guid);
                var cleaningSteps = NewCleanProcedureSteps.CleaningSteps;
                
                var jtkNewCleanProcedureSteps = JObject.FromObject(NewCleanProcedureSteps);
                jtkNewCleanProcedureSteps.Remove("CleaningSteps");
                jtkNewCleanProcedureSteps["create_dt"] = epochNow;
                jtkNewCleanProcedureSteps["create_by"] = uid;
                jtkNewCleanProcedureSteps["update_by"] = uid;
                

                var cmd = GqlUtils.GenerateSqlInsert(jtkNewCleanProcedureSteps, tablename);
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,eir_dt,vehicle_no,yard_guid,driver_name,LOLO,preinspection,haulier,create_dt,create_by)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}',{InGate.eir_dt},'{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}','{InGate.haulier}',{epochNow},'{uid}')";

                List<string> cmds = new List<string>();
                cmds.Add(cmd);

                //Insert links for procedure and steps
                foreach(var step in cleaningSteps)
                {
                    JObject s = new JObject();
                    s["guid"]= Util.GenerateGUID();
                    s["cleaning_procedure_guid"] = NewCleanProcedureSteps.guid;
                    s["cleaning_step_guid"] = step.guid;
                    s["duration"] = step.duration;
                    s["create_dt"] = epochNow;
                    s["create_by"] = uid;
                    s["update_by"] = uid;
                    cmd = GqlUtils.GenerateSqlInsert(s, "idms.cleaning_procedure_steps");
                    cmds.Add(cmd);

                }

                var result = await GqlUtils.RunNonQueryCommands(config, cmds);
                if (result["result"] != null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if (count > 0)
                    {
                        retval = NewCleanProcedureSteps;
                        return retval;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }


        public async Task<EntityClass_CleaningProcedureWithSteps> UpdateCleaningProcedure([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_CleaningProcedureWithSteps UpdateCleanProcedureSteps)
        {
            EntityClass_CleaningProcedureWithSteps retval = new();
            try
            {
                var tablename = "idms.cleaning_procedure";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                if(string.IsNullOrEmpty(UpdateCleanProcedureSteps.guid))
                {
                    throw new GraphQLException(new Error("guid can't be empty", "401"));
                }

                var cleaningSteps = UpdateCleanProcedureSteps.CleaningSteps;

                var jtkUpdateCleanProcedure = JObject.FromObject(UpdateCleanProcedureSteps);
                jtkUpdateCleanProcedure["update_dt"] = epochNow;
                jtkUpdateCleanProcedure["update_by"] = uid;
                jtkUpdateCleanProcedure.Remove("guid");
                jtkUpdateCleanProcedure.Remove("CleaningSteps");
                string jsonString = $@"{{
                        'set': 
                         {jtkUpdateCleanProcedure.ToString()}
                        ,
                        'where': {{
                            'guid': '{UpdateCleanProcedureSteps.guid}'
                            
                        }}
                    }}";
                jsonString = jsonString.Replace(Environment.NewLine, "");
                var jtkJson = JToken.Parse(jsonString);
                var cmd = GqlUtils.GenerateSqlUpdate(jtkJson, tablename);

                List<string> cmds = new List<string>();
                cmds.Add(cmd);
                if (cleaningSteps != null)
                {
                    cmd = $"update idms.cleaning_procedure_steps set delete_dt=now(), update_dt=now(), update_by='{uid}' where cleaning_procedure_guid='{UpdateCleanProcedureSteps.guid}' and delete_dt is null";
                    cmds.Add(cmd);
                    //Insert links for procedure and steps
                    foreach (var step in cleaningSteps)
                    {
                        JObject s = new JObject();
                        s["guid"] = Util.GenerateGUID();
                        s["cleaning_procedure_guid"] = UpdateCleanProcedureSteps.guid;
                        s["cleaning_step_guid"] = step.guid;
                        s["duration"] = step.duration;
                        s["create_dt"] = epochNow;
                        s["create_by"] = uid;
                        s["update_by"] = uid;
                        cmd = GqlUtils.GenerateSqlInsert(s, "idms.cleaning_procedure_steps");
                        cmds.Add(cmd);

                    }
                }

                var result = await GqlUtils.RunNonQueryCommands(config, cmds);
                if (result["result"] != null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if (count > 0)
                    {
                        retval = UpdateCleanProcedureSteps;
                        return retval;
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }

        public async Task<EntityClass_Result> DeleteCleaningProcedures([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string[] DeleteCleanProcedure_guids)
        {
            EntityClass_Result retval = new EntityClass_Result();
            try
            {
                var tablename = "idms.cleaning_procedure";
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var delNow = GqlUtils.GetNowEpochInSec();
                var group_guids = string.Join(", ", DeleteCleanProcedure_guids.Select(guid => $"'{guid}'"));
                var command = @$"update {tablename} set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid in ({group_guids}) ";
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                var result = await GqlUtils.RunNonQueryCommand(config, command);
                if (result["result"] != null)
                {
                    retval.result = Convert.ToInt32(result["result"]);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
            return retval;
        }
    }

}
