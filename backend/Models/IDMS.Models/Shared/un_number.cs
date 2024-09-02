using HotChocolate;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class un_number
    {
        [Key]
        public string? guid { get; set; }
        public string un_no { get; set; }

        [Column("class")]
        [GraphQLName("class")]
        public string? un_class { get; set; }
    }
}
