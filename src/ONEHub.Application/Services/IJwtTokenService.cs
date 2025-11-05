using ONEHub.Domain.Entities;

namespace ONEHub.Application.Services;

public interface IJwtTokenService
{
    string GenerateAccessToken(User user);

    string GenerateRefreshToken();
}
