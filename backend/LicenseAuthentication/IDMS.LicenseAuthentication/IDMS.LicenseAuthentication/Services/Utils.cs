namespace IDMS.LicenseAuthentication.Services
{
    public static class Utils
    {
        public static string GetGuidString()
        {
            return Guid.NewGuid().ToString("N");
        }

        public static DateTime GetCurrentDateTimeUTC()
        {
            return DateTime.UtcNow;
        }

       
    }
}
