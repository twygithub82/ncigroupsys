using HotChocolate.Authorization;
using IDMS.Models;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;

using Microsoft.Extensions.Configuration;
using System.Net;
using Newtonsoft.Json.Linq;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Newtonsoft.Json;
using Microsoft.AspNetCore.Identity;
using System.Diagnostics.Metrics;

namespace IDMS.InGate.GqlTypes
{
    public class InGate_QueryType
    {
       

       // [Authorize]
        public async Task<List<EntityClass_InGateWithTank>> QueryAllInGates([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            List<EntityClass_InGateWithTank> retInGates = new List<EntityClass_InGateWithTank>();
            try
            {
                
                GqlUtils.IsAuthorize(config,httpContextAccessor);

                string sqlStatement = "select * from idms.in_gate where  delete_dt is null";
                var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                var inGateList = resultJtoken["result"];
                if (inGateList?.Count() > 0)
                {
                    retInGates = inGateList.ToObject<List<EntityClass_InGateWithTank>>();

                    // Extract and distinct so_tank_guid values
                    var distinctSoTankGuids = retInGates
                        .Where(e => !string.IsNullOrEmpty(e.so_tank_guid)) // Filter out null or empty values
                        .Select(e => e.so_tank_guid)
                        .Distinct()
                        .ToList();

                    var sqlCondition = "(";
                   
                    foreach (var guid in distinctSoTankGuids)
                    {
                        sqlCondition += (sqlCondition=="(" ? "" : ",");
                        sqlCondition += $"'{guid}'";
                    }
                    sqlCondition += ")";
                    var sqlQuery = $"select * from storing_order_tank where guid in {sqlCondition}";
                    var result = await GqlUtils.QueryData(config, sqlQuery);

                    var tankList = result["result"];
                    if (tankList?.Count() > 0)
                    {
                        var tankListCls = inGateList.ToObject<List<EntityClass_Tank>>();
                        foreach (var ig in retInGates)
                        {
                           var tnk = tankListCls.Where(t=>t.guid== ig.guid).FirstOrDefault();
                            ig.tank=tnk;
                        }

                    }
                }
                //string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                //string sqlStatement = JsonConvert.SerializeObject("select * from idms.in_gate");
                //var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                //if (status == HttpStatusCode.OK)
                //{
                //    var resultContent = $"{result}";
                //    var resultJtoken = JObject.Parse(resultContent);
                //    var inGateList = resultJtoken["result"];
                //    if (inGateList != null)
                //    {
                //        retInGates = inGateList.ToObject<List<EntityClass_InGate>>();

                //    }
                //}
                //else
                //{
                //    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
                //}
            }
            catch
            {
                throw;
            }

            return retInGates;
        }


       // [Authorize]
        public async Task<EntityClass_InGateWithTank> QueryInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,string tank_guid)
        {
            EntityClass_InGateWithTank retInGate = new EntityClass_InGateWithTank();
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                string sqlStatement = $"select * from idms.in_gate where so_tank_guid='{tank_guid}'  and delete_dt is null";


                var resultJtoken= await GqlUtils.QueryData(config, sqlStatement);
                var inGateList = resultJtoken["result"];
                if (inGateList?.Count() > 0)
                {
                    var jsnInGate = inGateList[0];
                    retInGate = jsnInGate.ToObject<EntityClass_InGateWithTank>();

                    var sqlQuery = $"select * from storing_order_tank where guid ='{retInGate.so_tank_guid}'  and delete_dt is null";
                    var result = await GqlUtils.QueryData(config, sqlQuery);

                    var tankList = result["result"];
                    if (tankList?.Count() > 0)
                    {
                        var tankListCls = inGateList.ToObject<List<EntityClass_Tank>>();
                        retInGate.tank = tankListCls[0];
                    }
                }

                //string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                //string sqlStatement = JsonConvert.SerializeObject($"select * from idms.in_gate where tank_guid='{tank_guid}'");
                //var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                //if (status == HttpStatusCode.OK)
                //{
                //    var resultContent = $"{result}";
                //    var resultJtoken = JObject.Parse(resultContent);
                //    var inGateList = resultJtoken["result"];
                //    if (inGateList?.Count()>0)
                //    {
                //        var jsnInGate = inGateList[0];
                //        retInGate= jsnInGate.ToObject<EntityClass_InGate>();

                //    }
                //}
                //else
                //{
                //    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
                //}
            }
            catch
            {
                throw;
            }

            return retInGate;
        }




    }
}
