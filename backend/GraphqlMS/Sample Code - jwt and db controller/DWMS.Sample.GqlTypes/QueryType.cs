using HotChocolate.Authorization;
using DWMS.Models;

using Microsoft.Extensions.Configuration;
using System.Net;
using Newtonsoft.Json.Linq;
using System;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using Newtonsoft.Json;
namespace DWMS.Sample.GqlTypes
{
    public class QueryType
    {
        
        public async Task<List<Identity_user>> ReadAllUsers([Service] IConfiguration config)
        {
            List<Identity_user> users= new List<Identity_user>();
            string sqlStatement = "SELECT * FROM nci.AspNetUsers";
            sqlStatement= JsonConvert.SerializeObject(sqlStatement);
           // string sqlStatement_encoded=WebUtility.UrlEncode(sqlStatement);
            string urlApi_querydata = $"{config["DBService:queryUrl"]}";
            var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
            if(status==HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent) ;
                var userList = resultJtoken["result"];
                if (userList!=null)
                {
                    users = userList.ToObject<List<Identity_user>>();

                }

            }
            return  users;

        }

        [Authorize]
       
        public async Task<Identity_user> ReadUserByEmail([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor,string email)
        {
            // get the API setting
            //call the controller  and wait return
            // 
            var authUser = httpContextAccessor.HttpContext.User;
            var primarygroupSid = authUser.FindFirstValue(ClaimTypes.GroupSid);

            if (primarygroupSid != "s1")
            {
                throw new GraphQLException(new Error("Unauthorized", "AUTH_NOT_AUTHORIZED"));
            }

           

            Identity_user user = new Identity_user();
            
            List<Identity_user> users = new List<Identity_user>();
            string sqlStatement = $"SELECT * FROM nci.AspNetUsers where Email='{email}'";
            string sqlStatement_encoded = WebUtility.UrlEncode(sqlStatement);
            string urlApi_querydata = $"{config["DBService:queryUrl"]}{sqlStatement_encoded}";
            var (status, result) = await CommonUtil.Core.Service.Util.RestCallAsync(urlApi_querydata, HttpMethod.Get);
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var userList = resultJtoken["result"].ToList();
                if(userList?.Count>0)
                {
                    var userFirst = userList[0] ;
                    user = userFirst.ToObject<Identity_user>();
                }

            }

            return user;


        }
    }
}
