using Newtonsoft.Json.Linq;

namespace DWMS.DB.Interface
{
    public interface iDatabase
    {
        (bool, string) Connect();
        (bool, string) Connect(string connString);
        void Disconnect();
        void Dispose();
        int ExecuteCommand(string command);
        JToken QueryData(string query);
        void RunStoredProcedure(string name, object[] parameters);


    }
}
