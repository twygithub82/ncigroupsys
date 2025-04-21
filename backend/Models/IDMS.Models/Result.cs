using HotChocolate;
using IDMS.Models.Master;
using IDMS.Models.Shared;
using IDMS.Models.Tariff;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Security.Permissions;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Models
{
    public class Result
    {
        [NotMapped]
        public int result { get; set; } = -1;
    }

    public class LengthWithUnit
    {
        [NotMapped]
        public double? length { get; set; }
        [NotMapped]
        public string? length_unit_cv { get; set; }
    }

    [NotMapped]
    public class TariffCleaningResult
    {
        public tariff_cleaning tariff_cleaning { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class TariffResidueResult
    {
        public tariff_residue tariff_residue { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class TariffSteamingResult
    {
        public tariff_steaming tariff_steaming { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class TariffRepairResult
    {
        public tariff_repair tariff_repair { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class TariffDepotResult
    {
        public tariff_depot tariff_depot { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class TariffBufferResult
    {
        public tariff_buffer tariff_buffer { get; set; }
        public int tank_count { get; set; }
    }
    [NotMapped]
    public class CustomerCompanyResult
    {
        public customer_company customer_company { get; set; }
        public int sot_count { get; set; }
        public int so_count { get; set; }
        public int tank_info_count { get; set; }

    }
}
