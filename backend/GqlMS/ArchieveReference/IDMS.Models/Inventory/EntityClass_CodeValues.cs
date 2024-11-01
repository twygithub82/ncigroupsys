using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Inventory
{
    public class EntityClass_CodeValues:EntityClass_Dates
    {
        [Key]
        [Column("guid")]
        public string? Guid { get; set; }

        [Column("description")]
        public string? Description { get; set; }

        [Column("code_val_type")]
        public string CodeValType { get; set; }

        [Column("code_val")]
        public string? CodeValue { get; set; }

        [Column("child_code")]
        public string? ChildCode { get; set; }
    }
}
