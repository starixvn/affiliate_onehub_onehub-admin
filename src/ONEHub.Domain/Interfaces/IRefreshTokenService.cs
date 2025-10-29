using ONEHub.Domain.Entities.Auth;

namespace ONEHub.Domain.Interfaces;

public interface IRefreshTokenService
{
    Task<UserRefreshToken?> GetByTokenAsync(string refreshToken);
    Task<UserRefreshToken?> GetActiveTokenByUserIdAsync(int userId);
    Task SaveAsync(UserRefreshToken refreshToken);
    Task RevokeAsync(string refreshToken, string revokedByIp);
    Task RevokeAllByUserIdAsync(int userId, string revokedByIp);
}
