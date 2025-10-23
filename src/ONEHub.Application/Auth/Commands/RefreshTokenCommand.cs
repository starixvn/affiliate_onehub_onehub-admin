using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Auth.Commands;

public class RefreshTokenCommand : BaseCommand<LoginDto>
{
    public string RefreshToken { get; set; } = string.Empty;
    public new string IpAddress { get; set; } = string.Empty;
}

