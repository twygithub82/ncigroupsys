﻿using DWMS.DB.Interface;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;
using Org.BouncyCastle.Asn1.Ocsp;
using System.Data;

namespace MySQLWrapperController.Classes
{
    public class MySQLDatabaseService : DWMS.DB.Interface.iDatabase_v2
    {
        private readonly string _connectionString;
        public MySQLDatabaseService(IConfiguration configuration)
        {

            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        async Task<int> iDatabase_v2.ExecuteNonQueryCommand(string command)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new MySqlCommand(command, connection))
                    {
                        return await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
            catch
            {
                throw;
            }
        }

        async Task<int> iDatabase_v2.ExecuteNonQueryCommands(string[] commands)
        {
            int count = 0;
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    connection.Open();
                    var tnx = connection.BeginTransaction();

                    //await connection.OpenAsync();
                    foreach (var command in commands)
                    {
                        using (var cmd = new MySqlCommand(command, connection))
                        {
                            cmd.Transaction = tnx;
                            count += cmd.ExecuteNonQuery();
                            //return await cmd.ExecuteNonQueryAsync();
                        }
                    }
                    tnx.Commit();
                    return count;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
        }

        async Task<List<JToken>> iDatabase_v2.QueryData(string query)
        {
            try
            {
                using (var connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new MySqlCommand(query, connection))
                    {
                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            var result = new List<JToken>();
                            while (await reader.ReadAsync())
                            {
                                var row = new JObject();
                                for (var i = 0; i < reader.FieldCount; i++)
                                {
                                    row[reader.GetName(i)] = JToken.FromObject(reader.GetValue(i));
                                }
                                result.Add(row);
                            }
                            return result;
                        }
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
        }


        async Task<int> iDatabase_v2.RunStoredProcedure(string name, Parameter[] parameters)
        {
            try
            {
                var sqlParameters = parameters.Select(p => new MySqlParameter(p.Name, p.Value)).ToArray();
                using (var connection = new MySqlConnection(_connectionString))
                {
                    await connection.OpenAsync();
                    using (var cmd = new MySqlCommand(name, connection))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;

                        foreach (var parameter in sqlParameters)
                        {
                            cmd.Parameters.Add(parameter);
                        }

                        return await cmd.ExecuteNonQueryAsync();
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace);
                throw ex;
            }
        }
    }
}
