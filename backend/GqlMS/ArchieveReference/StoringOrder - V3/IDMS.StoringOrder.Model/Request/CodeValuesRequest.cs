using CommonUtil.Core.Service;
using IDMS.StoringOrder.Model.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Type
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
