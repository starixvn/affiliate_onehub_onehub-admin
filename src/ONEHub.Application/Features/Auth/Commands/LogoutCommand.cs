using MediatR;

namespace ONEHub.Application.Features.Auth.Commands;

public class LogoutCommand : IRequest<bool>
{
    public int UserId { get; set; }
    public string SessionId { get; set; } = string.Empty;
    public string IpAddress { get; set; } = string.Empty;
}

