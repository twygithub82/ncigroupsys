using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.GqlTypes.LocaModel
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

        public static class TankMovementStatus
        {
            public const string CLEANING = "CLEANING";
            public const string INGATE = "IN_GATE";
            public const string INGATE_SURVEY = "IN_SURVEY";
            public const string OUTGATE = "OUT_GATE";
            public const string OUTGATE_SURVEY = "OUT_SURVEY";
            public const string RESIDUE = "RESIDUE";
            public const string REPAIR = "REPAIR";
            public const string STEAM = "STEAM";
            public const string STORAGE = "STORAGE";
            public const string RO = "RO_GENERATED";
        }
    }
}
