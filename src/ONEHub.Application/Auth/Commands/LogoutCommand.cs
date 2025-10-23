using MediatR;

namespace ONEHub.Application.Auth.Commands;

public class LogoutCommand : IRequest<bool>
{
    public int UserId { get; set; }
    public string SessionId { get; set; } = string.Empty;
}

