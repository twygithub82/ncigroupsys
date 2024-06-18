using CommonUtil.Core.Service;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Type
{
    public class CodeValues : Base
    {
        public string? guid { get; set; }
        public string? description { get; set; }
        public string? code_val_type { get; set; }
        public string? code_val { get; set; }
        public string? parent_code { get; set; }

    }
}
