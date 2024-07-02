using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace InventoryBaseModel
{
    public class code_values
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

        //public storing_order_tank? sot {  get; set; }     
    }
}
