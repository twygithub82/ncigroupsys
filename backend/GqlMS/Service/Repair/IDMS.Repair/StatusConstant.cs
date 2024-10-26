using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Repair.GqlTypes
{
    public class StatusConstant
    {
        public static class CurrentServiceStatus
        {
            public const string PENDING = "PENDING";
            public const string APPROVE = "APPROVE";
            public const string IN_PROGRESS = "JOB_IN_PROGRESS";
            public const string QC = "QC_COMPLETED";
            public const string BILL = "BILL_COMPLETED";
            public const string CANCEL = "CANCELED";
            public const string NO_ACTION = "NO_ACTION";
            public const string KIV = "KIV";
        }

        //public static class ResidueQuoteStatus
        //{
        //    public const string PENDING = "PENDING";
        //    public const string APPROVED = "APPROVED";
        //    public const string IN_PROGRESS = "JOB_IN_PROGRESS";
        //    public const string QC = "QC_COMPLETED";
        //    public const string BILL = "BILL_COMPLETED";
        //    public const string CANCEL = "CANCELED";
        //}

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
    }

    public enum CodeTyp
    {
        damage = 0,
        repair = 1
    }
}
