using ONEHub.Domain.Entities;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Services;

public interface IExternalAuthService
{
    Task<Result<User>> ValidateTokenAsync(string authToken);

    Task<Result<string>> RefreshTokenAsync(string refreshToken);
}
