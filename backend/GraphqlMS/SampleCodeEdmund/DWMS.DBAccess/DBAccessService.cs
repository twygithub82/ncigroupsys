using CommonUtil.Core.Service;
using DWMS.Cleaning.Model;
using DWMS.DB.Interface;
using DWMS.DBAccess.Interface;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Data;
using System.Net;
using System.Net.Http.Json;
using System.Reflection.Metadata.Ecma335;
using System.Runtime.CompilerServices;
using System.Text;
using static DWMS.DB.Interface.iDatabase;

namespace DWMS.DBAccess
{
    public class DBAccessService : IDBAccess
    {
        IConfiguration _config;

        public DBAccessService([Service] IConfiguration config)
        {
            _config = config;
        }

        public Task DeleteDataAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Person>> GetAllDataAsync()
        {
            string sqlStatement = "SELECT * FROM test";
            string urlApi_querydata = $"{_config["DBService:queryUrl"]}{EncodeUrl(sqlStatement)}";
            var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Get);
            IEnumerable<Person> persons = new List<Person>();
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var userList = resultJtoken["result"];
                if (userList != null)
                {
                    persons = userList.ToObject<List<Person>>();

                }
            }
            return persons;

        }

        public async Task<Person> GetDataByIdAsync(int id)
        {
            string sqlStatement = $"SELECT * FROM test WHERE ID = {id}";
            string urlApi_querydata = $"{_config["DBService:queryUrl"]}{EncodeUrl(sqlStatement)}";
            var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Get);
            
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var userList = resultJtoken["result"];
                if (userList != null)
                {
                    return userList.ToObject<List<Person>>().FirstOrDefault();

                }
            }
            return null;
        }

        public async Task<Person> InsertDataAsync(Person data)
        {
            string sqlStatement = $"INSERT INTO test (name, date) values ('{data.Name}', '{data.Date.ToString("yyyy-MM-dd HH:mm:ss")}')";
           
            
            
            string urlApi_insertData = $"{_config["DBService:nonQueryUrl"]}";
            var (status, result) = await Util.RestCallAsync(urlApi_insertData, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));

            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var ret = resultJtoken["result"];
                if (ret?.ToObject<int>() > 0)
                {
                    return data;
                }
            }
            return null;
        }

        public Task UpdateDataAsync(int id, Person data)
        {
            throw new NotImplementedException();
        }

        private string EncodeUrl(string sqlStatement)
        {
            string sqlStatement_encoded = WebUtility.UrlEncode(sqlStatement);
            return sqlStatement_encoded;
        }
    }
}
