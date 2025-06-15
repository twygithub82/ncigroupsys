using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    [NotMapped]
    public class SteamingPackageResult
    {
        public double? cost { get; set; }
        public double? labour { get; set; }
        public string? steaming_guid { get; set; }
    }

    [NotMapped]
    public class RepairPackageResult
    {
        public double? cost { get; set; }
        public double? labour_hour { get; set; }
    }
}
