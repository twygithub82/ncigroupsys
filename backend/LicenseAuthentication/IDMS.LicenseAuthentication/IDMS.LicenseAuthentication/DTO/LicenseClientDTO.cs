namespace IDMS.LicenseAuthentication.DTO
{
    public class LicenseClientCreateDto
    {
        public string Organization { get; set; }
        public string Email { get; set; }
        public string CreateBy { get; set; }
    }

    public class LicenseClientReadDto
    {
        public string? ClientId { get; set; }
        public string? Organization { get; set; }
        public string? Email { get; set; }
        public DateTime? CreateDt { get; set; }
        public string? CreateBy { get; set; }
        public DateTime? UpdateDt { get; set; }
        public string? UpdateBy { get; set; }
    }

    public class LicenseClientUpdateDto
    {
        public string? Organization { get; set; }
        public string? Email { get; set; }
        public string? UpdateBy { get; set; }
    }
}
