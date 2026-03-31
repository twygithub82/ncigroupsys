using Azure.Identity;
using IDMS.User.Authentication.Service.Models;
using MailKit.Net.Smtp;
using MailKit.Security;
using Microsoft.Graph;
using Microsoft.Graph.Models;
using Message = Microsoft.Graph.Models.Message;

namespace IDMS.User.Authentication.Service.Services
{
    public class EmailServiceDomain : IEmailService
    {
        private readonly EmailConfigurationDomain _emailConfig;
        private readonly GraphServiceClient _graphClient;
        private readonly string _from;

        public EmailServiceDomain(EmailConfigurationDomain emailConfiguration)
        {
            _emailConfig = emailConfiguration;

            _from = _emailConfig.UserName;
            var tenantId = _emailConfig.TenantID;
            var clientId = _emailConfig.ClientID;   
            var clientSecret = _emailConfig.ClientSecret;

            var credential = new ClientSecretCredential(tenantId, clientId, clientSecret);
            _graphClient = new GraphServiceClient(credential);
        }
        //void IEmailService.SendMail(Message message)
        //{
        //    var emailMessage = CreateEmailMessage(message);
        //    Send(emailMessage);
        //}

        //private MimeMessage CreateEmailMessage(Message message)
        //{
        //    var emailMessage = new MimeMessage();
        //    emailMessage.From.Add(new MailboxAddress("email", _emailConfig.from));
        //    emailMessage.To.AddRange(message.To);
        //    emailMessage.Subject = message.Subject;
        //    emailMessage.Body = new TextPart(TextFormat.Text) { Text = message.Content };

        //    return emailMessage;
        //}


        public async Task<bool> SendResetLinkAsync(string toEmail, string subject, string htmlBody)
        {
            try
            {
                var mail = new Message
                {
                    Subject = subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = htmlBody
                    },
                    ToRecipients = new List<Recipient>
                    {
                        new Recipient
                        {
                            EmailAddress = new EmailAddress
                            {
                                Address = toEmail
                            }
                        }
                    }
                };

                await _graphClient
                    .Users[_from]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = mail,
                        SaveToSentItems = true
                    });

                return true;
            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public async Task<bool> SendEmailWithZipAttachmentAsync(List<string> toEmails, string subject, string htmlBody, byte[] zipBytes, string zipFileName = "Documents.zip")
        {
            try
            {
                //var email = new MimeMessage();
                //email.From.Add(MailboxAddress.Parse(_emailConfig.from));

                //// Add multiple recipients
                //foreach (var toEmail in toEmails)
                //{
                //    if (!string.IsNullOrWhiteSpace(toEmail))
                //    {
                //        email.To.Add(MailboxAddress.Parse(toEmail.Trim()));
                //    }
                //}

                ////email.To.Add(MailboxAddress.Parse(toEmail));
                //email.Subject = subject;

                //var builder = new BodyBuilder
                //{
                //    HtmlBody = htmlBody
                //};

                //// Attach the ZIP file
                //builder.Attachments.Add(zipFileName, zipBytes, new ContentType("application", "zip"));



                ////string pdfFilePath = @"D:\Email\email.pdf";
                ////// Attach the PDF file
                ////builder.Attachments.Add(pdfFilePath, new ContentType("application", "pdf"));


                //email.Body = builder.ToMessageBody();

                //using var smtp = new SmtpClient();
                //await smtp.ConnectAsync(_emailConfig.SmtpServer, _emailConfig.Port, SecureSocketOptions.StartTls);
                //await smtp.AuthenticateAsync(_emailConfig.UserName, _emailConfig.Password);
                //await smtp.SendAsync(email);
                //await smtp.DisconnectAsync(true);

                //return true;

                var recipients = new List<Recipient>();

                foreach (var email in toEmails)
                {
                    if (!string.IsNullOrWhiteSpace(email))
                    {
                        recipients.Add(new Recipient
                        {
                            EmailAddress = new EmailAddress
                            {
                                Address = email.Trim()
                            }
                        });
                    }
                }

                var attachment = new FileAttachment
                {
                    OdataType = "#microsoft.graph.fileAttachment",
                    Name = zipFileName,
                    ContentType = "application/zip",
                    ContentBytes = zipBytes
                };

                var mail = new Message
                {
                    Subject = subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Html,
                        Content = htmlBody
                    },
                    ToRecipients = recipients,
                    Attachments = new List<Attachment>
                    {
                        attachment
                    }
                };

                await _graphClient
                    .Users[_from]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = mail,
                        SaveToSentItems = true
                    });

                return true;

            }
            catch (Exception ex)
            {
                throw;
            }
        }

        public void SendMail(Models.Message message)
        {
            // This method is intentionally left unimplemented to satisfy the IEmailService interface.
        }

        public async Task<bool> SendMailAsyn(Models.Message message)
        {
            try
            {
                // Convert your custom Message model into Graph Message
                var recipients = new List<Recipient>();

                foreach (var to in message.To)
                {
                    recipients.Add(new Recipient
                    {
                        EmailAddress = new EmailAddress
                        {
                            Address = to.Address
                        }
                    });
                }

                var mail = new Message
                {
                    Subject = message.Subject,
                    Body = new ItemBody
                    {
                        ContentType = BodyType.Text, // or Html if needed
                        Content = message.Content
                    },
                    ToRecipients = recipients
                };

                await _graphClient
                    .Users[_from]
                    .SendMail
                    .PostAsync(new Microsoft.Graph.Users.Item.SendMail.SendMailPostRequestBody
                    {
                        Message = mail,
                        SaveToSentItems = true
                    });

                return true;
            }
            catch
            {
                throw;
            }
        }
    }
}
