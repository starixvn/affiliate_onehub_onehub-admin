using ONEHub.Domain.Entities.Auth;
using ONEHub.Domain.Interfaces;

namespace ONEHub.Infrastructure.Services;

public class RefreshTokenService(ICacheService cacheService) : IRefreshTokenService
{
    private const string TOKEN_PREFIX = "refresh_token:";
    private const string USER_TOKEN_PREFIX = "user_tokens:";

    public async Task<UserRefreshToken?> GetByTokenAsync(string refreshToken)
    {
        var key = $"{TOKEN_PREFIX}{refreshToken}";
        return await cacheService.GetAsync<UserRefreshToken>(key);
    }

    public async Task<UserRefreshToken?> GetActiveTokenByUserIdAsync(int userId)
    {
        var userKey = $"{USER_TOKEN_PREFIX}{userId}";
        var tokenKey = await cacheService.GetAsync<string>(userKey);

        if (string.IsNullOrEmpty(tokenKey))
            return null;

        return await GetByTokenAsync(tokenKey);
    }

    public async Task SaveAsync(UserRefreshToken refreshToken)
    {
        var key = $"{TOKEN_PREFIX}{refreshToken.RefreshToken}";
        var userKey = $"{USER_TOKEN_PREFIX}{refreshToken.UserId}";

        if (refreshToken.CreatedDate == default)
            refreshToken.CreatedDate = DateTime.UtcNow;

        var expiry = refreshToken.ExpiresAt - DateTime.UtcNow;

        if (expiry > TimeSpan.Zero)
        {
            await cacheService.SetAsync(key, refreshToken, expiry);
            await cacheService.SetAsync(userKey, refreshToken.RefreshToken, expiry);
        }
    }

    public async Task RevokeAsync(string refreshToken, string revokedByIp)
    {
        var token = await GetByTokenAsync(refreshToken);
        if (token != null)
        {
            token.RevokedAt = DateTime.UtcNow;
            token.RevokedByIp = revokedByIp;
            token.ModifiedDate = DateTime.UtcNow;
            await SaveAsync(token);
        }
    }

    public async Task RevokeAllByUserIdAsync(int userId, string revokedByIp)
    {
        var token = await GetActiveTokenByUserIdAsync(userId);
        if (token != null)
        {
            await RevokeAsync(token.RefreshToken, revokedByIp);
        }

        var userKey = $"{USER_TOKEN_PREFIX}{userId}";
        await cacheService.RemoveAsync(userKey);
    }
}
