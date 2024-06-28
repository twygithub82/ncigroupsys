using CommonUtil.Core.Service;
using IDMS.Booking.Model.Domain;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Booking.Model.Type
{
    public class CodeValuesType
    {
        public string? Guid { get; set; }
        public string? Description { get; set; }
        public string CodeValType { get; set; }
        public string? CodeValue { get; set; }
        public string? ChildCode { get; set; }

    }
}
