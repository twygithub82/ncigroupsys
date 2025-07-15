using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Service.GqlTypes.LocalModel
{
    [NotMapped]
    public class TeamResult
    {
        public team team { get; set; }
        public int assign_count { get; set; }
    }
}
