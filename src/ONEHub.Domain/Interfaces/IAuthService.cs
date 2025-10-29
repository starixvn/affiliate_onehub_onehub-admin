using ONEHub.Domain.DTOs.Common;
using System.Security.Claims;

namespace ONEHub.Domain.Interfaces;

public interface IAuthService
{
    IEnumerable<Claim> GetClaims(int userId, IList<UserPermission> permissions);
}

