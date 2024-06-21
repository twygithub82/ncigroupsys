using CommonUtil.Core.Service;
using HotChocolate;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Net;
using IDMS.DBAccess.Interface;
using IDMS.StoringOrder.Model.Domain;

namespace IDMS.DBAccess
{
    public class DBAccessService : IDBAccess
    {
        IConfiguration _config;

        public DBAccessService([Service] IConfiguration config)
        {
            _config = config;
        }

        //public Task DeleteDataAsync(int id)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task DeleteDataAsync(string guid)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<int> DeleteDataAsync(string guid, string tableName)
        {
            long curDT = DateTime.Now.ToEpochTime();
            string sqlStatement = $"UPDATE idms.{tableName} SET delete_dt = {curDT} WHERE guid = '{guid}'";
            string urlApi_querydata = $"{_config["DBService:nonQueryUrl"]}";
            var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));
            //IEnumerable<T> resultList = new List<T>();
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var ret = resultJtoken["result"];
                if (ret != null)
                {
                    return ret.ToObject<List<int>>().FirstOrDefault();

                }
            }
            return 0;
        }

        public async Task<int> UpdateDataAsync<T>(SOType so, List<storing_order_tank> soTanks)
        {

            string updateby = "edmund";
            long updateDT = DateTime.Now.ToEpochTime();

            string sqlStatement = $"UPDATE idms.storing_order SET so_notes = '{so.so_notes}', haulier = '{so.haulier}'" +   
                $"update_dt = {updateDT}, update_by = '{updateby}' WHERE guid = '{so.guid}'";

            string urlApi_querydata = $"{_config["DBService:nonQueryUrl"]}";
            var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));
            //IEnumerable<T> resultList = new List<T>();
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var ret = resultJtoken["result"];
                if (ret != null)
                {
                    return ret.ToObject<List<int>>().FirstOrDefault();

                }
            }
            return 0;
        }

        //public async Task<IEnumerable<Person>> GetAllDataAsync()
        //{
        //    string sqlStatement = "SELECT * FROM test";
        //    string urlApi_querydata = $"{_config["DBService:queryUrl"]}{EncodeUrl(sqlStatement)}";
        //    var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Get);
        //    IEnumerable<Person> persons = new List<Person>();
        //    if (status == HttpStatusCode.OK)
        //    {
        //        var resultContent = $"{result}";
        //        var resultJtoken = JObject.Parse(resultContent);
        //        var userList = resultJtoken["result"];
        //        if (userList != null)
        //        {
        //            persons = userList.ToObject<List<Person>>();

        //        }
        //    }
        //    return persons;

        //}

        //public async Task<IEnumerable<StoringOder>> GetAllDataAsync1()
        //{
        //    string sqlStatement = $"SELECT * FROM idms.storing_order";
        //    string urlApi_querydata = $"{_config["DBService:queryUrl"]}";
        //    var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));
        //    IEnumerable<StoringOder> soList = new List<StoringOder>();
        //    if (status == HttpStatusCode.OK)
        //    {
        //        var resultContent = $"{result}";
        //        var resultJtoken = JObject.Parse(resultContent);
        //        var ret = resultJtoken["result"];
        //        if (ret != null)
        //        {
        //            return ret.ToObject<List<StoringOder>>();

        //        }
        //    }
        //    return soList;
        //}


        public async Task<IEnumerable<T>> GetAllDataAsync<T>(string tableName)
        {
            string sqlStatement = $"SELECT * FROM idms.{tableName}";
            string urlApi_querydata = $"{_config["DBService:queryUrl"]}";
            var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));
            IEnumerable<T> resultList = new List<T>();
            if (status == HttpStatusCode.OK)
            {
                var resultContent = $"{result}";
                var resultJtoken = JObject.Parse(resultContent);
                var ret = resultJtoken["result"];
                if (ret != null)
                {
                    return ret.ToObject<List<T>>();

                }
            }
            return resultList;
        }

        //public async Task<StoringOder> GetDataByIdAsync(string soNo, string tableName)
        //{
        //    string sqlStatement = $"SELECT * FROM idms.{tableName} WHERE so_no = '{soNo}'";
        //    string urlApi_querydata = $"{_config["DBService:queryUrl"]}";
        //    var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));

        //    if (status == HttpStatusCode.OK)
        //    {
        //        var resultContent = $"{result}";
        //        var resultJtoken = JObject.Parse(resultContent);
        //        var ret = resultJtoken["result"];
        //        if (ret != null)
        //        {
        //            return ret.ToObject<List>;
        //        }
        //    }
        //    return ;
        //}

        //public async Task<Person> GetDataByIdAsync(int id)
        //{
        //    string sqlStatement = $"SELECT * FROM test WHERE ID = {id}";
        //    string urlApi_querydata = $"{_config["DBService:queryUrl"]}{EncodeUrl(sqlStatement)}";
        //    var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Get);
            
        //    if (status == HttpStatusCode.OK)
        //    {
        //        var resultContent = $"{result}";
        //        var resultJtoken = JObject.Parse(resultContent);
        //        var userList = resultJtoken["result"];
        //        if (userList != null)
        //        {
        //            return userList.ToObject<List<Person>>().FirstOrDefault();

        //        }
        //    }
        //    return null;
        //}

        //public Task<StoringOder> GetDataByIdAsync(string guid)
        //{
        //    throw new NotImplementedException();
        //}

        //public async Task<Person> InsertDataAsync(Person data)
        //{
        //    string sqlStatement = $"INSERT INTO test (name, date) values ('{data.Name}', '{data.Date.ToString("yyyy-MM-dd HH:mm:ss")}')";
        //    string urlApi_insertData = $"{_config["DBService:nonQueryUrl"]}";
        //    var (status, result) = await Util.RestCallAsync(urlApi_insertData, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));

        //    if (status == HttpStatusCode.OK)
        //    {
        //        var resultContent = $"{result}";
        //        var resultJtoken = JObject.Parse(resultContent);
        //        var ret = resultJtoken["result"];
        //        if (ret?.ToObject<int>() > 0)
        //        {
        //            return data;
        //        }
        //    }
        //    return null;
        //}

        //public Task<StoringOder> InsertDataAsync(StoringOder data)
        //{
        //    throw new NotImplementedException();
        //}

        public async Task<T> InsertDataAsync<T>(T data, string tableName)
        {
            //string sqlStatement = $"INSERT INTO test (name, date) values ('{data.Name}', '{data.Date.ToString("yyyy-MM-dd HH:mm:ss")}')";
            //string urlApi_insertData = $"{_config["DBService:nonQueryUrl"]}";
            //var (status, result) = await Util.RestCallAsync(urlApi_insertData, HttpMethod.Post, JsonConvert.SerializeObject(sqlStatement));

            //if (status == HttpStatusCode.OK)
            //{
            //    var resultContent = $"{result}";
            //    var resultJtoken = JObject.Parse(resultContent);
            //    var ret = resultJtoken["result"];
            //    if (ret?.ToObject<int>() > 0)
            //    {
            //        return data;
            //    }
            //}
            return default(T);
        }

        //public Task UpdateDataAsync(int id, Person data)
        //{
        //    throw new NotImplementedException();
        //}

        //public Task UpdateDataAsync(string guid, StoringOder data)
        //{
        //    throw new NotImplementedException();
        //}



        private string EncodeUrl(string sqlStatement)
        {
            string sqlStatement_encoded = WebUtility.UrlEncode(sqlStatement);
            return sqlStatement_encoded;
        }

        public Task<int> InsertDataAsync(SOType so, List<storing_order_tank> soTanks)
        {
            throw new NotImplementedException();
        }

        public Task<int> UpdateDataAsync(SOType so, List<storing_order_tank> soTanks)
        {
            throw new NotImplementedException();
        }
    }
}
