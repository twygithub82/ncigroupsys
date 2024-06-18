
using HotChocolate;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json.Linq;
using System.Net;
using CommonUtil.Core.Service;
using System.Runtime.CompilerServices;
using IDMS.DBAccess.Interface;
using IDMS.StoringOrder.Model;
using Microsoft.AspNetCore.Http;

namespace IDMS.StoringOrder.GqlTypes
{
    public class QueryType
    {
        private readonly IDBAccess _dbAccess;

        public QueryType([Service] IDBAccess dBAccess)
        {
            _dbAccess = dBAccess;
        }

        public async Task<List<StoringOrdersResult>> QueryAllStoringOrders([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            //var orders = await _dbAccess.GetAllDataAsync<StoringOder>("storing_order");
            //return orders.ToList();

            List<StoringOrdersResult> soResults = new List<StoringOrdersResult>();
      
            try
            {
                //GqlUtils.IsAuthorize(config, httpContextAccessor);
                string sqlStatement = "SELECT * from idms.storing_order WHERE delete_dt is null or delete_dt = 0";
                var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                var soToken = resultJtoken["result"];
                if (soToken?.Count() > 0) 
                {
                    soResults = soToken.ToObject<List<StoringOrdersResult>>();

                    // Extract and distinct so_tank_guid values
                    var distinctSoGuids = soResults
                        .Where(e => !string.IsNullOrEmpty(e.guid)) // Filter out null or empty values
                        .Select(e => e.guid)
                        .Distinct()
                        .ToList();

                    var sqlCondition = "(";

                    foreach (var guid in distinctSoGuids)
                    {
                        sqlCondition += (sqlCondition == "(" ? "" : ",");
                        sqlCondition += $"'{guid}'";
                    }
                    sqlCondition += ")";
                    var sqlQuery = $"SELECT * FROM idms.storing_order_tank WHERE so_guid in {sqlCondition}";
                    var result = await GqlUtils.QueryData(config, sqlQuery);

                    var soTankToken = result["result"];
                    if (soTankToken?.Count() > 0)
                    {
                        var soTank = soTankToken.ToObject<List<StoringOrderTank>>();
                        foreach (var so in soResults)
                        {
                            var tnk = soTank.Where(t => t.so_guid == so.guid).ToList();
                            if (tnk != null)
                            {
                                so.TankList = tnk;
                            }

                            var sqlComQuery = $"SELECT * FROM idms.customer_company WHERE guid = '{so.customer_company_guid}'";
                            var res = await GqlUtils.QueryData(config,sqlComQuery);
                            var comToken = res["result"];
                            if (comToken?.Count() > 0) 
                            {
                                var cusCom = comToken.ToObject<List<CustomerCompany>>().FirstOrDefault();
                                so.CustomerCompany = cusCom;
                            }
                        }
                    }
                }
            }
            catch (Exception ex) {
                throw;
            }

            return soResults;
        }

        public async Task<List<CodeValues>> QueryCodeValues(CodeValues codeValues)
        {

            List<CodeValues> codeValuesList = new List<CodeValues>();
            return codeValuesList;
            //Query code value table and return as a list

        }



        public async Task<StoringOrdersResult> QueryStoringOrderById([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor, string guid)
        {
            StoringOrdersResult soResults = new StoringOrdersResult();
            try
            {
                //GqlUtils.IsAuthorize(config, httpContextAccessor);

                //string sqlStatement = $"SELECT * from idms.storing_order WHERE guid = '{guid}' AND (delete_dt is null OR delete_dt = 0) Limit 1";

                string sqlStatement = $"select * from storing_order so left join customer_company cc on (cc.guid = so.customer_company_guid) Where so.guid = '{guid}'";
                var resultJtoken = await GqlUtils.QueryData(config, sqlStatement);
                var soToken = resultJtoken["result"];
                if (soToken?.Count() > 0)
                {
                    var so = soToken.FirstOrDefault();
                    soResults = so.ToObject<StoringOrdersResult>();
                    soResults.CustomerCompany = so.ToObject<CustomerCompany>();

                    var sqlQuery = $"select * from idms.storing_order_tank where so_guid ='{guid}' and (delete_dt is null or delete_dt = 0)";
                    var result = await GqlUtils.QueryData(config, sqlQuery);

                    var tankToken = result["result"];
                    if (tankToken?.Count() > 0)
                    {
                        var tankListCls = tankToken.ToObject<List<StoringOrderTank>>();
                        soResults.TankList = tankListCls;
                    }

                    //var sqlComQuery = $"SELECT * FROM idms.customer_company WHERE guid = '{soResults.customer_company_guid}'";
                    //var res = await GqlUtils.QueryData(config, sqlComQuery);
                    //var comToken = res["result"];
                    //if (comToken?.Count() > 0)
                    //{
                    //    var cusCom = comToken.ToObject<List<CustomerCompany>>().FirstOrDefault();
                    //    soResults.CustomerCompany = cusCom;
                    //}
                }
            }
            catch
            {
                throw;
            }

            return soResults;
        }

        //public async Task<List<StoringOrderTank>> QueryStoringOrderTankBySOId(StoringOrderTank sot)
        //{
        //    var guid = sot.so_guid;
        //    //Select Storing Ordrt Tank table n join  tarif cleaning table
        //    var order = await _dbAccess.GetDataByIdAsync<StoringOder>(soNo, "storing_order");
        //    if (order == null)
        //    {
        //        throw new GraphQLException(new Error("storing order not found", "NOT_FOUND"));
        //    }
        //    return order;
        //}


    }
}
