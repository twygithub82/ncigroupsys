using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model
{
    public class StoringOder:Base
    {
        [Column("guid")]
        public string? guid { get; set; }

        [Column("customer_company_guid")]
        public string? customer_company_guid { get; set; }

        [Column("contact_person_guid")]
        public string? contact_person_guid { get; set; }

        public int? status { get; set; }

        [Column("haulier")]
        public string? haulier { get; set; }

        [Description("so_no")]
        public string? so_no { get; set; }

        [Column("so_notes")]
        public string? so_notes { get; set; }
    }
}
