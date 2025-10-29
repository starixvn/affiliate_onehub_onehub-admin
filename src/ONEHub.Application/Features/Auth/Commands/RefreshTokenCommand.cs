using ONEHub.Application.Common;
using ONEHub.Application.DTOs.Auth;
using ONEHub.Domain.Results;

namespace ONEHub.Application.Features.Auth.Commands;

public class RefreshTokenCommand : BaseCommand<ServiceResult<LoginDto>>
{
    public string RefreshToken { get; set; } = string.Empty;
    public new string IpAddress { get; set; } = string.Empty;
}

