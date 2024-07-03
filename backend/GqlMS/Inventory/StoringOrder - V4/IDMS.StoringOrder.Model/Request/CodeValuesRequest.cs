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
        public string? Guid { get; set; }
        public string? Description { get; set; }
        public string CodeValType { get; set; }
        public string? CodeValue { get; set; }
        public string? ChildCode { get; set; }

    }
}
