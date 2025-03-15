
using HotChocolate;
using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.Billing.GqlTypes.BillingResult
{
    public class SteamPerformance
    {
        [NotMapped]
        [GraphQLIgnore]
        public string? job_order_guid { get; set; }
        [NotMapped]
        public string? customer_code { get; set; }
        [NotMapped]
        public string? tank_no { get; set; }
        [NotMapped]
        public string? eir_no { get; set; }
        [NotMapped]
        public long? eir_dt { get; set; }
        [NotMapped]
        public string? last_cargo { get; set; }
        [NotMapped]
        public string? duration { get; set; }
        [NotMapped]
        public long? complete_dt { get; set; }
        [NotMapped]
        public double? cost { get; set; }
        [NotMapped]
        public float? require_temp { get; set; }
        [NotMapped]
        public string? bay { get; set; }
        [NotMapped]
        [GraphQLIgnore]
        public string? yard { get; set; }
        [NotMapped]
        public Themometer? Themometer { get; set; }
        [NotMapped]
        public Top? Top { get; set; }
        [NotMapped]
        public Bottom? Bottom { get; set; }
    }

    public class Themometer
    {
        [NotMapped]
        public double? begin_temp { get; set; }
        [NotMapped]
        public double? close_temp { get; set; }
    }

    public class Top
    {
        [NotMapped]
        public double? begin_temp { get; set; }
        [NotMapped]
        public double? close_temp { get; set; }
    }

    public class Bottom
    {
        [NotMapped]
        public double? begin_temp { get; set; }
        [NotMapped]
        public double? close_temp { get; set; }
    }

    public class SteamingTempResult
    {
        public string JobOrderGuid { get; set; }
        public double? FirstMeterTemp { get; set; }
        public double? FirstTopTemp { get; set; }
        public double? FirstBottomTemp { get; set; }
        public long? FirstRecordTime { get; set; }
        public double? LastMeterTemp { get; set; }
        public double? LastTopTemp { get; set; }
        public double? LastBottomTemp { get; set; }
        public long? LastRecordTime { get; set; }
    }
}
