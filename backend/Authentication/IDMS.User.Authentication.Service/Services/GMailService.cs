using IDMS.User.Authentication.Service.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using MimeKit;
using System.Threading.Tasks;

namespace IDMS.User.Authentication.Service.Services
{
    class GMailService : IEmailService
    {
        private readonly string _fromEmail = "weaiyep2002@gmail.com";
        private readonly string _appPassword = "appq mofh skmp pkqn"; // from Google App Passwords
       

        public async void SendEmailAsync(string toEmail, string subject, string htmlBody)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_fromEmail));
            email.To.Add(MailboxAddress.Parse(toEmail));
            email.Subject = subject;

            var builder = new BodyBuilder
            {
                HtmlBody = htmlBody
            };

            email.Body = builder.ToMessageBody();

            using var smtp = new SmtpClient();
            await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_fromEmail, _appPassword);
            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }

        public void SendMail(Message message)
        {
           // throw new NotImplementedException();
        }
    }
}
