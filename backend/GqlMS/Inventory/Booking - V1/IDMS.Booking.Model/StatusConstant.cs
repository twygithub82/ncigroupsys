using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model
{
    public class StatusConstant
    {
        public static class BookingStatus
        {
            public const string CANCELED = "CANCELED";
            public const string DELETED = "DELETED";
            public const string NEW = "NEW";
        }

        public static class ROStatus
        {
            public const string CANCELED = "CANCELED";
            public const string DELETED = "DELETED";
            public const string PENDING = "PENDING";
            public const string PROCESSING = "PROCESSING";
            public const string COMPLETED = "COMPLETED";
        }

        public static class TankAction
        {
            public const string NEW = "NEW";
            public const string EDIT = "EDIT";
            public const string ROLLBACK = "ROLLBACK";
            public const string CANCEL = "CANCEL";
        }
    }
}
