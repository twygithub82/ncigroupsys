namespace IDMS.LicenseAuthentication.DTO
{
    public class LicenseCreateDto
    {
        public string ProductCode { get; set; }
        public float ProductCost { get; set; }
        public string CreateBy { get; set; }
    }

    public class LicenseReadDto
    {
        public string? LicId { get; set; }
        public string? ProductCode { get; set; }
        public float? ProductCost { get; set; }
        public DateTime? CreateDt { get; set; }
        public string? CreateBy { get; set; }
        public DateTime? UpdateDt { get; set; }
        public string? UpdateBy { get; set; }
    }

    public class LicenseUpdateDto
    {
        public string ProductCode { get; set; }
        public float ProductCost { get; set; }
        public string UpdateBy { get; set; }
    }
}
