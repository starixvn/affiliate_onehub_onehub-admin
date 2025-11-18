using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using ONEHub.Application.Services;
using ONEHub.Application.Utils;
using ONEHub.Domain.Constants;

namespace ONEHub.Infrastructure.Services;

public class CurrentUserService(IHttpContextAccessor httpContextAccessor) : ICurrentUserService
{
    public int GetUserId()
    {
        var httpContext = httpContextAccessor.HttpContext;
        ArgumentNullException.ThrowIfNull(httpContext);

        if (!IsAuthenticated())
        {
            return -1;
        }

        var userId = httpContext.User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.TryParse(userId, out var value) ? value : -1;
    }

    public string GetUserName()
    {
        var httpContext = httpContextAccessor.HttpContext;
        ArgumentNullException.ThrowIfNull(httpContext);

        if (!IsAuthenticated())
        {
            return string.Empty;
        }

        return httpContext.User.FindFirst(ClaimTypes.Name)?.Value ?? string.Empty;
    }

    public bool IsAuthenticated()
    {
        var httpContext = httpContextAccessor.HttpContext;
        ArgumentNullException.ThrowIfNull(httpContext);

        return httpContext.User.Identity?.IsAuthenticated == true;
    }

    public int GetUserIdFromExpiredToken()
    {
        var httpContext = httpContextAccessor.HttpContext;

        var accessToken = HttpContextUtils.GetCookie(httpContext, CookieKeys.ACCESS_TOKEN);
        if (string.IsNullOrEmpty(accessToken))
        {
            return -1;
        }

        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var jwtToken = tokenHandler.ReadJwtToken(accessToken);
            var userIdClaim = jwtToken.Claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

            return int.TryParse(userIdClaim, out var userId) ? userId : -1;
        }
        catch
        {
            return -1;
        }
    }
}
