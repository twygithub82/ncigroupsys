using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.StoringOrder.Model
{
    public static class SOStatus
    {
        public const string COMPLETED = "COMPLETED";
        public const string PENDING = "PENDING";
        public const string PROCESSING = "PROCESSING";
        public const string CANCELED = "CANCELED";
    }

    public static class SOTankStatus
    {
        public const string CANCELED = "CANCELED";
        public const string WAITING = "WAITING";
        public const string ACCEPTED = "ACCEPTED";
    }

    public static class TankMovementStatus
    {
        public const string CLEANING = "CLEANING";
        public const string REPAIR = "REPAIR";
        public const string STEAM = "STEAM";
        public const string STORAGE = "STORAGE";
        public const string RO = "RO_GENERATED";


    }
}
