using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model
{
    public class Person
    {
        public int ID { get; set; }
        public string Name { get; set; }
        public DateTime Date { get; set; }
    }

    public class PersonResult
    {
        public string Name { get; set; }
        public DateTime Date { get; set; }
    }
}
