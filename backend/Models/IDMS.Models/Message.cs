using HotChocolate.Types;
using HotChocolate;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices.JavaScript;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Message
    {
        public string event_id { get; set; } = "";
        public string event_name { get; set; } = "";

        public long event_dt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        public long count { get; set; } = 0;

     
    }

    public class Message_r1
    {
        public string event_id { get; set; } = "";
        public string event_name { get; set; } = "";

        public string topic { get; set; } = "";

        public long event_dt { get; set; } = DateTimeOffset.UtcNow.ToUnixTimeSeconds();

        public long count { get; set; } = 0;

        // Use System.Text.Json for serialization
        [GraphQLType(typeof(AnyType))] // This makes it show in GraphQL schema
        public JsonElement? payload { get; set; }


    }
}
