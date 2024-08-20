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
using IDMS.Models.Inventory;
using Microsoft.EntityFrameworkCore;
using IDMS.Models.Inventory.InGate.GqlTypes.DB;

namespace IDMS.InGate.GqlTypes
{
    public class InGate_QueryType
    {

        public void Ping([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            if (context != null)
            {
                context.in_gate.First();
            }
        }
        // [Authorize]
        // [UseDbContext(typeof(ApplicationDBContext))]
        // public async Task<List<EntityClass_InGate>> QueryInGates([Service] ApplicationDBContext context,[Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor , EntityClass_InGate queryInGate)
        //  [UseDbContext(typeof(ApplicationDBContext))]
        [UsePaging(IncludeTotalCount = true, DefaultPageSize = 10)]
        // [UseProjection]
        [UseFiltering(typeof(IDMS.Models.Filters.in_gate_filtertype))]
        [UseSorting]
        public IQueryable<InGateWithTank> QueryInGates([Service] ApplicationInventoryDBContext context, [Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            IQueryable<InGateWithTank> query = null;
            // List<EntityClass_InGate> retInGates = new List<EntityClass_InGate>();
            try
            {

                GqlUtils.IsAuthorize(config, httpContextAccessor);
                query = context.in_gate.Where(i => i.delete_dt == null || i.delete_dt == 0)
                    .Include(s => s.tank).Where(i => i.tank != null).Where(i => i.tank.delete_dt == null || i.tank.delete_dt == 0)
                    .Include(s => s.tank.tariff_cleaning)
                    .Include(s => s.tank.storing_order)
                    .Include(s => s.tank.storing_order.customer_company)
                    .Include(s => s.tank.tariff_cleaning.cleaning_method)
                    .Include(s => s.tank.tariff_cleaning.cleaning_category)
                    .Include(s => s.in_gate_survey);
                // .Include(s=>s.tank.tariff_cleaning.cleaning_method);
                foreach (var q in query)
                {
                    if (q.tank != null)
                        if (q.tank.storing_order != null)
                            q.haulier = q.tank.storing_order.haulier;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                throw;
            }

            return query;
        }


        //// [Authorize]
        //public async Task<EntityClass_InGateWithTank> QueryInGate([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string tank_guid)
        //{
        //    EntityClass_InGateWithTank retInGate = new EntityClass_InGateWithTank();
        //    try
        //    {

        //        GqlUtils.IsAuthorize(config, httpContextAccessor);
        //        string sqlStatement = $"select * from idms.in_gate where so_tank_guid='{tank_guid}'  and delete_dt is null";


        //        var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
        //        var inGateList = resultJtoken["result"];
        //        if (inGateList?.Count() > 0)
        //        {
        //            var jsnInGate = inGateList[0];
        //            retInGate = jsnInGate.ToObject<EntityClass_InGateWithTank>();

        //            var sqlQuery = $"select * from storing_order_tank where guid ='{retInGate.so_tank_guid}'  and delete_dt is null";
        //            var result = await GqlUtils.QueryData(config, sqlQuery);

        //            var tankList = result["result"];
        //            if (tankList?.Count() > 0)
        //            {
        //                var tankListCls = inGateList.ToObject<List<EntityClass_Tank>>();
        //                retInGate.tank = tankListCls[0];
        //            }
        //        }

        //        //string urlApi_querydata = $"{config["DBService:queryUrl"]}";
        //        //string sqlStatement = JsonConvert.SerializeObject($"select * from idms.in_gate where tank_guid='{tank_guid}'");
        //        //var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
        //        //if (status == HttpStatusCode.OK)
        //        //{
        //        //    var resultContent = $"{result}";
        //        //    var resultJtoken = JObject.Parse(resultContent);
        //        //    var inGateList = resultJtoken["result"];
        //        //    if (inGateList?.Count()>0)
        //        //    {
        //        //        var jsnInGate = inGateList[0];
        //        //        retInGate= jsnInGate.ToObject<EntityClass_InGate>();

        //        //    }
        //        //}
        //        //else
        //        //{
        //        //    throw new GraphQLException(new Error("Fail to query all in gates data", status.ToString()));
        //        //}
        //    }
        //    catch
        //    {
        //        throw;
        //    }

        //    return retInGate;
        //}




    }
}