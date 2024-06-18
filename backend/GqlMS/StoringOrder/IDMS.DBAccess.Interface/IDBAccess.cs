using IDMS.StoringOrder.Model.Domain;

namespace IDMS.DBAccess.Interface
{
    public interface IDBAccess
    {
        //Task<IEnumerable<Person>> GetAllDataAsync();
        //Task<Person> GetDataByIdAsync(int id);
        //Task<Person> InsertDataAsync(Person data);
        //Task UpdateDataAsync(int id, Person data);
        //Task DeleteDataAsync(int id);


        //Task<IEnumerable<StoringOder>> GetAllDataAsync1();
        Task<IEnumerable<T>> GetAllDataAsync<T>(string tableName);
        //Task<StoringOder> GetDataByIdAsync(string guid);
        //Task<StoringOder> GetDataByIdAsync<T>(string guid, string tableName);
        Task<int> InsertDataAsync(SO_type so, List<storing_order_tank_type> soTanks);
        //Task<StoringOder> InsertDataAsync(StoringOder data);
        Task<int> UpdateDataAsync(SO_type so, List<storing_order_tank_type> soTanks);
        //Task UpdateDataAsync(string guid, StoringOder data);
        Task<int> DeleteDataAsync(string guid, string tableName);
    }
}
