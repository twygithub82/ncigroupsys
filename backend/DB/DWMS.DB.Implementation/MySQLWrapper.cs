
using DWMS.DB.Interface;
using Newtonsoft.Json.Linq;
using MySql.Data.MySqlClient;

namespace DWMS.DB.Implementation
{
    public class MySQLWrapper : iDatabase
    {
        MySqlConnection conn;

        public (bool, string) Connect()
        {
            string myConnectionString;
            myConnectionString = "server=127.0.0.1;uid=root;pwd=P@ssw0rd;database=dwms";

            try
            {
                conn = new MySqlConnection();
                conn.ConnectionString = myConnectionString;
                conn.Open();
                return (true, "Database Connected");
            }
            catch (MySqlException ex)
            {
                string errMsg = ex.Message;
                switch (ex.Number)
                {
                    case 0:
                        errMsg = ("Cannot connect to server.  Contact administrator");
                        break;
                    case 1045:
                        errMsg = ("Invalid username/password, please try again");
                        break;
                }
                return (false, ex.Message);
            }

        }

        public (bool, string) Connect(string connString)
        {
            try
            {
                conn = new MySqlConnection(connString);
                conn.Open();
                return (true, "Database Connected");
            }
            catch (MySqlException ex)
            {
                string errMsg = ex.Message;
                switch (ex.Number)
                {
                    case 0:
                        errMsg = ("Cannot connect to server.  Contact administrator");
                        break;
                    case 1045:
                        errMsg = ("Invalid username/password, please try again");
                        break;
                }
                return (false, ex.Message); ;
            }
        }

        public void Disconnect()
        {
            conn?.Close();
        }

        public void Dispose()
        {
            throw new NotImplementedException();
        }

        public int ExecuteCommand(string command)
        {
            throw new NotImplementedException();
        }

        public JToken QueryData(string query)
        {
            throw new NotImplementedException();
        }

        public void RunStoredProcedure(string name, object[] parameters)
        {
            throw new NotImplementedException();
        }
    }
}
