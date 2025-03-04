using IDMS.Models.Parameter;
using Microsoft.EntityFrameworkCore.Query.Internal;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Parameter.GqlTypes.LocalModel
{
    public class CleaningMethodFormulaRequest
    {
        public string method_guid {  get; set; }
        public List<CleaningFormulaRequest> cleaning_formulas { get; set; }
    }

    public class CleaningFormulaRequest
    {
        public string formula_guid { get; set;}
        public int sequence {  get; set;}
        public string? action { get; set;}   
    }
}
