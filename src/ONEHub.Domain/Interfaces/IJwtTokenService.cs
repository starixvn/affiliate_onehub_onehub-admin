using ONEHub.Domain.DTOs.Common;
using System.Security.Claims;

namespace ONEHub.Domain.Interfaces;

public interface IJwtTokenService
{
    string GenerateAccessToken(int userId, string userName, IList<UserPermission> permissions, int onUserId = 0);
    string GenerateRefreshToken();
    ClaimsPrincipal? ValidateToken(string token);
    int GetUserIdFromToken(string token);
}

