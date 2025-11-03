using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ONEHub.Application.Services;
using ONEHub.Domain.Constants;
using ONEHub.Domain.Entities;
using ONEHub.Domain.Settings;

namespace ONEHub.Infrastructure.Services;

public class JwtTokenService(
    IOptions<JwtSetting> jwtSetting,
    IDateTimeProvider dateTimeProvider)
    : IJwtTokenService
{
    private readonly JwtSetting _jwtSetting = jwtSetting.Value;
    public string GenerateAccessToken(User user)
    {
        var claimsList = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.UserId.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.NameIdentifier, user.UserId.ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
        };

        // Build roles list
        var roles = new List<string>(user.Roles);

        // If user is admin, automatically add Admin role
        if (user.IsAdmin && !roles.Contains(Roles.ADMIN))
        {
            roles.Add(Roles.ADMIN);
        }

        // Add all roles as claims
        claimsList.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var claims = claimsList.ToArray();

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSetting.SecretKey));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var token = new JwtSecurityToken(
            issuer: _jwtSetting.Issuer,
            audience: _jwtSetting.Audience,
            claims: claims,
            expires: dateTimeProvider.UtcNow.AddMinutes(_jwtSetting.AccessTokenExpirationMinutes),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public string GenerateRefreshToken()
    {
        var randomNumber = new byte[64];
        using var rng = RandomNumberGenerator.Create();
        rng.GetBytes(randomNumber);

        return Convert.ToBase64String(randomNumber);
    }
}
