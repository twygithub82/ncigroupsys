using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Inventory.GqlTypes.LocalModel
{
    public class SteamingPackageResult
    {
        public double? cost { get; set; }
        public double? labour { get; set; }
        public string? steaming_guid { get; set; }
    }
}
