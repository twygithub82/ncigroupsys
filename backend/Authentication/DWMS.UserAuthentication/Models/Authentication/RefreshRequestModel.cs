namespace DWMS.User.Authentication.API.Models.Authentication
{
    public class RefreshRequestModel
    {
        public string Token { get; set; }
        public string RefreshToken { get; set; }
    }
}
