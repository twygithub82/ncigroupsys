using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
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
}
