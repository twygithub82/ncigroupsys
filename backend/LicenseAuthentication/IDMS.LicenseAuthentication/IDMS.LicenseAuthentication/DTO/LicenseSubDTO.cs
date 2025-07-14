using System.ComponentModel.DataAnnotations.Schema;

namespace IDMS.LicenseAuthentication.DTO
{
    [NotMapped]
    public class LicenseSubReadDto
    {
        public string Id { get; set; }
        public string LicenseKey { get; set; }
        public string LicenseType { get; set; }
        public ushort NumUsers { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDt { get; set; }
        public string CreateBy { get; set; }
    }

    [NotMapped]
    public class LicenseSubCreateDto
    {
        public string ClientId { get; set; }
        public string LicId { get; set; }
        //public string LicenseKey { get; set; }
        public string LicenseType { get; set; }
        public ushort NumUsers { get; set; }
        public bool IsActive { get; set; }
        public string SecrectKey { get; set; }
    }

    [NotMapped]
    public class LicenseSubUpdateDto
    {
        public string? ValidityId { get; set; }
        public string? ClientId { get; set; }
        public string? LicId { get; set; }
        public string? LicenseKey { get; set; }
        public string? LicenseType { get; set; }
        public ushort? NumUsers { get; set; }
        public bool? IsActive { get; set; }
    }
}
