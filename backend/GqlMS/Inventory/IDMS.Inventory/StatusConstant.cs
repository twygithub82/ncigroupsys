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

        public static List<string> validTankStatus = new List<string>() { STEAM, CLEANING, REPAIR, STORAGE };
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

    public static class CurrentServiceStatus
    {
        public const string PENDING = "PENDING";
        public const string APPROVED = "APPROVED";
        public const string QC = "QC_COMPLETED";
        public const string BILL = "BILL_COMPLETED";
        public const string CANCELED = "CANCELED";
        public const string NO_ACTION = "NO_ACTION";
        public const string KIV = "KIV";
        public const string COMPLETED = "COMPLETED";
        public const string JOB_IN_PROGRESS = "JOB_IN_PROGRESS";
        public const string PARTIAL = "PARTIAL_ASSIGNED";
        public const string ASSIGNED = "ASSIGNED";
    }

    public static class PurposeType
    {
        public const string CLEAN = "CLEANING";
        public const string STEAM = "STEAMING";
        public const string REPAIR = "REPAIR";
        public const string RESIDUE = "RESIDUE";
        public const string STORAGE = "STORAGE";

    }

    public static class PurposeAction
    {
        public const string ADD = "ADD";
        public const string REMOVE = "REMOVE";

    }
}
