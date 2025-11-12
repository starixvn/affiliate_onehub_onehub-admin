using ONEHub.Domain.Entities;

namespace ONEHub.Application.Services;

public interface IJwtTokenService
{
    public string GenerateAccessToken(User user);

    public string GenerateRefreshToken();
}
