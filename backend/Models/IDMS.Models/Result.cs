using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Result
    {
        public int result { get; set; } = -1;
    }

    public class LengthWithUnit
    {
        public double? length { get; set; }
        public string? length_unit_cv { get; set; }
    }
}
