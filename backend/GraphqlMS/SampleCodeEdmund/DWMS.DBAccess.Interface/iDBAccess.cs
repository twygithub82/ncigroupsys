using DWMS.Cleaning.Model;

namespace DWMS.DBAccess.Interface
{
    public interface IDBAccess
    {
        Task<IEnumerable<Person>> GetAllDataAsync();
        Task<Person> GetDataByIdAsync(int id);
        Task<Person> InsertDataAsync(Person data);
        Task UpdateDataAsync(int id, Person data);
        Task DeleteDataAsync(int id);
    }
}
