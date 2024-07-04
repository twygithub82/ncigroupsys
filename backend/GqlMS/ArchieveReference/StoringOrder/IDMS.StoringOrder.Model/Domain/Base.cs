using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CommonUtil.Core.Service;

namespace IDMS.StoringOrder.Model.Domain
{
    public class Base
    {

        public long? delete_dt { get; set; } = 0;

        public long? create_dt { get; set; } = DateTime.Now.ToEpochTime();

        public long? update_dt { get; set; } = DateTime.Now.ToEpochTime();

        public string? create_by { get; set; }

        public string? update_by { get; set; }
    }
}
