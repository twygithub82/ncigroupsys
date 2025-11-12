using Azure.Storage.Blobs;
using CommonUtil.Core.Service;
using IDMS.FileManagement.Interface;
using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using MailKit.Security;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.VisualBasic;
using MimeKit;
using Org.BouncyCastle.Cms;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Text.Json;
using System.Threading.Tasks;
using static Org.BouncyCastle.Math.EC.ECCurve;
using SmtpClient = MailKit.Net.Smtp.SmtpClient;

namespace IDMS.Email.Service
{
    public class EmailService : IEmail
    {
        BlobServiceClient _blobServiceClient;
        BlobContainerClient _blobImgContainerClient;
        BlobContainerClient _blobPdfContainerClient;

        readonly string azureConnectionString = "";
        readonly string dbConnectionString = "";
        //string rootImageContainerName = "images";
        //string rootPdfContainerName = "pdf";
        //string rootFileContainerName = "files";

        private AppDBContext _context;
        private readonly EmailConfiguration _emailConfig;
        private readonly IFileManagement _fileMangementService;
        private readonly IServiceScopeFactory _scopeFactory;

        public EmailService(IConfiguration config, AppDBContext context, EmailConfiguration emailConfig, IFileManagement fileMangementService, IServiceScopeFactory scopeFactory)
        {
            _context = context;
            //Setup Azure Connection 
            azureConnectionString = config.GetConnectionString("AzureConnection");
            _blobServiceClient = new BlobServiceClient(azureConnectionString);
            Console.WriteLine($"Azure blob storage connection: {azureConnectionString}");
            //Setup Db Connection
            dbConnectionString = config.GetConnectionString("LocalDbConnection");
            Console.WriteLine($"Database connection: {azureConnectionString}");
            _emailConfig = emailConfig;
            _fileMangementService = fileMangementService;
            _scopeFactory = scopeFactory;
        }

        public async Task<bool> SendEmailWithZipAttachmentAsync(List<string> toEmails, List<string?>? ccEmails, List<string?>? bccEmails,
            string subject, string htmlBody, byte[] zipBytes, string zipFileName)
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

                // Add multiple recipients
                if (ccEmails != null)
                {
                    foreach (var ccEmail in ccEmails)
                    {
                        if (!string.IsNullOrWhiteSpace(ccEmail))
                        {
                            email.Cc.Add(MailboxAddress.Parse(ccEmail.Trim()));
                        }
                    }
                }
   
                // Add multiple recipients
                if(bccEmails != null)
                {
                    foreach (var bccEmail in bccEmails)
                    {
                        if (!string.IsNullOrWhiteSpace(bccEmail))
                        {
                            email.Bcc.Add(MailboxAddress.Parse(bccEmail.Trim()));
                        }
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
                Console.WriteLine(ex.StackTrace.ToString());
                throw;
            }
        }


        public async Task<bool> ScheduleEirEmailTask(int type)
        {
            try
            {
                var emailJobs = await _context.email_job.Where(e => e.type == type && (e.status == 0 || e.status == 2) && e.attempt_count <= 3 && e.delete_dt == null).ToListAsync();
                if (emailJobs.Any())
                {
                    Task.Run(() => EirEmailThread(emailJobs));
                }
                await Task.Delay(200);
                return true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[Error] {ex.Message}");
                Console.WriteLine($"[StackTrace] {ex.StackTrace}");
                throw;
            }
        }

        public async Task<bool> InsertNewEmailJob(newEmailJobDto emailJob)
        {
            string user = "system";
            long currentDateTime = DateTime.Now.ToEpochTime();

            try
            {
                var newEmailJob = new email_job();
                newEmailJob.guid = Util.GenerateGUID();
                newEmailJob.create_by = user;
                newEmailJob.update_by = user;
                newEmailJob.create_dt = currentDateTime;
                newEmailJob.update_dt = currentDateTime;
                newEmailJob.eir_group_guid = emailJob.eir_group_guid;
                newEmailJob.tank_no = emailJob.tank_no;
                newEmailJob.status = 0;
                newEmailJob.attempt_count = 0;
                if (emailJob.type.EqualsIgnore("IN_GATE"))
                    newEmailJob.type = 1;
                else if (emailJob.type.EqualsIgnore("OUT_GATE"))
                    newEmailJob.type = 2;
                else
                    newEmailJob.type = 0;

                // Convert to JSON string
                newEmailJob.to_addresses = JsonSerializer.Serialize(emailJob.to_addresses) ?? "";
                if (emailJob.cc_addresses != null)
                    newEmailJob.cc_addresses = JsonSerializer.Serialize(emailJob.cc_addresses) ?? "";

                if (emailJob.bcc_addresses != null)
                    newEmailJob.bcc_addresses = JsonSerializer.Serialize(emailJob.bcc_addresses) ?? "";

                await _context.email_job.AddAsync(newEmailJob);
                var res = await _context.SaveChangesAsync();

                if (emailJob.type.EqualsIgnore("IN_GATE"))
                    Task.Run(() => EirEmailThread(new List<email_job>() { newEmailJob }));
                //Task.Run(() => InGateEmailThread(emailJob.eir_group_guid, emailJob.tank_no, newEmailJob.guid,
                //    emailJob.to_addresses, emailJob.cc_addresses, emailJob.bcc_addresses));

                await Task.Delay(300);
                return res > 0 ? true : false;
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.StackTrace.ToString());
                throw;
            }
        }

