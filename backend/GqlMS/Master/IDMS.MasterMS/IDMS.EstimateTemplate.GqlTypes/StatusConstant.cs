using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.EstimateTemplate
{
    public class StatusConstant
    {
        public static class TemplateType
        {
            public const string GENERAL = "GENERAL";
            public const string EXCLUSIVE = "EXCLUSIVE";
   
        }
    }

    public enum CodeTyp
    {
        damage = 0,
        repair = 1
    }
}
