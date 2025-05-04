using IDMS.User.Authentication.Service.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.User.Authentication.Service.Services
{
    public interface IEmailService
    {
        void SendMail(Message message);
        void SendEmailAsync(string toEmail, string subject, string htmlBody);

    }
}
