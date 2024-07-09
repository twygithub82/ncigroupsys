using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class surveyor: Dates
    {
        [Key]
        [IsProjected]
        public string? guid {  get; set; }
        public string? name { get; set; }
        public string? code {  get; set; }
    }
}
