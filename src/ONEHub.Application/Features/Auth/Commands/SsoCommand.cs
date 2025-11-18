using MediatR;
using Microsoft.Extensions.Options;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Results;
using ONEHub.Domain.Settings;

namespace ONEHub.Application.Features.Auth.Commands;

public class SsoCommand : BaseCommand<SsoResponse>
{
    public string ExternalAccessToken { get; set; } = string.Empty;
}

public record SsoResponse(string AccessToken, string RefreshToken);

public class SsoHandler(
    IExternalAuthService externalAuthService,
    IJwtTokenService jwtTokenService,
    ICacheProvider cacheProvider,
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
            return Result<SsoResponse>.Failure(validationResult.Error);
        }

        var user = validationResult.Data;
        if (user is null)
        {
            return Result<SsoResponse>.Failure(AuthError.Unauthorized);
        }

        var accessToken = jwtTokenService.GenerateAccessToken(user);
        var refreshToken = jwtTokenService.GenerateRefreshToken();

        var cacheKey = $"{CacheKeys.REFRESH_TOKEN}{user.UserId}";
        var expirationTimeSpan = TimeSpan.FromDays(jwtSetting.Value.RefreshTokenExpirationDays);
        await cacheProvider.SetValueToCacheAsync(cacheKey, refreshToken, expirationTimeSpan);

        return Result<SsoResponse>.Success(new SsoResponse(accessToken, refreshToken));
    }
}
