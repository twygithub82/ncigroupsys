using CommonUtil.Core.Service;
//using IDMS.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc.Diagnostics;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Package.Depot
{
    internal class GqlUtils
    {
        public static string GenerateSqlUpdate(JToken jToken, string tableName)
        {
            // Extract SET fields and values
            var setFields = new List<string>();
            JToken setToken = jToken["set"];
            if (setToken != null)
            {
                foreach (JProperty property in setToken.Children<JProperty>())
                {
                    string setClause = $"{property.Name} = {FormatValue(property.Value)}";
                    setFields.Add(setClause);
                }
            }
            else
            {
                throw new ArgumentException("No fields specified for SET clause.");
            }

            // Extract WHERE conditions
            var whereConditions = new List<string>();
            JToken whereToken = jToken["where"];
            if (whereToken != null)
            {
                foreach (JProperty property in whereToken.Children<JProperty>())
                {
                    string condition = $"{property.Name} = {FormatValue(property.Value)}";
                    whereConditions.Add(condition);
                }
            }
            else
            {
                throw new ArgumentException("No conditions specified for WHERE clause.");
            }

            // Format SQL UPDATE statement
            string setClauseJoined = string.Join(", ", setFields);
            string whereClause = string.Join(" AND ", whereConditions);

            string sqlUpdate = $"UPDATE {tableName} SET {setClauseJoined} WHERE {whereClause};";
            return sqlUpdate;
        }

        public static string GenerateSqlInsert(JToken jToken, string tableName)
        {
            var columns = new List<string>();
            var values = new List<string>();

            foreach (JProperty property in jToken.Children<JProperty>())
            {
                columns.Add(property.Name);
                values.Add(FormatValue(property.Value));
            }

            string columnsJoined = string.Join(", ", columns);
            string valuesJoined = string.Join(", ", values);

            string sqlInsert = $"INSERT INTO {tableName} ({columnsJoined}) VALUES ({valuesJoined});";
            return sqlInsert;
        }

        public static string FormatValue(JToken value)
        {
            // Check value type and format accordingly
            return value.Type switch
            {
                JTokenType.String => $"'{value.ToString().Replace("'", "''")}'", // Handle single quotes in strings
                JTokenType.Integer => value.ToString(),
                JTokenType.Float => value.ToString(),
                JTokenType.Boolean => value.ToString().ToLower(), // SQL typically uses 'true'/'false'
                JTokenType.Date => $"'{((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss")}'",
                _ => throw new NotSupportedException($"Unsupported JTokenType: {value.Type}")
            };
        }

        public static string GenerateSqlSelect(JToken jToken, string tableName)
        {
            // Extract SELECT columns
            var selectColumns = jToken["select"]?.ToObject<List<string>>();
            if (selectColumns == null || selectColumns.Count == 0)
            {
                throw new ArgumentException("No columns specified for SELECT statement.");
            }

            // Extract WHERE conditions
            var whereConditions = new List<string>();
            JToken whereToken = jToken["where"];
            if (whereToken != null)
            {
                foreach (JProperty property in whereToken.Children<JProperty>())
                {
                    string condition = FormatCondition(property);
                    if (!string.IsNullOrEmpty(condition))
                    {
                        whereConditions.Add(condition);
                    }
                }
            }

            // Extract ORDER BY, OFFSET, and LIMIT
            string orderBy = jToken["orderBy"]?.ToString();
            int? offset = jToken["offset"]?.ToObject<int>();
            int? limit = jToken["limit"]?.ToObject<int>();

            // Format SQL SELECT statement
            string selectColumnsJoined = string.Join(", ", selectColumns);
            string whereClause = whereConditions.Count > 0 ? $"WHERE {string.Join(" AND ", whereConditions)}" : "";
            string orderByClause = !string.IsNullOrEmpty(orderBy) ? $"ORDER BY {orderBy}" : "";
            string limitOffsetClause = (limit.HasValue && offset.HasValue) ? $"LIMIT {limit.Value} OFFSET {offset.Value}" :
                                        (limit.HasValue) ? $"LIMIT {limit.Value}" :
                                        (offset.HasValue) ? $"LIMIT 18446744073709551615 OFFSET {offset.Value}" : ""; // Max value for LIMIT in MySQL

            string sqlSelect = $"SELECT {selectColumnsJoined} FROM {tableName} {whereClause} {orderByClause} {limitOffsetClause};";
            return sqlSelect;
        }

        public static string FormatCondition(JProperty property)
        {
            string columnName = property.Name;
            JToken value = property.Value;

            if (value.Type == JTokenType.String)
            {
                if (columnName == "delete_dt")
                {
                    return $"{columnName} {value}";
                }
                else
                {
                    return $"{columnName} like '%{EscapeSql(value.ToString())}%'";
                }
            }
            else if (value.Type == JTokenType.Integer || value.Type == JTokenType.Float)
            {
                return $"{columnName} = {value}";
            }
            else if (value.Type == JTokenType.Boolean)
            {
                return $"{columnName} = {(value.ToObject<bool>() ? 1 : 0)}";
            }
            else if (value.Type == JTokenType.Date)
            {
                return $"{columnName} = '{EscapeSql(((DateTime)value).ToString("yyyy-MM-dd HH:mm:ss"))}'";
            }
            else
            {
                return "";
               // throw new ArgumentException($"Unsupported value type for column '{columnName}'");
            }
        }

        public static string EscapeSql(string value)
        {
            // Simple SQL escape function, replace single quote with two single quotes
            return value.Replace("'", "''");
        }

        public static long GetNowEpochInSec()
        {
            DateTimeOffset now = DateTimeOffset.UtcNow;

            // Get the epoch time
            return now.ToUnixTimeSeconds();
        }


        public static async Task<JToken> RunNonQueryCommands([Service] IConfiguration config, List<string> commands)
        {
            JToken data = null;
            try
            {

                string urlApi_querydata = $"{config["DBService:NonQueriesUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(commands);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);

                }
                else
                {
                    throw new GraphQLException(new Error("Run NonQuery Command", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }

        public static async Task<JToken> RunNonQueryCommand([Service] IConfiguration config, string command)
        {
            JToken data = null;
            try
            {

                string urlApi_querydata = $"{config["DBService:NonQueryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(command);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);

                }
                else
                {
                    throw new GraphQLException(new Error("Run NonQuery Command", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }

        public static async Task<JToken> QueryData([Service] IConfiguration config, string querystatement)
        {
            JToken data = null;
            try
            {
                string urlApi_querydata = $"{config["DBService:queryUrl"]}";
                string sqlStatement = JsonConvert.SerializeObject(querystatement);
                var (status, result) = await Util.RestCallAsync(urlApi_querydata, HttpMethod.Post, sqlStatement);
                if (status == HttpStatusCode.OK)
                {
                    var resultContent = $"{result}";
                    data = JObject.Parse(resultContent);
                    
                }
                else
                {
                    throw new GraphQLException(new Error("Fail to query the cleaning step data", status.ToString()));
                }
            }
            catch
            {
                throw;
            }
            return data;
        }
        public static string IsAuthorize([Service] IConfiguration config, [Service] IHttpContextAccessor httpContextAccessor)
        {
            string uid = "";
            try
            {
                var isCheckAuthorization =Convert.ToBoolean(config["JWT:CheckAuthorization"]);
                if (!isCheckAuthorization) return "anonymous user";

                var authUser = httpContextAccessor.HttpContext.User;
                var primarygroupSid = authUser.FindFirstValue(ClaimTypes.GroupSid);
                uid = authUser.FindFirstValue(ClaimTypes.Name);
                if (primarygroupSid != "s1")
                {
                    throw new GraphQLException(new Error("Unauthorized", "401"));
                }
                
            }
            catch
            {
                throw;
            }
            return uid;
        }
    }
}
