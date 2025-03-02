
namespace IDMS.Billing.GqlTypes
{
    public class ObjectAction
    {
        public const string NEW = "NEW";
        public const string EDIT = "EDIT";
        public const string CANCEL = "CANCEL";
    }

    public class BillingParty
    {
        public const string OWNER = "OWNER";
        public const string CUSTOMER = "CUSTOMER";
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
}
