using DWMS.Cleaning.Model;
using DWMS.DB.Interface;
using DWMS.DBAccess.Interface;
using Newtonsoft.Json.Linq;
using System.Data;
using static DWMS.DB.Interface.iDatabase;

namespace DWMS.DBAccess
{
    public class DBAccessService : iDBAccess
    {
        private readonly iDatabase _mySqlDb;

        public DBAccessService(iDatabase mySqlDb)
        {
            _mySqlDb = mySqlDb;
        }

        public Task DeleteDataAsync(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<Person>> GetAllDataAsync()
        {
            JToken result = _mySqlDb.OpenCloseQueryData("SELECT * FROM test").Result;
            // Convert JToken to List<Person>
            List<Person> persons = result.ToObject<List<Person>>();
            return persons;

        }

        public Task<Person> GetDataByIdAsync(int id)
        {
            throw new NotImplementedException();
        }

        public Task InsertDataAsync(Person data)
        {
            throw new NotImplementedException();
        }

        public Task UpdateDataAsync(int id, Person data)
        {
            throw new NotImplementedException();
        }
    }
}
