
using DWMS.DB.Interface;
using Newtonsoft.Json.Linq;
using MySql.Data.MySqlClient;
using static DWMS.DB.Interface.iDatabase;
using MySqlX.XDevAPI.Common;

namespace DWMS.DB.Implementation
{
    public class MySQLWrapper : iDatabase
    {
        MySqlConnection? conn;
        string connString = "";

        public MySQLWrapper()
        {
            connString = "server=127.0.0.1;uid=root;pwd=P@ssw0rd;database=dwms";
        }

        public async Task<(bool, string)> Connect()
        {
            //string myConnectionString;
            //myConnectionString = connString;

            try
            {
                //connString
                conn = new MySqlConnection();
                conn.ConnectionString = connString;
                await conn.OpenAsync();
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

        public async Task<(bool, string)> Connect(string connString)
        {
            try
            {
                this.connString = connString;
                conn = new MySqlConnection(connString);
                await conn.OpenAsync();
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

        public async Task<bool> Disconnect()
        {
            try
            {
                await conn?.CloseAsync();
                return true;
            }
            catch(MySqlException ex)
            {
                return false;
            }
        }

        public void Dispose()
        {
            conn?.Close();
            conn?.Dispose();
        }

        public async Task<int> ExecuteCommand(Operation cmdType, string command)
        {
            try
            {
                int val= 0;
                MySqlCommand cmd = new MySqlCommand(command, conn);
                if (cmdType.Equals(Operation.CREATE) || cmdType.Equals(Operation.UPDATE) || cmdType.Equals(Operation.DELETE))
                     val = await cmd.ExecuteNonQueryAsync();
                else
                {
                    var result = await cmd.ExecuteScalarAsync();
                    if (result != null)
                    {
                        val = Convert.ToInt32(result);
                    }
                }

                return val;    
            }
            catch (MySqlException ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<int> OpenCloseExecuteCommand(Operation commandType, string command)
        {
            if (!IsConnected())
            {
                (var ret, var msg) = await Connect(connString);
                if (!ret)
                {
                    throw new Exception(msg);
                }
            }

            try
            {
                int res = await ExecuteCommand(commandType, command);
                await Disconnect();
                return res;
            }
            catch (MySqlException ex) 
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<JToken> QueryData(string query)
        {
            try
            {
                using (MySqlCommand cmd = new MySqlCommand(query, conn))
                {
                    //to query the database. Results are usually returned in a MySqlDataReader object, created by ExecuteReader.
                    using (MySqlDataReader rdr = (MySqlDataReader) await cmd.ExecuteReaderAsync())
                    {
                        List<Dictionary<string, object>> rows = new List<Dictionary<string, object>>();
                        while (await rdr.ReadAsync())
                        {
                            Dictionary<string, object> row = new Dictionary<string, object>();
                            for (int i = 0; i < rdr.FieldCount; i++)
                            {
                                row[rdr.GetName(i)] = rdr[i];
                            }
                            rows.Add(row);
                        }
                        JToken result = JToken.FromObject(rows);
                        Console.WriteLine(result.ToString());
                        return JToken.FromObject(rows);
                    }
                }
            }
            catch (MySqlException ex)
            {
                throw new Exception(ex.Message);
            }
        }

        public async Task<JToken> OpenCloseQueryData(string query)
        {
            if (!IsConnected())
            {
                (var ret, var msg) = await Connect(connString);
                if (!ret)
                {
                    throw new Exception(msg);
                }
            }

            try
            {
                JToken result = await QueryData(query);
                await Disconnect();
                return result;

            }
            catch(MySqlException ex)
            {
                throw new Exception(ex.Message);

            }
        }

        public void RunStoredProcedure(string name, object[] parameters)
        {
            throw new NotImplementedException();
        }

        private bool IsConnected()
        {
            if (conn != null && conn.State == System.Data.ConnectionState.Open)
                return true;

            return false;

        }
    }
}
