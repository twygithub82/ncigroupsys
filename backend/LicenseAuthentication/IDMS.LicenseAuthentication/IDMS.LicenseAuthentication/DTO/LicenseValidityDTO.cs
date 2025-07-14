using Microsoft.EntityFrameworkCore.Query.Internal;
using System.Globalization;

namespace IDMS.LicenseAuthentication.DTO
{
    public class LicenseValidityCreateDto
    {
        public string LicSubciptionId { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public float Cost { get; set; }
        public string CreateBy { get; set; }
    }

    public class LicenseValidityUpdateDto
    {
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public float Cost { get; set; }
        public bool Deactivated { get; set; }
        public string UpdateBy { get; set; }
    }

    public class LicenseValidityReadDto
    {
        public string LicValidId { get; set; }
        public string LicSubcriptionId { get; set; }
        public DateTime ValidFrom { get; set; }
        public DateTime ValidTo { get; set; }
        public float Cost { get; set; }
        public bool Deactivated { get; set; }
        public DateTime? DeactivateDt { get; set; }
        public DateTime CreateDt { get; set; }
        public string CreateBy { get; set; }
        public DateTime? UpdateDt { get; set; }
        public string UpdateBy { get; set; }
    }
}
