using IDMS.StoringOrder.Model;

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
        Task<T> GetDataByIdAsync<T>(string guid, string tableName);
        Task<T> InsertDataAsync<T>(T data, string tableName);
        //Task<StoringOder> InsertDataAsync(StoringOder data);
        Task<int> UpdateDataAsync<T>(T data, string tableName);
        //Task UpdateDataAsync(string guid, StoringOder data);
        Task<int> DeleteDataAsync(string guid, string tableName);
    }
}
