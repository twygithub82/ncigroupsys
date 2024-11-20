using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes
{
    public static class EirStatus
    {
        public const string YET_TO_SURVEY = "YET_TO_SURVEY";
        public const string PENDING = "PENDING";
        public const string PUBLISHED = "PUBLISHED";
        public const string CANCELED = "CANCELED";
    }

    public static class SOStatus
    {
        public const string COMPLETED = "COMPLETED";
        public const string PENDING = "PENDING";
        public const string PROCESSING = "PROCESSING";
        public const string CANCELED = "CANCELED";
    }

    public static class SOTankStatus
    {
        public const string CANCELED = "CANCELED";
        public const string WAITING = "WAITING";
        public const string ACCEPTED = "ACCEPTED";
        public const string PREORDER = "PREORDER";
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
        public const string SO = "SO_GENERATED";
    }

    public static class SOTankAction
    {
        public const string NEW = "NEW";
        public const string EDIT = "EDIT";
        public const string ROLLBACK = "ROLLBACK";
        public const string CANCEL = "CANCEL";
        public const string PREORDER = "PREORDER";
    }


    public static class ROStatus
    {
        public const string CANCELED = "CANCELED";
        public const string DELETED = "DELETED";
        public const string PENDING = "PENDING";
        public const string PROCESSING = "PROCESSING";
        public const string COMPLETED = "COMPLETED";
    }

    public static class BookingStatus
    {
        public const string CANCELED = "CANCELED";
        public const string DELETED = "DELETED";
        public const string NEW = "NEW";
    }

    public static class CurrentProcessStatus
    {
        public const string APPROVED = "APPROVED";
    }
}
