using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.EstimateTemplate.GqlTypes.LocalModel
{
    public class StatusConstant
    {
        public static class TemplateType
        {
            public const string GENERAL = "GENERAL";
            public const string EXCLUSIVE = "EXCLUSIVE";

        }

        public static class ObjectAction
        {
            public const string NEW = "NEW";
            public const string EDIT = "EDIT";
            public const string ROLLBACK = "ROLLBACK";
            public const string CANCEL = "CANCEL";
            //public const string PREORDER = "PREORDER";
        }
    }

    public enum CodeTyp
    {
        damage = 0,
        repair = 1
    }
}
