using IDMS.StoringOrder.Model.Domain.StoringOrder;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model.Domain
{
    [Table("code_values")]
    public class code_values: Base
    {
        [Key]
        [Column("guid")]
        public string? guid { get; set; }

        [Column("description")]
        public string? description { get; set; }

        [Column("code_val_type")]
        public string code_val_type { get; set; }

        [Column("code_val")]
        public string? code_val { get; set; }

        [Column("child_code")]
        public string? child_code { get; set; }

        //public storing_order_tank? sot {  get; set; }     
    }
}
