using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommonUtil.Core.Service;

namespace IDMS.StoringOrder.Model
{
    public class Base
    {
        [Column("delete_dt")]
        public long? delete_dt { get; set; }

        [Column("create_dt")]
        public long? create_dt { get; set; } = DateTime.Now.ToEpochTime();
        
        [Column("update_dt")]
        public long? update_dt { get; set; } = DateTime.Now.ToEpochTime();

        [Column("create_by")]
        public string? create_by { get; set; }

        [Column("update_by")]
        public string? update_by { get; set; }
    }
}
