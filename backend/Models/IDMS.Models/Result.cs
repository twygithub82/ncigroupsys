using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Result
    {
        [NotMapped]
        public int result { get; set; } = -1;
    }

    public class LengthWithUnit
    {
        [NotMapped]
        public double? length { get; set; }
        [NotMapped]
        public string? length_unit_cv { get; set; }
    }
}
