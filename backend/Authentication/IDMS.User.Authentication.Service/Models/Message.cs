using MimeKit;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.User.Authentication.Service.Models
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
            return $"EIR IN_Tank no: {tankNumber}_Photos";
        }

        /// <summary>
        /// Gets the subject for EIR email, inserting the tank number.
        /// </summary>
        public static string GetEirSubject_OutGate(string tankNumber)
        {
            return $"EIR OUT_Tank no: {tankNumber}_Photos";
        }

        /// <summary>
        /// Gets the standard EIR email body message.
        /// </summary>
        public static string GetEirBody_InGate()
        {
            return @"<p>Dear All,</p>
                 <p>Please find attached EIR IN for your reference.</p>
                 <p>Thank you!</p>";
        }

        /// <summary>
        /// Gets the standard EIR email body message.
        /// </summary>
        public static string GetEirBody_OutGate()
        {
            return @"<p>Dear All,</p>
                 <p>Please find attached EIR OUT for your reference.</p>
                 <p>Thank you!</p>";
        }
    }
}
