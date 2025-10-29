using MediatR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using ONEHub.Application.DTOs.Auth;
using ONEHub.Domain.Criterias.Auth;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Errors;
using ONEHub.Domain.Interfaces;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Auth.Commands;

public class RefreshTokenCommandHandler(
    IRefreshTokenService refreshTokenService,
    IDynamicRepository repository,
    IJwtTokenService jwtTokenService,
    IConfiguration configuration,
    ILogger<RefreshTokenCommandHandler> logger)
    : IRequestHandler<RefreshTokenCommand, ServiceResult<LoginDto>>
{
    public async Task<ServiceResult<LoginDto>> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        if (string.IsNullOrWhiteSpace(request.RefreshToken))
        {
            logger.LogWarning("Refresh token is missing");
            return ServiceResult<LoginDto>.Failure(ServiceError.InvalidRefreshToken);
        }

        var storedToken = await refreshTokenService.GetByTokenAsync(request.RefreshToken);
        if (storedToken == null)
        {
            logger.LogWarning("Refresh token not found: {Token}", request.RefreshToken[..10]);
            return ServiceResult<LoginDto>.Failure(ServiceError.RefreshTokenNotFound);
        }

        if (storedToken.IsRevoked)
        {
            logger.LogWarning("Refresh token has been revoked for user {UserId}", storedToken.UserId);
            return ServiceResult<LoginDto>.Failure(ServiceError.RefreshTokenRevoked);
        }

        if (storedToken.IsExpired)
        {
            logger.LogWarning("Refresh token has expired for user {UserId}", storedToken.UserId);
            return ServiceResult<LoginDto>.Failure(ServiceError.RefreshTokenExpired);
        }

        var permissions = await repository.FetchAsync<UserPermission>(new UserPermissionCriteria
        {
            UserId = storedToken.UserId
        });

        var permissionList = permissions.Where(p => !p.FunctionName.Contains("TransferPlayer")).ToList();

        if (!permissionList.Any())
        {
            logger.LogWarning("User {UserId} has no permissions configured", storedToken.UserId);
            return ServiceResult<LoginDto>.Failure(ServiceError.UserNotFound);
        }

        var onUserId = 0;
        var userName = string.Empty;

        var accessToken = jwtTokenService.GenerateAccessToken(storedToken.UserId, userName, permissionList, onUserId);
        var expirationMinutes = int.Parse(configuration["Jwt:AccessTokenExpirationMinutes"] ?? "60");

        logger.LogInformation("Access token refreshed successfully for user {UserId}", storedToken.UserId);

        var loginDto = new LoginDto
        {
            AccessToken = accessToken,
            RefreshToken = request.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddMinutes(expirationMinutes),
            UserId = storedToken.UserId,
            UserName = userName
        };

        return ServiceResult<LoginDto>.Success(loginDto);
    }
}

