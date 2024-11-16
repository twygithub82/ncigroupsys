using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace IDMS.Survey.GqlTypes.LocalModel
{
    public static class EirStatus
    {
        public const string YET_TO_SURVEY = "YET_TO_SURVEY";
        public const string PENDING = "PENDING";
        public const string PUBLISHED = "PUBLISHED";
        public const string CANCELED = "CANCELED";
    }

    public static class TankMovementStatus
    {
        public const string CLEANING = "CLEANING";
        public const string INGATE = "IN_GATE";
        public const string INGATE_SURVEY = "IN_SURVEY";
        public const string OUTGATE = "OUT_GATE";
        public const string OUTGATE_SURVEY = "OUT_SURVEY";
        public const string RESIDUE = "RESIDUE";
        public const string REPAIR = "REPAIR";
        public const string STEAM = "STEAM";
        public const string STORAGE = "STORAGE";
        public const string RO = "RO_GENERATED";
    }

    public static class ROStatus
    {
        public const string CANCELED = "CANCELED";
        public const string DELETED = "DELETED";
        public const string PENDING = "PENDING";
        public const string PROCESSING = "PROCESSING";
        public const string COMPLETED = "COMPLETED";
    }

    public static class CurrentProcessStatus
    {
        public const string APPROVED = "APPROVED";
    }
}
