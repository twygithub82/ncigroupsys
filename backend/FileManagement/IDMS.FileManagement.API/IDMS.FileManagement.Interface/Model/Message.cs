using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.FileManagement.Interface.Model
{
    public class Message
    {
        public List<MailboxAddress> To { get; set; }

        public string Subject { get; set; }

        public string Content { get; set; }

        public Message(IEnumerable<string> to, string subject, string content)
        {
            To = new List<MailboxAddress>();
            To.AddRange(to.Select(x => new MailboxAddress("email", x)));
            Subject = subject;
            Content = content;
        }
    }

    public static class EirMessage
    {
        /// <summary>
        /// Gets the subject for EIR email, inserting the tank number.
        /// </summary>
        public static string GetEirSubject_InGate(string tankNumber)
        {
            return $"EIR IN_{tankNumber}";
        }

        /// <summary>
        /// Gets the subject for EIR email, inserting the tank number.
        /// </summary>
        public static string GetEirSubject_OutGate(string tankNumber)
        {
            return $"EIR OUT_{tankNumber}";
        }

        public static string GetResidueSubject(string tankNumber)
        {
            return $"Residue Estimate_{tankNumber}";
        }

        public static string GetRepairSubject(string tankNumber)
        {
            return $"Repair Estimate_{tankNumber}";
        }

        public static string GetDefaultSubject(string tankNumber)
        {
            return $"Estimate_{tankNumber}";
        }

        public static string GetTankActivitySubject(string customerName)
        {
            return $"Tank Activity Report";
        }

        /// <summary>
        /// Gets the standard EIR email body message.
        /// </summary>
        public static string GetEirBody_InGate()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached EIR IN for your reference.</p>
                 <p>Thank you!</p>");
        }

        /// <summary>
        /// Gets the standard EIR email body message.
        /// </summary>
        public static string GetEirBody_OutGate()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached EIR OUT for your reference.</p>
                 <p>Thank you!</p>");
        }

        public static string GetDefaultBody()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached Estimate for your reference.</p>
                 <p>Thank you!</p>");
        }

        public static string GetResidueBody()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached Residue Disposal Estimate for your reference.</p>
                 <p>Thank you!</p>");
        }

        public static string GetRepairBody()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached Repair Estimate for your reference.</p>
                 <p>Thank you!</p>");
        }

        public static string GetTankActivityBody()
        {
            return BuildEmailBody(@"<p>Dear All,</p>
                 <p>Please find attached Tank Activity Report for your reference.</p>
                 <p>Thank you!</p>");
        }


        private const string EmailDisclaimer = @"
            <p style='font-size: 10px; color: #666666; margin-top: 20px;'>
                Please note that this email is sent on behalf of the depot from a no-reply email address.<br />
                Should you have any questions or require further assistance, please contact the depot directly.<br />
                Kindly note that any replies to this email will not be monitored or forwarded to the depot.
            </p>";

        private static string BuildEmailBody(string body)
        {
            return body + EmailDisclaimer;
        }
    }
}
