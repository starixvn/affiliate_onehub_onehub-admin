using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Auth.Commands;

public class LoginCommand : BaseCommand<LoginDto>
{
    public string UserName { get; set; } = string.Empty;
    public string Password { get; set; } = string.Empty;
    public new string IpAddress { get; set; } = string.Empty;
    public string UserHostName { get; set; } = string.Empty;
}

