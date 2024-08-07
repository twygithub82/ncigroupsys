using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Notification
{
    public class notification : Dates
    {
        [Key]
        public string? guid { get; set; }
        public int? id { get; set; }
        public string? title { get; set; }
        public string? message { get; set; }
        public long? date { get; set; }

        public bool? is_read { get; set; }

        public string? module_cv { get; set; }

        public string? notification_uid {  get; set; }
    }
}
