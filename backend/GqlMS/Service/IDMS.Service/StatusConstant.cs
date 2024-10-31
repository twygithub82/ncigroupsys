
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
    }

    public static class JobStatus
    {
        public const string IN_PROGRESS = "JOB_IN_PROGRESS";
        public const string PENDING = "PENDING";
        public const string COMPLETE = "COMPLETE";
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
    }

    public static class JobType
    {
        public const string REPAIR = "REPAIR";
        public const string CLEANING = "CLEANING";
        public const string RESIDUE = "RESIDUE";
        public const string STEAM = "STEAM";
    }

}
