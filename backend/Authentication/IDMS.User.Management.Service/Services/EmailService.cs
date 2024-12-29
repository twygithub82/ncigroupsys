using IDMS.User.Authentication.Service.Models;
using MimeKit.Text;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MimeKit;
using MimeKit.Text;

namespace IDMS.User.Authentication.Service.Services
{
    public class EmailService:IEmailService
    {

        private readonly EmailConfiguration _emailConfig;

        public EmailService(EmailConfiguration emailConfiguration) => _emailConfig = emailConfiguration;
        void IEmailService.SendMail(Message message)
        {
            var emailMessage = CreateEmailMessage(message);
            Send(emailMessage);
        }

        private MimeMessage CreateEmailMessage(Message message)
        {
            var emailMessage = new MimeMessage();
            emailMessage.From.Add(new MailboxAddress("email", _emailConfig.from));
            emailMessage.To.AddRange(message.To);
            emailMessage.Subject = message.Subject;
            emailMessage.Body = new TextPart(TextFormat.Text) { Text = message.Content };

            return emailMessage;
        }

        private void Send(MimeMessage message)
        {
            var client = new MailKit.Net.Smtp.SmtpClient();
            try
            {

                client.Connect(_emailConfig.SmtpServer, _emailConfig.Port, true);
                client.AuthenticationMechanisms.Remove("XOAUTH2");
                client.Authenticate(_emailConfig.UserName, _emailConfig.Password);
                client.Send(message);
            }
            catch
            {
                throw;
            }
            finally
            {
                client.Dispose();
            }
        }
    }
}
