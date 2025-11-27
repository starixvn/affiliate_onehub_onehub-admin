using Fanex.Logging;
using MediatR;
using Microsoft.Extensions.Options;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Params;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Application.Features.Auth.Commands;

public class SsoCommand : BaseCommand<SsoResponse>
{
    public string ExternalAccessToken { get; set; } = string.Empty;
    public string? ExternalRefreshToken { get; set; }
}

public record SsoResponse(string AccessToken, string RefreshToken);

public class SsoHandler(
    IExternalAuthService externalAuthService,
    IJwtTokenService jwtTokenService,
    ICacheProvider cacheProvider,
    IAuthRepository authRepository,
    IOptions<JwtSetting> jwtSetting)
    : IRequestHandler<SsoCommand, Result<SsoResponse>>
{
    public async Task<Result<SsoResponse>> Handle(SsoCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrEmpty(request.ExternalAccessToken))
        {
            return Result<SsoResponse>.Failure(AuthError.InvalidToken);
        }

        var validationResult = await externalAuthService.ValidateTokenAsync(request.ExternalAccessToken);

        if (validationResult.IsFailure)
        {
            if (validationResult.Error.Code == AuthError.ExpiredToken.Code && !string.IsNullOrEmpty(request.ExternalRefreshToken))
            {
                var refreshResult = await externalAuthService.RefreshTokenAsync(request.ExternalRefreshToken);

                if (refreshResult.IsFailure)
                {
                    return Result<SsoResponse>.Failure(AuthError.InvalidToken);
                }

                validationResult = await externalAuthService.ValidateTokenAsync(refreshResult.Data!);

                if (validationResult.IsFailure)
                {
                    return Result<SsoResponse>.Failure(validationResult.Error);
                }
            }
            else
            {
                return Result<SsoResponse>.Failure(validationResult.Error);
            }
        }

        var user = validationResult.Data;
        if (user is null)
        {
            return Result<SsoResponse>.Failure(AuthError.Unauthorized);
        }

        try
        {
            var createUserParam = new CreateUserParam
            {
                UserName = user.UserName,
                PasswordHash = user.PasswordHash,
                IsAdmin = user.IsAdmin,
                UserId = user.UserId,
                Ip = request.Ip,
                Host = request.Host
            };

            await authRepository.CreateUserAsync(createUserParam);
        }
        catch (Exception ex)
        {
            await Logger.Log.InfoAsync($"Failed to sync user {user.UserId} to database during SSO login. Error: {ex.Message}");
        }

        var accessToken = jwtTokenService.GenerateAccessToken(user);
        var refreshToken = jwtTokenService.GenerateRefreshToken();

        var cacheKey = $"{CacheKeys.INTERNAL_REFRESH_TOKEN}:{user.UserId}:{refreshToken}";
        var expirationTimeSpan = TimeSpan.FromDays(jwtSetting.Value.RefreshTokenExpirationDays);
        await cacheProvider.SetValueToCacheAsync(cacheKey, refreshToken, expirationTimeSpan);

        return Result<SsoResponse>.Success(new SsoResponse(accessToken, refreshToken));
    }
}