        private async void InGateEmailThread(string eirGroupGuid, string tankNumber, string emailJobGuid, List<string?> toAddress, List<string?>? ccAddress, List<string?>? bccAddress)
        {

            if (_fileMangementService != null)
            {
                try
                {
                    await using (var scope = _scopeFactory.CreateAsyncScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();

                        ZipFileRequest zipFileRequest = new ZipFileRequest();
                        zipFileRequest.GroupGuid = eirGroupGuid;
                        zipFileRequest.TankNo = tankNumber;

                        await using var zipStream = await _fileMangementService.GetZipBlobFolderAsync(zipFileRequest, dbContext);
                        // Convert directly to byte array
                        byte[]? zipBytes = zipStream.ToArray();

                        string subject = EirMessage.GetEirSubject_InGate(tankNumber);
                        string htmlBody = EirMessage.GetEirBody_InGate();

                        bool res = await SendEmailWithZipAttachmentAsync(toAddress, ccAddress, bccAddress, subject, htmlBody, zipBytes, $"{tankNumber}.zip");

                        if (res && await dbContext.email_job.FindAsync(emailJobGuid) is { } emailJob)
                        {
                            long epochNow = DateTime.Now.ToEpochTime();
                            emailJob.update_dt = epochNow;
                            emailJob.sent_dt = epochNow;
                            emailJob.status = 1;
                            emailJob.attempt_count = (emailJob.attempt_count ?? 0) + 1;
                            await dbContext.SaveChangesAsync();
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log exception or handle as needed
                    Console.WriteLine($"[BackgroundTaskError] {ex.Message}");
                    Console.WriteLine($"[StackTrace] {ex.StackTrace}");
                }
            }
        }

        private async void EirEmailThread(List<email_job>? emailJobs)
        {

            if (_fileMangementService != null)
            {
                try
                {
                    if (emailJobs == null || emailJobs.Count == 0) { return; }

                    await using (var scope = _scopeFactory.CreateAsyncScope())
                    {
                        var dbContext = scope.ServiceProvider.GetRequiredService<AppDBContext>();
                        var successfullySentJobs = new List<email_job>(); // track successful ones
                        var unsuccessfullSentJobs = new List<email_job>();

                        foreach (var emJob in emailJobs)
                        {
                            try
                            {
                                ZipFileRequest zipFileRequest = new ZipFileRequest();
                                zipFileRequest.GroupGuid = emJob.eir_group_guid;
                                zipFileRequest.TankNo = emJob.tank_no;

                                await using var zipStream = await _fileMangementService.GetZipBlobFolderAsync(zipFileRequest, dbContext);
                                // Convert directly to byte array
                                byte[]? zipBytes = zipStream.ToArray();

                                string subject = emJob.type == 2
                                    ? EirMessage.GetEirSubject_OutGate(emJob.tank_no)
                                    : EirMessage.GetEirSubject_InGate(emJob.tank_no);

                                string htmlBody = emJob.type == 2
                                    ? EirMessage.GetEirBody_OutGate()
                                    : EirMessage.GetEirBody_InGate();

                                var toAddress = JsonSerializer.Deserialize<List<string>>(emJob.to_addresses ?? "[]");
                                var ccAddress = JsonSerializer.Deserialize<List<string>>(emJob.cc_addresses ?? "[]");
                                var bccAddress = JsonSerializer.Deserialize<List<string>>(emJob.bcc_addresses ?? "[]");


                                bool sent = await SendEmailWithZipAttachmentAsync(toAddress, ccAddress, bccAddress, subject, htmlBody, zipBytes, $"{emJob.tank_no}.zip");
                                if (sent)
                                    successfullySentJobs.Add(emJob);
                                else
                                    unsuccessfullSentJobs.Add(emJob);

                                await Task.Delay(350);
                            }
                            catch (Exception ex)
                            {
                                Console.WriteLine($"[Error] Failed to send email for Job {emJob.guid}, Tank {emJob.tank_no}: {ex.Message}");
                                Console.WriteLine(ex.StackTrace);
                                unsuccessfullSentJobs.Add(emJob);
                            }
                        }

                        long epochNow = DateTime.Now.ToEpochTime();
                        if (successfullySentJobs.Any())
                        {
                            await dbContext.email_job
                                .Where(e => successfullySentJobs.Select(x => x.guid).Contains(e.guid))
                                .ExecuteUpdateAsync(s => s
                                    .SetProperty(e => e.update_dt, epochNow)
                                    .SetProperty(e => e.sent_dt, epochNow)
                                    .SetProperty(e => e.status, 1)
                                    .SetProperty(e => e.attempt_count, e => (e.attempt_count ?? 0) + 1)
                                );
                        }

                        if (unsuccessfullSentJobs.Any())
                        {
                            await dbContext.email_job
                                .Where(e => unsuccessfullSentJobs.Select(x => x.guid).Contains(e.guid))
                                .ExecuteUpdateAsync(s => s
                                    .SetProperty(e => e.update_dt, epochNow)
                                    .SetProperty(e => e.status, 2) // failure
                                    .SetProperty(e => e.attempt_count, e => (e.attempt_count ?? 0) + 1)
                                );
                        }
                    }
                }
                catch (Exception ex)
                {
                    // Log exception or handle as needed
                    Console.WriteLine($"[BackgroundTaskError] {ex.Message}");
                    Console.WriteLine($"[StackTrace] {ex.StackTrace}");
                }
            }
        }
    }
}
