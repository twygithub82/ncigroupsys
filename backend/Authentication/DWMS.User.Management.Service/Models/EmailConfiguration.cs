using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DWMS.User.Authentication.Service.Models
{
    public class EmailConfiguration
    {
        public string from { get; set; } = null!;
        public string SmtpServer { get; set; } = null!;

        public int Port { get; set; }

        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;
    }
}
