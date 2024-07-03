
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models.Shared
{
    public class code_values : Dates
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
    }
}
