
using System.CodeDom;

namespace IDMS.Billing.GqlTypes
{
    public class ObjectAction
    {
        public const string NEW = "NEW";
        public const string EDIT = "EDIT";
        public const string CANCEL = "CANCEL";
        public const string OVERWRITE = "OVERWRITE";
    }

    public class StorageDetailState
    {
        public const string START = "START";
        public const string BILLING = "BILLING";
        public const string END = "END";
        public const string START_END = "START_END";     
    }

    public class BillingParty
    {
        public const string OWNER = "OWNER";
        public const string CUSTOMER = "CUSTOMER";
    }

    public class  BillingType: ProcessType
    {
        public const string L_OFF = "LIFT_OFF";
        public const string L_ON = "LIFT_ON";
        public const string G_IN = "GATE_IN";
        public const string G_OUT = "GATE_OUT";
    }

    public class ProcessType
    {
        public const string CLEANING = "CLEANING";
        public const string STEAMING = "STEAMING";
        public const string RESIDUE = "RESIDUE";
        public const string REPAIR = "REPAIR";
        public const string LOLO = "LOLO";
        public const string GATE = "GATE";
        public const string PREINSPECTION = "PREINSPECTION";
        public const string STORAGE = "STORAGE";
        public const string IN_OUT = "IN_OUT";

        public static List<string> ProcessList = new List<string> { $"{ProcessType.CLEANING}", $"{ProcessType.RESIDUE}", $"{ProcessType.GATE}",
                            $"{ProcessType.STEAMING}", $"{ProcessType.REPAIR}", $"{ProcessType.PREINSPECTION}", $"{ProcessType.LOLO}" };

        public static List<string> SalesList = new List<string> { $"{ProcessType.CLEANING}", $"{ProcessType.RESIDUE}", $"{ProcessType.IN_OUT}",
                            $"{ProcessType.STEAMING}", $"{ProcessType.REPAIR}", $"{ProcessType.PREINSPECTION}", $"{ProcessType.LOLO}", $"{ProcessType.STORAGE}"  };
    }

    public class ReportType
    {
        public const string IN = "IN";
        public const string OUT = "OUT";
        public const string ALL = "ALL";
        public const string CUSTOMER_WISE = "CUSTOMER";
        public const string CARGO_WISE = "CARGO";
        public const string UN_WISE = "UN";
    }

    public class ResultType
    {
        public const string appvResutlType = "appv";
        public const string completeResultType = "compl";
    }

    public class StatusCondition
    {
        public static List<string> BeforeEstimateApprove = new List<string> { "PENDING", "CANCELED", "NO_ACTION", "KIV" };
        public static List<string> Cancelled = new List<string> { "CANCELED", "NO_ACTION" };
        public static List<string> BeforeTankIn = new List<string> { "SO_GENERATED", "IN_GATE" }; //"IN_SURVEY" };
        public static List<string> NotInYard = new List<string> { "RELEASED" }; //"OUT_GATE", "OUT_SURVEY" };
        public static List<string> InYard = new List<string> { "IN_SURVEY", "STEAM", "RESIDUE", "CLEANING", "REPAIR", "STORAGE", "RO_GENERATED" };
        public static List<string> CompletedStatus = new List<string> { "COMPLETED", "QC_COMPLETED" };
    }

    public class AvailableYard
    {
        public static List<string> YardList = new List<string> { "YARD_1", "YARD_2" };
    }
}
