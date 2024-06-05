using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DWMS.Cleaning.Model
{
    public class Cake
    {
        public int Id { get; set; }
        public string? Name { get; set; }
        public decimal Price { get; set; }
        public string? Description { get; set; }

    }

    public class CakeResult
    {
        public int Id { get; set; }
        public string? Name { get; set; }
    }

    public class CakeUpdateResult
    {
        public int Id { get; set; }
        public decimal NewPrice { get; set; }
    }
}
