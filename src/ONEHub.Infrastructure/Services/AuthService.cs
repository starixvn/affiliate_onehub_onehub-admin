using ONEHub.Domain.Constants;
using ONEHub.Domain.Criterias.Administrators;
using ONEHub.Domain.DTOs.Common;
using ONEHub.Domain.Entities.Administrators;
using ONEHub.Domain.Interfaces;
using System.Security.Claims;

namespace ONEHub.Infrastructure.Services;

public class AuthService : IAuthService
{
    private readonly IDynamicRepository _repository;

    public AuthService(IDynamicRepository repository)
    {
        _repository = repository;
    }

    public IEnumerable<Claim> GetClaims(int userId, IList<UserPermission> permissions)
    {
        var accountCriteria = new AdministratorDetailCriteria { UserId = userId };
        var account = _repository.GetAsync<AdministratorInfo>(accountCriteria).Result;

        if (account == null)
        {
            return Enumerable.Empty<Claim>();
        }

        return BuildClaims(account, permissions);
    }

    private static IEnumerable<Claim> BuildClaims(AdministratorInfo adminInfo, IList<UserPermission> permissions)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, adminInfo.UserId.ToString()),
            new Claim(ClaimTypes.GivenName, adminInfo.UserName ?? string.Empty),
            new Claim(ClaimTypes.Role, adminInfo.GroupId.ToString())
        };

        if (permissions != null && permissions.Any())
        {
            claims.AddRange(permissions.Select(p => BuildClaimFromPermission(p)));
        }

        return claims;
    }

    private static Claim BuildClaimFromPermission(UserPermission p)
    {
        var claimValue = p.IsHost ? Function.WritePermission : string.Empty;
        var claim = new Claim(p.FunctionName, claimValue);
        return claim;
    }
}

