using MediatR;
using Microsoft.Extensions.Options;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Application.Features.Auth.Commands;

public class LoginCommand : BaseCommand<LoginResponse>
{
    public string UserName { get; set; } = string.Empty;

    public string Password { get; set; } = string.Empty;
}

public record LoginResponse(string AccessToken, string RefreshToken);

public class LoginHandler(
    IJwtTokenService jwtTokenService,
    IAuthRepository authRepository,
    ICacheProvider cacheProvider,
    IOptions<JwtSetting> jwtSetting)
    : IRequestHandler<LoginCommand, Result<LoginResponse>>
{
    public async Task<Result<LoginResponse>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var loginResult = await authRepository.GetUserByUserNameAsync(request.UserName);

        if (loginResult.IsFailure || loginResult.Data == null)
        {
            return Result<LoginResponse>.Failure(loginResult.Error);
        }

        if (!BCrypt.Net.BCrypt.Verify(request.Password, loginResult.Data.PasswordHash))
        {
            return Result<LoginResponse>.Failure(AuthError.InvalidCredentials);
        }

        var accessToken = jwtTokenService.GenerateAccessToken(loginResult.Data);
        var refreshToken = jwtTokenService.GenerateRefreshToken();

        var cacheKey = $"{CacheKeys.INTERNAL_REFRESH_TOKEN}:{loginResult.Data.UserId}:{refreshToken}";
        var expirationTimeSpan = TimeSpan.FromDays(jwtSetting.Value.RefreshTokenExpirationDays);
        await cacheProvider.SetValueToCacheAsync(cacheKey, refreshToken, expirationTimeSpan);

        return Result<LoginResponse>.Success(new LoginResponse(accessToken, refreshToken));
    }
}
