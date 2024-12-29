namespace IDMS.User.Authentication.API.Models.RefreshToken
{
    public class RefreshToken
    {
        public string Token { get; set; }
        public string UserId { get; set; }
        public DateTime ExpiryDate { get; set; }
        // Add other necessary properties
    }
}
