namespace IDMS.User.Authentication.API.Models.RefreshToken
{
    public interface IRefreshTokenStore
    {
        void AddToken(RefreshToken token);
        RefreshToken GetToken(string userId);
        void RemoveToken(string userId);
        // Add other necessary methods
    }

}
