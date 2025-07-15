namespace IDMS.LicenseAuthentication.DTO
{
    public class LicenseUserDto
    {
        public string Id { get; set; }
        public string SubId { get; set; }
        public string UserTag { get; set; }
        public string LicenseKeyToken { get; set; }
        public string ActivationCode { get; set; }
        public bool IsActive { get; set; }
        public DateTime CreateDt { get; set; }
        public string CreateBy { get; set; }
        public DateTime? UpdateDt { get; set; }
        public string UpdateBy { get; set; }
        public DateTime? DeleteDt { get; set; }
    }
    public class LicenseUserCreateDto
    {
        public string SubId { get; set; }
        public string UserTag { get; set; }
        //public string LicenseKeyToken { get; set; }
        // public bool IsActive { get; set; }
        // public string CreateBy { get; set; }
    }

    public class LicenseUserUpdateDto
    {
        public string UserTag { get; set; }
        public string LicenseKeyToken { get; set; }
        public bool IsActive { get; set; }
        public string UpdateBy { get; set; }
    }
}
