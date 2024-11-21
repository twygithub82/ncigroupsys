
namespace IDMS.Service.GqlTypes
{
    //public class StatusConstant
    //{
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
    }

    public static class JobStatus
    {
        public const string IN_PROGRESS = "JOB_IN_PROGRESS";
        public const string PENDING = "PENDING";
        public const string COMPLETED = "COMPLETED";
    }

    public static class ObjectAction
    {
        public const string NEW = "NEW";
        public const string EDIT = "EDIT";
        public const string ROLLBACK = "ROLLBACK";
        public const string CANCEL = "CANCEL";
        public const string KIV = "KIV";
        public const string APPROVE = "APPROVE";
        public const string NA = "NA";
        public const string COMPLETE = "COMPLETE";
        public const string IN_PROGRESS = "IN_PROGRESS";
    }

    public static class JobType
    {
        public const string REPAIR = "REPAIR";
        public const string CLEANING = "CLEANING";
        public const string RESIDUE = "RESIDUE";
        public const string STEAM = "STEAM";
    }

    public static class JobNotificationType
    {
        public const int START_JOB = 1;
        public const int STOP_JOB = 2;
        public const int COMPLETE_JOB = 3;
        public const int COMPLETE_ITEM = 4;
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
