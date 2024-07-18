using CommonUtil.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Request
{
    public class CodeValuesRequest
    {
        public string? guid { get; set; }
        public string? description { get; set; }
        public string code_val_type { get; set; }
        public string? code_val { get; set; }
        public string? child_code { get; set; }
        public int? sequence { get; set; }  

    }
}
