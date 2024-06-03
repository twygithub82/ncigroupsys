using Newtonsoft.Json.Linq;

namespace DWMS.DB.Interface
{
    public interface iDatabase
    {
        Task <(bool, string)> Connect();
        Task <(bool, string)> Connect(string connString);
        Task <bool> Disconnect();
        void Dispose();
        Task <int> ExecuteCommand(Operation commandType, string command);
        Task <int> OpenCloseExecuteCommand(Operation commandType, string command);
        Task <JToken> QueryData(string query);
        Task <JToken> OpenCloseQueryData(string query);
        void RunStoredProcedure(string name, object[] parameters);

        public enum Operation
        {
            CREATE = 1,
            READ = 2,
            UPDATE = 3,
            DELETE = 4,
        }
    }
}
