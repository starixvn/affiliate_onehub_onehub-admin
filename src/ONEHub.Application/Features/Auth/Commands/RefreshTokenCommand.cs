using MediatR;
using ONEHub.Application.Features.Shared;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Repositories;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Auth.Commands;

public class RefreshTokenCommand : BaseCommand<RefreshTokenResponse>
{
    public string RefreshToken { get; set; } = string.Empty;
}

public record RefreshTokenResponse(string AccessToken);

public class RefreshTokenHandler(
    IJwtTokenService jwtTokenService,
    ICacheProvider cacheProvider,
    IAuthRepository authRepository
    )
    : IRequestHandler<RefreshTokenCommand, Result<RefreshTokenResponse>>
{
    public async Task<Result<RefreshTokenResponse>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        var cacheKey = $"{CacheKeys.REFRESH_TOKEN}:{request.UserId}:{request.RefreshToken}";
        var cachedRefreshToken = await cacheProvider.GetValueFromCacheAsync<string>(cacheKey);
        if (cachedRefreshToken is null)
        {
            return Result<RefreshTokenResponse>.Failure(AuthError.InvalidToken);
        }

        var userResult = await authRepository.GetUserByUserIdAsync(request.UserId);

        if (userResult.IsFailure)
        {
            return Result<RefreshTokenResponse>.Failure(userResult.Error);
        }

        if (userResult.Data is null)
        {
            return Result<RefreshTokenResponse>.Failure(AuthError.UserNotFound);
        }

        var accessToken = jwtTokenService.GenerateAccessToken(userResult.Data);

        return Result<RefreshTokenResponse>.Success(new RefreshTokenResponse(accessToken));
    }
}
