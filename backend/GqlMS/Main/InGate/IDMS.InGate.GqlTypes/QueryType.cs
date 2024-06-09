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

namespace IDMS.InGate.GqlTypes
{
    public class QueryType
    {
        public async Task<string> GetBook()
        {
            return "This is my book";
        }

        [Authorize]
        public async Task<List<EntityClass_InGate>> QueryAllInGates([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            List<EntityClass_InGate> retInGates = new List<EntityClass_InGate>();
            try
            {
                
                GqlUtils.IsAuthorize(config,httpContextAccessor);
                string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject("select * from idms.in_gate");
                var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    var resultJtoken = JObject.Parse(resultContent);
                    var inGateList = resultJtoken["result"];
                    if (inGateList != null)
                    {
                        retInGates = inGateList.ToObject<List<EntityClass_InGate>>();

                    }
                }
                else
                {
                    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
                }
           }
            catch
            {
                throw;
            }

            return retInGates;
        }


        [Authorize]
        public async Task<EntityClass_InGate> QueryInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,string tank_guid)
        {
            EntityClass_InGate retInGate = new EntityClass_InGate();
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject($"select * from idms.in_gate where tank_guid='{tank_guid}'");
                var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    var resultJtoken = JObject.Parse(resultContent);
                    var inGateList = resultJtoken["result"];
                    if (inGateList?.Count()>0)
                    {
                        var jsnInGate = inGateList[0];
                        retInGate= jsnInGate.ToObject<EntityClass_InGate>();

                    }
                }
                else
                {
                    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
                }
            }
            catch
            {
                throw;
            }

            return retInGate;
        }




    }
}
