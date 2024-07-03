
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
        public string? guid { get; set; }
        public string? description { get; set; }
        public string? code_val_type { get; set; }
        public string? code_val { get; set; }
        public string? child_code { get; set; }
    }
}
