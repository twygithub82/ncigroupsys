﻿using Asp.Versioning;
using DWMS.DB.Interface;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MySql.Data.MySqlClient;
using Newtonsoft.Json.Linq;

namespace MySQLWrapperController.Controllers
{
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
     [ApiVersion("1.0")]
    public class DatabaseController : ControllerBase
    {
        private readonly iDatabase_v2 _database;

        public DatabaseController(iDatabase_v2 database)
        {
            _database = database;
        }

        [HttpPost("ExecuteNonQuery")]
        public async Task<IActionResult> ExecuteNonQuery([FromBody] string command)
        {
            var result = await _database.ExecuteNonQueryCommand(command);
            dynamic rlt = new JObject();

            rlt.result = JToken.FromObject(result);
            return Ok(rlt.ToString());
        }

        [HttpPost("ExecuteNonQueries")]
        public async Task<IActionResult> ExecuteNonQueries([FromBody] string[] commands)
        {
            
            
            var result = await _database.ExecuteNonQueryCommands(commands);
            dynamic rlt = new JObject();

            rlt.result = JToken.FromObject(result);
            return Ok(rlt.ToString());
        }

        [HttpGet("QueryData")]
        public async Task<IActionResult> QueryData([FromQuery] string query)
        {
            var result = await _database.QueryData(query);
            dynamic rlt = new JObject();
            
            rlt.result = JToken.FromObject(result);
            return Ok(rlt.ToString());
        }

        [HttpPost("QueryData")]
        public async Task<IActionResult> QueryData_Post([FromBody] string query)
        {
            var result = await _database.QueryData(query);
            dynamic rlt = new JObject();

            rlt.result = JToken.FromObject(result);
            return Ok(rlt.ToString());
        }

        [HttpPost("RunStoredProcedure")]
        public async Task<IActionResult> RunStoredProcedure([FromBody] StoredProcedureRequest request)
        {
            
            var result = await _database.RunStoredProcedure(request.Name, request.Parameters);
            dynamic rlt = new JObject();

            rlt.result = JToken.FromObject(result);
            return Ok(rlt.ToString());
        }
    }


    public class StoredProcedureRequest
    {
        public string Name { get; set; }
        public Parameter[] Parameters { get; set; }
    }

  
}
