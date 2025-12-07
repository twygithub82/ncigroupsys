using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.User.Authentication.Service.Models
{
    public class EmailConfiguration
    {
        public string from { get; set; } = null!;
        public string SmtpServer { get; set; } = null!;

        public int Port { get; set; }

        public string UserName { get; set; } = null!;

        public string Password { get; set; } = null!;

        public string CompanyName { get; set; } = "IDMS Support Team";
    }

    public class EmailDto
    {
        public string tankNo {  get; set; }
        public string eirGroupGuid {  get; set; }

        [Required(ErrorMessage = "Recipient emails is required.")]
        public List<string> receipient {  get; set; }
    }
}
