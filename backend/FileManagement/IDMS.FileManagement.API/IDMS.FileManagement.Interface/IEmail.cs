using IDMS.FileManagement.Interface.DB;
using IDMS.FileManagement.Interface.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface
{
    public interface IEmail
    {
        Task<bool> SendEmailWithZipAttachmentAsync(List<string> toEmail, List<string?>? ccEmails, List<string?>? bccEmails, string subject, string htmlBody, byte[] zipBytes, string zipFileName);

        Task<bool> InsertNewEmailJob(newEmailJobDto emailJob);

        Task<bool> ScheduleEirEmailTask(int type);
    }
}
