namespace DWMS.User.Authentication.API.Models.RefreshToken
{
    public class RefreshTokenStore : IRefreshTokenStore
    {
        private readonly Dictionary<string, RefreshToken> _refreshTokens = new Dictionary<string, RefreshToken>();

        public void AddToken(RefreshToken token)
        {
            _refreshTokens[token.UserId] = token;
        }

        public RefreshToken GetToken(string userId)
        {
            _refreshTokens.TryGetValue(userId, out var refreshToken);
            return refreshToken;
        }

        public void RemoveToken(string userId)
        {
            _refreshTokens.Remove(userId);
        }
    }
}
