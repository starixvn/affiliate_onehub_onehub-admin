using MediatR;
using ONEHub.Application.DTOs.Auth;

namespace ONEHub.Application.Features.Auth.Commands;

public class RefreshTokenCommandHandler : IRequestHandler<RefreshTokenCommand, LoginDto>
{
    public async Task<LoginDto> Handle(RefreshTokenCommand request, CancellationToken cancellationToken)
    {
        await Task.CompletedTask;

        return new LoginDto
        {
            AccessToken = string.Empty,
            RefreshToken = request.RefreshToken,
            ExpiresAt = DateTime.UtcNow.AddHours(1),
            UserId = 0,
            UserName = string.Empty
        };
    }
}

