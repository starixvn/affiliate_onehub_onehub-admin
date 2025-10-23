using ONEHub.Domain.DTOs.Common;
using System.Security.Claims;

namespace ONEHub.Domain.Interfaces;

public interface ISessionService
{
    int UserId { get; set; }
    int OnUserId { get; set; }
    string AffName { get; set; }
    IList<UserPermission> UserPermissionList { get; set; }
    IEnumerable<ClaimsIdentity> ClaimIdentities { get; set; }
    ClaimsPrincipal? UserClaim { get; }
    bool HasHostPermission(string functionName);
}


