
using DWMS.DB.Interface;
using Newtonsoft.Json.Linq;
namespace DWMS.DB.Implementation
{
    public class MySQLWrapper : iDatabase
    {
        void iDatabase.Connect()
        {
            throw new NotImplementedException();
        }

        void iDatabase.Disconnect()
        {
            throw new NotImplementedException();
        }

        void iDatabase.Dispose()
        {
            throw new NotImplementedException();
        }

        int iDatabase.ExecuteCommand(string command)
        {
            throw new NotImplementedException();
        }

        JToken iDatabase.QueryData(string query)
        {
            throw new NotImplementedException();
        }

        void iDatabase.RunStoredProcedure(string name, object[] parameters)
        {
            throw new NotImplementedException();
        }
    }
}
