using IDMS.User.Authentication.Service.Models;
using MimeKit.Text;
using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MailKit.Security;
using MailKit.Net.Smtp;

namespace IDMS.User.Authentication.Service.Services
{
    public class EmailService : IEmailService
    {
        private readonly string _fromEmail = "weaiyep2002@gmail.com";
        private readonly string _appPassword = "appq mofh skmp pkqn"; // from Google App Passwords
        private readonly EmailConfiguration _emailConfig;

        public EmailService(EmailConfiguration emailConfiguration)
        {
            _emailConfig = emailConfiguration;
        }
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

        public async Task<bool> SendResetLinkAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_emailConfig.from));
                email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };

                email.Body = builder.ToMessageBody();

                //using var smtp = new SmtpClient();
                //await smtp.ConnectAsync("smtp.gmail.com", 587, SecureSocketOptions.StartTls);
                //await smtp.AuthenticateAsync(_fromEmail, _appPassword);
                //await smtp.SendAsync(email);
                //await smtp.DisconnectAsync(true);


                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<bool> SendEmailWithZipAttachmentAsync(List<string> toEmails, string subject, string htmlBody, byte[] zipBytes, string zipFileName = "Documents.zip")
        {
            try
            {
                var email = new MimeMessage();
                email.From.Add(MailboxAddress.Parse(_emailConfig.from));

                // Add multiple recipients
                foreach (var toEmail in toEmails)
                {
                    if (!string.IsNullOrWhiteSpace(toEmail))
                    {
                        email.To.Add(MailboxAddress.Parse(toEmail.Trim()));
                    }
                }

                //email.To.Add(MailboxAddress.Parse(toEmail));
                email.Subject = subject;

                var builder = new BodyBuilder
                {
                    HtmlBody = htmlBody
                };

                // Attach the ZIP file
                builder.Attachments.Add(zipFileName, zipBytes, new ContentType("application", "zip"));



                //string pdfFilePath = @"D:\Email\email.pdf";
                //// Attach the PDF file
                //builder.Attachments.Add(pdfFilePath, new ContentType("application", "pdf"));


                email.Body = builder.ToMessageBody();

                using var smtp = new SmtpClient();
                await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls);
                await smtp.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
                await smtp.SendAsync(email);
                await smtp.DisconnectAsync(true);

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

    }
}
