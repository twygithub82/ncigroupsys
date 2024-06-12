using CommonUtil.Core.Service;
using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.Extensions.Configuration;

namespace IDMS.InGate.GqlTypes
{
    public class InGate_MutationType
    {
       //[Authorize]
        public async Task<EntityClass_InGate> AddInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,EntityClass_InGate InGate)
        {
            EntityClass_InGate retval = new();   
            try
            {
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid=GqlUtils.IsAuthorize(config,httpContextAccessor);
                var guid = Util.GenerateGUID();
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,eir_dt,vehicle_no,yard_guid,driver_name,LOLO,preinspection,haulier,create_dt,create_by)
                            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}',{InGate.eir_dt},'{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                            '{InGate.LOLO}','{InGate.preinspection}','{InGate.haulier}',{epochNow},'{uid}')";

                var result = await GqlUtils.RunNonQueryCommand(config, command);
                if (result["result"]!=null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if(count > 0)
                    {
                        return InGate;
                    }
                }
            }
            catch
            {
                throw;
            }
            return retval;
        }

        //[Authorize]
        public async Task<EntityClass_InGateWithTank> UpdateInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, EntityClass_InGateWithTank InGate)
        {
            EntityClass_InGateWithTank retval = new();
            try
            {
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                InGate.guid = (string.IsNullOrEmpty(InGate.guid) ? Util.GenerateGUID() : InGate.guid);
                var cmd = @$"update in_gate set eir_dt={InGate.eir_dt}, eir_no='{InGate.eir_no}',vehicle_no='{InGate.vehicle_no}',yard_guid='{InGate.yard_guid}',
                               driver_name='{InGate.driver_name}',LOLO='{InGate.LOLO}', haulier='{InGate.haulier}',
                              preinspection='{InGate.preinspection}',update_dt={epochNow},update_by='{uid}' where guid='{InGate.guid}' ";
                List<string> commands= new List<string>();
                commands.Add(cmd);
                if(InGate.tank!=null)
                {
                    var tnk=InGate.tank;
                    cmd = $@"update storing_order_tank set last_cargo_guid='{tnk.last_cargo_guid}', open_on_gate={(tnk.open_on_gate.Value)},
                        job_no='{tnk.job_no}', purpose_storage={(tnk.purpose_storage.Value)},o2_level={(tnk.o2_level.Value)}, 
                        remarks='{tnk.remarks}',update_dt={epochNow},update_by='{uid}' where guid='{InGate.so_tank_guid}'";
                    commands.Add(cmd);
                }
                //var command = @$"Insert into in_gate (guid,so_tank_guid,eir_no,vehicle_no,yard_guid,driver_name,LOLO,preinspection,create_dt)
                //            values ('{InGate.guid}','{InGate.so_tank_guid}','{InGate.eir_no}','{InGate.vehicle_no}','{InGate.yard_guid}','{InGate.driver_name}',
                //            '{InGate.LOLO}','{InGate.preinspection}',{epochNow})";

                var result = await GqlUtils.RunNonQueryCommands(config, commands);
                if (result["result"] != null)
                {
                    int count = Convert.ToInt32(result["result"]);
                    if(count > 0)
                    {
                        string sqlStatement = $"select * from idms.in_gate where guid='{InGate.guid}' and delete_dt is null";


                        var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                        var inGateList = resultJtoken["result"];
                        if (inGateList?.Count() > 0)
                        {
                            var jsnInGate = inGateList[0];
                            var retInGate=jsnInGate.ToObject<EntityClass_InGateWithTank>();
                            var sqlQuery = $"select * from storing_order_tank where guid ='{retInGate.so_tank_guid}' and delete_dt is null";
                            var rst = await GqlUtils.QueryData(config, sqlQuery);

                            var tankList = rst["result"];
                            if (tankList?.Count() > 0)
                            {
                                var tankListCls = tankList.ToObject<List<EntityClass_Tank>>();
                                retInGate.tank = tankListCls[0];
                            }
                            return retInGate;

                        }
                    }
                }
            }
            catch
            {
                throw;
            }
            return retval;
        }

        public async Task<EntityClass_Result> DeleteInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string InGate_guid)
        {
            EntityClass_Result retval = new EntityClass_Result();
            try
            {
                long epochNow = GqlUtils.GetNowEpochInSec();
                var uid = GqlUtils.IsAuthorize(config, httpContextAccessor);
                var guid = Util.GenerateGUID();
                var delNow = GqlUtils.GetNowEpochInSec();
                var command = @$"update in_gate set delete_dt={delNow},update_by='{uid}',update_dt={delNow}  where guid='{InGate_guid}' ";
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
    